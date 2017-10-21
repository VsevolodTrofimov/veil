# <- VEIL
#       id[], postId[]
# -> COMMENT
#       commentId, postId =/= -1, authorId, text, replies[commentId]
#
# -> CONNECT
#       userId
#

from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from models import db, Discussion, Veils, Comment
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

socket = SocketIO(app)

clients = {}


@app.route('/')
def home():
    return ''


@socket.on('connected')
def get_userid_and_send_all_veils(data):
    userId = data['userId']

    response_raw = urllib.request.urlopen(
        "https://api.vk.com/method/utils.resolveScreenName?screen_name=" + userId).read().decode("utf-8")
    response = json.loads(response_raw)
    userScreenName = str(response['response']['object_id'])

    print("%s connected. Sending veils" % userScreenName)
    clients[str(request.sid)] = userScreenName

    send_veil()


@socket.on('disconnect')
def disconnect():
    print('User id%s disconnected' % clients[request.sid])


@socket.on('veil')
def send_veil():
    for d in Discussion.query.filter(Discussion.veiled == True).all():
        data = {}
        data['type'] = 'VEIL'
        data['data']['post_id'] = d.postID
        data['data']['user_ids'] = [u for u in d.users if u != clients[request.sid]]

        emit('response', data, json=True, room=request.sid)


@socket.on('comment')
def receive_comment(data):
    our_guy = clients[str(request.sid)]

    comment = Comment(data['commentId'], data['postId'], data['authorId'], data['text'], data['mentions'])
    if comment.postId == "-1":
        print("Discussion - bad id.")
        send('Error. Bad id.')


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


@socket.on('send_discussions')
def send_discussions():
    result = []
    disc = Discussion.query.filter(Discussion.rated == True).limit(5).all()

    for d in disc:
        result.append(jsonpickle.decode(disc.discussion))

    emit('send_discussions', result, json=True, room=request.sid)



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
    socket.run(app, port=5000)
