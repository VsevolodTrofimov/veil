import * as spy from './spy'

import { $getCommentsByPostId, parseReplyLink, parseComment} from './comments'

export const veil = (postId, userIds) => {
    const $postComments = $getCommentsByPostId(postId)
    const $more = document.querySelector(`[data-post-id="${postId}"] .wr_header`)    
    if($more) {
        console.log('set listener')
        $more.addEventListener('click', () => {
            console.log('reacted')
            setTimeout(() => veil(postId, userIds), 200)
        })
    }

    $postComments.forEach($comment => {
        if($comment !== null) {
            const parsedComment = parseComment($comment, postId)
            const commentAuthor = parsedComment.authorId
            if(userIds.indexOf(commentAuthor) !== -1) {
                console.log('removed comment', parsedComment.commentId)
                $comment.remove()
            }
        }
    })

    // console.log('veilComplete')
}

export default veil


// Watchers
const watchedPosts = []

let nextWatcherId = 0

export const watchPost = (postId, userIds) => {
    const postToBeWatched = {
        postId,
        userIds,
        watcherId: nextWatcherId++
    }

    veil(postId, userIds)

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

spy.add(() => {
    watchedPosts.forEach(watcher => {
        try {
            veil(watcher.postId, watcher.userIds)
        } catch (err) {
            console.error(err)
            unwatchPost(watcher.watcherId)
        }
    })
})
