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
from os import system

s = open('stopwords.txt', 'r', encoding='utf-8')
stopwords = list(map(lambda x: x[:-1], s.readlines()))

clfdisc = joblib.load('SGD_pars')
clf = joblib.load('NB_pars')
vectorizer = joblib.load('TFIDF_pars')

t = 0
stemmer = nltk.stem.snowball.RussianStemmer()

while True:
    pred=[]
    files = listdir('pred_set')
    for i in files:
        comments = []
        a = open('pred_set\\'+i, encoding='utf-8')
        a = a.readlines()
        for l in range(0, len(a), 2):
            j=nltk.word_tokenize(a[l])
            j = [k for k in j if not k in string.punctuation]
            j = [stemmer.stem(k) for k in j]
            j = [k for k in j if not k in stopwords]
            comments.append(' '.join(j).lower())
        commentsmat = vectorizer.transform(comments)
        print(clf.predict(commentsmat))
        disc = ' '.join(comments)
        disc = vectorizer.transform([disc])
        disc = hstack([disc, clf.predict(commentsmat).tolist().count(1)/len(comments)])
        print(i)
        d = open('pred_res\\'+i, mode='w')
        print(clfdisc.predict(disc))
        d.write(str(clfdisc.predict(disc).tolist()))
        d.close()
        remove('pred_set'+'\\'+i)
    t+=1
    time.sleep(1)
    if t==3600*24*30:
        system('chdir ' + curdir)
        system('python train.py')
        t=0
