def bfs(ments, diction, root):
    flag = False
    for i in ments:
        if i==root:
            return True
        elif i!=-1:
            if bfs(diction[i][0], diction, root):
                return True
    return flag


class Base(object):
    comments = dict()
    root_id = -1 # id комментария подзащитного
    prot_id = 0 # id подзащитного
    chain = list() # список комментов из релевантной ветки, формата (id коммента, коммент)

    def __init__(self, root_id, comments):
        self.root_id = root_id
        for i in comments:
            self.comments[i[0]] = [i[1], i[2], i[3]] # i[0] - id коммента, i[1] - список id меншнов, i[2] - коммент, i[3] - id комментатора
            if i[0]!=root_id:
                self.addnew(i[1], i[2], i[0], i[3])
            else:
                self.chain.append(tuple([root_id,
                                         self.comments[root_id][1],
                                         self.comments[root_id][2]])) # root_id - id коммента подзащитного, comments[root_id] - коммент подзащитного
        self.prot_id = self.comments[root_id][2]
        print(self.chain)


    def addnew(self, ments, comment, com_id, user_id):
        if bfs(ments, self.comments, self.root_id):
            self.chain.append(tuple([com_id, comment, user_id]))
            self.comments[com_id] = [ments, comment, user_id]
        print(self.chain)

    def ret_last(self, n): # возвращает последние n реплаев
        k=[]
        if n>len(self.chain):
            for i in self.chain:
                k.append((i[0], i[1]))
            return k
        else:
            for i in range(1, n+1):
                k.append((self.chain[-1 * i][0], self.chain[-1 * i][1]))
            return k

    def print2csv_last(self, n):
        last = self.ret_last(n)
        for i in last:
            print(str(i[1]) + "\n" + str(i[0]))