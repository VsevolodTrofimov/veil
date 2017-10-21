# <- VEIL
#       id[], postId[]
# -> COMMENT
#       commentId, postId =/= -1, authorId, text, replies[commentId]
#
# -> CONNECT
#       userId
#

#
#  Получаем коменты 1бай1.
#  В бд - пост_ид примари, (время добавления), json - массив дискашнов
#
#  вырезать свой из вейла

from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from models import db, Discussions, Discussion, Veils, Comment
from baseclass import Base
import urllib.request
import json

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
    send('sent')

@socket.on('comment')
def receive_comment(data):
    our_guy = clients[str(request.sid)]
    comment = Comment(data['commentId'], data['postId'], data['authorId'], data['text'], data['replies'])
    if comment.postId == -1:
        print("Discussion - bad id.")
        send('Error')

    response = Discussions.query.filter_by(postId=comment.postId).one_or_none()
    if (response == None):
        print("Discussion: no such discussion. Creating new one.")

    discussions = response.discussions
    discussions_changed = discussions_append_comment(discussions, comment)


def discussions_append_comment(discussions, comment):
    for d in discussions:
        pass

    return discussions

if __name__ == '__main__':
    socket.run(app, port=5000)
