/*  type VEIL
        -> id[]
        -> post_id
    type COMMENT
        -> commentId 
        -> postId
        -> authorId
        -> text
        -> mentions = [commentId]
    type CONNECT
        -> userLink
        
        
*/


import io from 'socket.io-client'

console.log('socket')

const socket = io.connect('wss://vkhack.v-trof.ru:5000/', {
    rejectUnauthorized: false,
    secure: true,
    verify: false,
    transports: ['websocket']
})


export default socket