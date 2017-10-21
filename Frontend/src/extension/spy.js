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


const spy = () => {
    console.log('spied')
    spyCb.forEach(cb => cb.exec())
}

const shouldSpy = $el => {
    // console.log('to spy or not to spy')
    if($el && $el.getAttribute) {
        const id = $el.getAttribute('id')
        if(id && id.substring(0, 12) === 'replies_side') {
            spy()
        }
    }
}

let vkshow = window.show
window.show = function() {
    shouldSpy(...arguments)
    vkshow(...arguments)
}

wall.vkshowReplies = wall.showReplies
wall.showReplies = function() {
    spy()
    return wall.vkshowReplies(...arguments)
}


let WkViewSpySet = setInterval(() => {
    if(window.WkView) {
        clearInterval(WkViewSpySet)
        console.log('set WkView spy')
        WkView.vkarrows = WkView.updateArrows
        WkView.updateArrows = function() {
            spy()
            return WkView.vkarrows(...arguments)
        }
    }
}, 100)