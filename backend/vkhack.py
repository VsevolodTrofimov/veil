# <- VEIL
#       id[], postId[]
# -> COMMENT
#       commentId, postId =/= -1, authorId, text, replies[commentId]
#
# -> CONNECT
#       userId
#

from flask import Flask, request, jsonify
# from flask_socketio import SocketIO, send, emit
import socketio
import eventlet
import eventlet.wsgi
from eventlet.green.OpenSSL import SSL
from models import db, Discussion, Veils, Comment
import ssl
from baseclass import Base
import urllib.request
import json
from os import path, getcwd, remove, listdir
import re
import jsonpickle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:123456@localhost/veil'

db.init_app(app)
with app.app_context():
    db.create_all()
    db.session.commit()
    """
    disc = Base('58833',
                [['58833', ['-1'], 'редиска и свекла', '5'],
                 ['58834', ['58833', '-1'], 'хорошо', '3'],
                 ['58835', ['58834'], 'Ну и дурак', '5'],
                 ['58836', ['58835', '58834'], 'умный и хороший человек!', '3'],
                 ['58837', ['-1', '-1', '-1'], 'а я вообще левый', '2'],
                 ['58838', ['58837', '-1'], 'а я тоже', '1'],
                 ['58839', ['58835', '58834'], 'умный и хороший человек!', '3'],
                 ['58840', ['58835', '58834'], 'умный и хороший человек!', '3'],
                 ['58841', ['58835', '58834'], 'умный и хороший человек!', '3']]
                )

    users_disc = [u for u in disc.comments]
    db_disc = Discussion(disc.rootId + users_disc[0][0], disc.rootId, users_disc[0][0], users_disc[0][3],
                         users_disc,
                         jsonpickle.encode(disc.comments), len(disc.comments), False, False)
    print(db_disc)
    db.session.add(db_disc)
    db.session.commit()
    """


sio = socketio.Server()

clients = {}


@app.route('/')
def home():
    return ''


@sio.on('connect')
def connect(sid, environ):
    print("CONNECTED: ", sid)
    return 'OK'


@sio.on('disconnect')
def disconnect(sid):
    print('DISCONNECTED: %s' % clients[sid])


@sio.on('connected')
def get_userid_and_send_all_veils(sid, data):
    print("HUY")
    data = json.loads(data)
    userId = data['userId'][1:]
    response_raw = urllib.request.urlopen(
        "https://api.vk.com/method/utils.resolveScreenName?screen_name=" + userId).read().decode("utf-8")
    response = json.loads(response_raw)
    userScreenName = str(response['response']['object_id'])

    clients[str(sid)] = userScreenName
    print(clients)

    print("%s connected" % userScreenName)

    send_veil()

def send_veil():
    for d in Discussion.query.filter(Discussion.veiled == False).all():
        data = {}
        data['data'] = {}
        data['data']['post_id'] = d.postId
        data['data']['user_ids'] = [u for u in d.users if u != clients[request.sid]]

        sio.emit('veil_send', data)


@sio.on('comment')
def receive_comment(sid, data):
    our_guy = clients[str(sid)]
    data = json.loads(data)
    print(data)

    comment = Comment(data['commentId'], data['postId'], data['authorId'], data['text'], data['mentions'])
    if comment.postId == "-1":
        print("Discussion - bad id.")
        sio.emit('comment_reply', 'Error. Bad id.')

    response = Discussion.query.filter_by(postId=comment.postId).all()
    if (not response) or (comment.mentions == ['-1'] and comment.authorId == our_guy):
        print("Discussion: no discussion. Creating new one.")
        print([comment.commentId, comment.mentions, comment.text, comment.authorId])
        new_disc = Base(comment.postId, [[comment.commentId, comment.mentions, comment.text, comment.authorId]])
        users_disc = [u for u in new_disc.comments]
        db_disc = Discussion(comment.postId + comment.commentId, comment.postId, comment.commentId, comment.authorId,
                             users_disc,
                             jsonpickle.encode(new_disc.comments), len(new_disc.comments), False, False)

        db.session.add(db_disc)
        db.session.commit()
    else:
        for discussion in response:
            comments = [[k] + v for (k, v) in jsonpickle.decode(discussion.discussion).items()]
            new_disc = Base(discussion.rootId, comments)
            new_disc.addnew(comment.mentions, comment.text, comment.commentId, comment.authorId)
            users_disc = [u for u in new_disc.comments]
            discussion.users = users_disc
            discussion.discussion = jsonpickle.encode(new_disc.comments)
            discussion.length = len(new_disc.comments)
        db.session.commit()

    export_to_ml()
    send_veil()


@sio.on('getveils')
def send_veils(userId):
    pass

@app.route('/getDiscussions')
def send_discussions():
    result = []
    disc = Discussion.query.filter(Discussion.rated == False).limit(5).all()
    for d in disc:
        dic = {}
        dic['postId'] = d.postId
        dic['comments'] = d.discussion
        result.append(dic)

    return (jsonify(result))


@app.route('/postDiscussion', methods=['POST'])
def receive_discussions_and_export_to_ml():
    data = request.form['data']
    dat = json.loads(data)

    exp_path = path.abspath(path.join(getcwd(), "../ML/train_set"))

    root_id = dat['comments'][0][0]
    discussion_verdict = dat['offensive']

    f = open(path.join(exp_path, "id_%s_%s_%s.txt" % (dat['postId'], root_id, discussion_verdict)), 'w')
    s = ""
    for c in dat['comments']:
        com_id = c[0]
        text = c[1]
        verdict = c[2]
        s += text + verdict + '\r\n' + com_id + "\r\n"
        f.write(s)
    f.close()


def export_to_ml():
    exp_path = path.abspath(path.join(getcwd(), "../ML/pred_set"))

    disc = Discussion.query.filter(Discussion.length >= 3).all()
    for d in disc:
        f = open(path.join(exp_path, "id_%s_%s_3.txt" % (d.postId, d.rootId)), 'w')
        comments = [[k] + v for (k, v) in jsonpickle.decode(d.discussion).items()]
        new_disc = Base(d.rootId, comments)
        f.write(new_disc.print2csv_last(3))
        f.close()

    disc = Discussion.query.filter(Discussion.length >= 5).all()
    for d in disc:
        f = open(path.join(exp_path, "id_%s_%s_5.txt" % (d.postId, d.rootId)), 'w')
        comments = [[k] + v for (k, v) in jsonpickle.decode(d.discussion)]
        new_disc = Base(d.rootId, comments)
        f.write(new_disc.print2csv_last(5))
        f.close()


def read_res_and_write_to_db():
    k = []
    res_path = path.abspath(path.join(getcwd(), "../ML/pred_res"))
    for i in listdir(res_path):
        a = open(path.join(res_path, i), 'r')
        a = a.read()
        k.append(tuple([re.split(r'[._]', i)[1:-2], a[0]]))
        remove(path.join(res_path, i))

    for v in k:
        d = Discussion.query.filter(Discussion.postId == v[0][0]).filter(Discussion.rootId == v[0][1]).first()
        d.veiled = True if (v[1][1] == '1') else False
        db.session.commit()

if __name__ == '__main__':
    # socket.run(app, port=5000, keyfile='key.pem', certfile='cert.pem')
    #   app.run(app, port=5000)
    app = socketio.Middleware(sio, app)

    eventlet.wsgi.server(eventlet.wrap_ssl(eventlet.listen(('194.67.208.71', 5000)),
                                           certfile='/etc/letsencrypt/live/vkhack.v-trof.ru/cert.pem',
                                           keyfile='/etc/letsencrypt/live/vkhack.v-trof.ru/privkey.pem',
                                           server_side=True,
                                           ssl_version=ssl.PROTOCOL_SSLv23),
                         app)


# eventlet.wsgi.server(eventlet.listen(('194.67.208.71', 5000)), app)
