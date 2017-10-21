from sklearn.linear_model import SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.externals import joblib
from os import listdir
import numpy as np
from scipy.sparse import hstack
import nltk
import string
import re

s = open('stopwords.txt', 'r', encoding='utf-8')
stopwords = list(map(lambda x: x[:-1], s.readlines()))

vectorizer = TfidfVectorizer()

def read_data(y,convs):
    a=[]
    for i in listdir('train_set'):
        f = open('train_set'+'\\'+i, encoding='utf-8')
        f = f.readlines()
        convs.append([int(i[-5]), len(f)//2])
        f = [re.sub('\n', '', i) for i in f]
        for i in range(len(f)//2):
            y.append(int(f[i*2][-1]))
            f[i*2]=f[i*2][:-1]
        a.append(f)
        print(f)
    return a

y=[]
convs=[]
data = read_data(y, convs)
docs = [data[i][x*2] for i in range(len(data)) for x in range(len(data[i])//2)]

conset = []
convdocs = []
s = 0
number = 0
for i in convs:
    conset.append(y[s:s+i[1]])
    convdocs.append('')
    for j in range(s, s+i[1]):
        print(docs[j])
        convdocs[number]+= ' ' + docs[j]
    number+=1
    s += i[1]
print(convdocs)
stemmer = nltk.stem.snowball.RussianStemmer()

k=[]
for i in docs:
    j = nltk.word_tokenize(i)
    j = [k for k in j if not k in string.punctuation]
    j = [stemmer.stem(k) for k in j]
    j = [k for k in j if not k in stopwords]
    k.append(' '.join(j).lower())
docs = k


vectorizer.fit(docs)
docs = vectorizer.transform(docs)

clf = MultinomialNB()
clf.fit(docs, y)

test = vectorizer.transform(['редиска, не брат ты мне больше',
                      'хороший ты человек, но редиска',
                      'ты дурак'])

clfdisc = SGDClassifier()


docs = vectorizer.transform(convdocs)
x=[]
for i in conset:
    x.append([i.count(1)/len(i)])
x=np.array(x)
docs = hstack([docs,x])
print(docs.toarray())
y_disc = []
for i in convs:
    y_disc.append(i[0])
print(y_disc)

clfdisc.fit(docs, y_disc)

print(clfdisc.predict(docs))
#print(convs)
#print(clf.predict(test))

joblib.dump(clfdisc, 'SGD_pars')
joblib.dump(vectorizer, 'TFIDF_pars')
joblib.dump(clf, 'NB_pars')
