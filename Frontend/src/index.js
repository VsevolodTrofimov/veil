import * as veil from './extension/veil'
import * as comments from './extension/comments'
import * as engageSpy from './extension/getEngagement'
import inject from './extension/inject'
import socket from './extension/socket'


socket.on('connect', () => {
    const userLink = document.querySelector('#l_pr a').getAttribute('href')
    socket.emit('connected', JSON.stringify({userId: userLink}))
})
socket.on('veil_send', data => {
    console.log('d', data)

    try{inject()}
    catch(err) {console.error(err)}

    veil.watchPost(data.postId, data.userIds)
})
socket.on('error', console.error)


const handleEngage = postId => {
    console.log('engaged')
    comments.watchPost(postId, comment => {
        if(comment.commentId.startsWith('0_')) return
        
        //FUCK YOU LIZARD MAN
        if(!comment.mentions.length) comment.mentions = ['-1']
        console.log('emit', comment)
        socket.emit('comment', JSON.stringify(comment))
    })
}
engageSpy.add(handleEngage)


module.exports = {
    veil, comments, inject
}