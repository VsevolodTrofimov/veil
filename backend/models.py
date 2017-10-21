from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

db = SQLAlchemy()


class Discussions(db.Model):
    __tablename__ = 'discussions'
    postId = db.Column(db.String, primary_key=True)
    users = db.Column(db.ARRAY(db.String))
    discussions = db.Column(db.ARRAY(db.String))

class Veils(db.Model):
    __tablename__ = 'veils'

    veilId = db.Column(UUID, primary_key=True)
    postId = db.Column(db.String)
    users = db.Column(db.ARRAY(db.String))


class Comment(object):
    commentId = ""
    postId = ""
    authorId = ""
    text = ""
    replies = []

    def __init__(self, _commentId, _postId, _authorId, _text, _replies):
        self.commentId = _commentId
        self.postId = _postId
        self.authorId = _authorId
        self.text = _text
        self.replies = _replies


class Discussion(object):
    pass
