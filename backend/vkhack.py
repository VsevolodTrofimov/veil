# <- VEIL
#       id[], postId[]
# -> COMMENT
#       commentId, postId =/= -1, authorId, text, replies[commentId]
#
# -> CONNECT
#       userId
#

#  вырезать свой из вейла

from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from models import db, Discussion, Veils, Comment
from baseclass import Base
import urllib.request
import json
import os
import jsonpickle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:123456@localhost/veil'
db.init_app(app)
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

    emit('connect_reply', 'CONNECTED')
    # veils = list(map(lambda o: json.dumps(o), Veils.query.filter_by(userId=userScreenName).all()))

    # send(veils)


@socket.on('disconnect')
def disconnect():
    print('User id%s disconnected' % clients[request.sid])

@socket.on('veil')
def send_veil():
    pass

@socket.on('comment')
def receive_comment(data):
    our_guy = clients[str(request.sid)]
    comment = Comment(data['commentId'], data['postId'], data['authorId'], data['text'], data['mentions'])
    if comment.postId == -1:
        print("Discussion - bad id.")
        send('Error. Bad id.')

    response = Discussion.query.filter_by(postId=comment.postId).all()
    if ((not response) and (comment.authorId == our_guy)):
        print("Discussion: no discussion. Creating new one.")
        new_disc = Base(comment.postId, [[comment.commentId, comment.mentions, comment.text, comment.authorId]])
        users_disc = [u for u in new_disc.comments]
        db_disc = Discussion(comment.postId, comment.commentId, comment.authorId, users_disc,
                             jsonpickle.encode(new_disc.comments), False)

        db.session.add(db_disc)
        db.session.commit()
    else:
        for discussion in response:
            comments = [[k] + v for (k, v) in jsonpickle.decode(discussion.discussion)]
            new_disc = Base(discussion.rootId, comments)
            new_disc.addnew(comment.mentions, comment.text.comment.commentId, comment.authorId)
            users_disc = [u for u in new_disc.comments]
            discussion.users = users_disc
            discussion.discussion = jsonpickle.encode(new_disc.comments)
        db.session.commit()

    export_to_ml()


def export_to_ml():
    exp_path = os.path.abspath(os.path.join(os.getcwd(), "../ML/pred_set"))
    disc = Discussion.query.filter_by().all()

    for d in disc:
        open(os.path.join(exp_path, "id_%s_%s.txt" % (d.postID, d.rootId)), 'w')
        comments = [[k] + v for (k, v) in jsonpickle.decode(d.discussion)]
        new_disc = Base(d.rootId, comments)



if __name__ == '__main__':
    socket.run(app, port=5000)
