import * as veil from './extension/veil'
import * as comments from './extension/comments'
import * as engageSpy from './extension/getEngagement'

// import socket from './extension/socket'


const handleEngage = postId => {
    console.log('engaged')
    comments.watchPost(postId, console.warn)
}

engageSpy.add(handleEngage)

module.exports = {
    veil, comments,
    // socket
}