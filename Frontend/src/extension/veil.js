import { WATCH_INTERVAL } from './config'

import { $getCommentsByPostId, parseReplyLink, parseComment} from './comments'

export const veil = (postId, userIds) => {
    const $postComments = $getCommentsByPostId(postId)
    
    $postComments.forEach($comment => {
        console.log('preVeil', $comment)
        if($comment !== null) {
            const parsedComment = parseComment($comment, postId)
            const commentAuthor = parsedComment.authorId
            if(userIds.indexOf(commentAuthor) !== -1) {
                console.log('removed comment ', parsedComment.commentId)
                $comment.remove()
            }
        }
    })

    console.log('veilComplete')
}

export default veil


// Watchers
const watchedPosts = []

const nextWatcherId = 0

export const watchPost = (postId, userIds) => {
    const postToBeWatched = {
        postId,
        userIds,
        watcherId: nextWatcherId++
    }

    watchedPosts.push(postToBeWatched)

    return postToBeWatched
}
export const unwatchPost = (targetWatcherId) => {
    for(let i=0; i<watchedPosts.length; i++) {
        if(watchedPosts[i].watcherId === targetWatcherId)
            watchedPosts.splice(i, 1)
            return true
    }

    return false
}

setInterval(() => {
    watchedPosts.forEach(watcher => {
        try {
            veil(post.postId, post.userIds)
        } catch (err) {
            unwatchPost(watcher.watcherId)
        }
    })
}, WATCH_INTERVAL)
