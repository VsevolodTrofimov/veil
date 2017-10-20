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

const socket = io('172.19.244.120:5000')

socket.on('connect', console.log);
socket.on('error', console.error)

export default socket