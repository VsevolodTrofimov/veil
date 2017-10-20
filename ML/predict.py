from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.externals import joblib
from sklearn.linear_model import SGDClassifier
from os import curdir
from os import listdir
from os import remove
import string
import nltk
import time
from scipy.sparse import hstack

stopwords=[]

clfdisc = joblib.load('SGD_pars')
clf = joblib.load('NB_pars')
vectorizer = joblib.load('TFIDF_pars')

while True:
    time.sleep(1)
    pred=[]
    files = listdir('pred_set')
    for i in files:
        comments = []
        a = open('pred_set\\'+i, encoding='utf-8')
        a = a.readlines()
        for l in range(0, len(a), 2):
            j=nltk.word_tokenize(a[l])
            j = [k for k in j if not k in string.punctuation]
            j = [k for k in j if not k in stopwords]
            comments.append(' '.join(j).lower())
        commentsmat = vectorizer.transform(comments)
        print(clf.predict(commentsmat))
        disc = ' '.join(comments)
        disc = vectorizer.transform([disc])
        disc = hstack([disc, clf.predict(commentsmat).tolist().count(1)/len(comments)])
        print(i)
        d = open('pred_res\\'+i, mode='w')
        d.write(str(clfdisc.predict(disc).tolist()[0]))
        remove('to_pred'+'\\'+i)