import { WATCH_INTERVAL } from './config'

export const $getCommentsByPostId = postId => {
    const $commentBlock = document.querySelector(`#replies${postId}`)
    return Array.from($commentBlock.children)
}

export const parseReplyLink = ($replyLink, postId = -1) => {
    const linkAction = $replyLink.getAttribute('onclick')
    const linkArguments = linkAction.split('return wall.showReply(')[1].split(')')[0]

    const originalCommentIdArg = linkArguments.split(',')[2].trim()
    const originalCommentId = originalCommentIdArg.substring(1, originalCommentIdArg.length - 1)

    const $originalComment = document.querySelector(`[data-post-id="${originalCommentId}"]`)

    if($originalComment)
        return parseComment($originalComment, postId)
    else return {}
}

export const parseComment = ($comment, postId = -1) => {
    const commentId = $comment.getAttribute('data-post-id')
    const authorId = $comment.querySelector('a.author').getAttribute('data-from-id')
   
    const replyLinks = Array.from($comment.querySelectorAll('a.reply_to')) 
    const replies = replyLinks.map($replyLink => parseReplyLink($replyLink).commentId)

    const text = $comment.querySelector('.reply_text').textContent

    return {commentId, authorId, postId, text, replies}
}

export default parseComment


// Watchers
const watchedPosts = []

const nextWatcherId = 0

export const watchPost = (postId, cb) => {
    const postToBeWatched = {
        postId,
        cb,
        oldComments: [],
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
            const $comments = $getCommentsByPostId(watcher.postId)
            $comments.forEach($comment => {
                if(watcher.oldComments.indexOf($comment) === -1) {
                    const comment = parseComment($comment)
                    cb(comment)
                }
            })
        } catch (err) {
            unwatchPost
        }
    })
}, WATCH_INTERVAL)