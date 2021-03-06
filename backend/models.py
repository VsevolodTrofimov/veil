from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

db = SQLAlchemy()


class Discussion(db.Model):
    key = db.Column(db.String, primary_key=True)
    postId = db.Column(db.String)
    rootId = db.Column(db.String)
    protId = db.Column(db.String)
    users = db.Column(db.ARRAY(db.String))
    discussion = db.Column(db.JSON)
    length = db.Column(db.Integer)
    veiled = db.Column(db.Boolean)
    rated = db.Column(db.Boolean)

    def __init__(self, key, postId, rootId, protId, users, discussions, length, veiled, rated):
        self.key = key
        self.postId = postId
        self.rootId = rootId
        self.protId = protId
        self.users = users
        self.discussion = discussions
        self.length = length
        self.veiled = veiled
        self.rated = rated

class Veils(db.Model):
    veilId = db.Column(UUID, primary_key=True)
    postId = db.Column(db.String)
    users = db.Column(db.ARRAY(db.String))


class Comment(object):
    commentId = ""
    postId = ""
    authorId = ""
    text = ""
    mentions = []

    def __init__(self, commentId, postId, authorId, text, mentions):
        self.commentId = commentId
        self.postId = postId
        self.authorId = authorId
        self.text = text
        self.mentions = mentions
