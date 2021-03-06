import * as comments from './comments'

let nextCbId = 0
const spyCb = []

export const add = cb => {
    const newCb = {
        id: nextCbId++,
        exec: cb
    }
    spyCb.push(newCb)

    return newCb
}

export const remove = cbId => {
    for(let i = 0; i < spyCb.length; i++) {
        if(spyCb[i].id === cbId)
            spyCb.splice(i, 1)
            return true
    }
    return false
}
let wallSpySet = setInterval(() => {
    if(window.wall) {
        clearInterval(wallSpySet)
        console.log('wall engagement spy set')
        const vksendReply = wall.sendReply

        wall.sendReply = function() {
            spyCb.forEach(cb => cb.exec(arguments[0]))
            return vksendReply.call(this, ...arguments)
        }
    }
}, 100)
