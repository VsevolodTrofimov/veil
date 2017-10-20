from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socket = SocketIO(app)


# <- VEIL
#       id[], post_id[]
# -> COMMENT
#       post_id, text, sender_id, replies[]
#
# -> CONNECT
#       user_id
#

# file
# comment
# id
# comment
# id


@socket.on('connect')
def handshake(user_id):
    print("Recieved user_id" + user_id)


@socket.on('veil')
@socket.on('comment')
def


if __name__ == '__main__':
    socket.run(app)
