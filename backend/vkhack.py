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

from flask import Flask
from flask_socketio import SocketIO, send
from models import db, Discussions, Discussion, Veils, Comment
import urllib.request
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:123456@localhost/veil'
db.init_app(app)
socket = SocketIO(app)

@socket.on('connect')
def handshake(_userId):
    response = urllib.request.urlopen("https://api.vk.com/method/utils.resolveScreenName?screen_name=" + _userId).read()
    userScreenName = response.object_id

    # veils = list(map(lambda o: json.dumps(o). Veils.query.filter_by(userId=userScreenName).all()))
    print("Received user_id" + userScreenName + ". Sending veils.")

    # send(veils)

@socket.on('veil')
def send_veil():
    send('sent')



@socket.on('comment')
def receive_comment(_commentId, _postId, _authorId, _text, _replies):
    comment = Comment(_commentId, _postId, _authorId, _text, _replies)
    if _postId == -1:
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


def discussion2csv(discussion):
    pass

if __name__ == '__main__':
    socket.run(app, debug=True, port=5000)
