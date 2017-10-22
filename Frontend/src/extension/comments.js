import * as spy from './spy'

export const $getCommentsByPostId = postId => {
    const $comments = document.querySelectorAll(`#replies${postId} > .reply`)
    return Array.from($comments)
}

export const parseReplyLink = ($replyLink, postId = -1) => {
    const linkAction = $replyLink.getAttribute('onclick')
    const linkArguments = linkAction.split('return wall.showReply(')[1].split(')')[0]

    const originalCommentIdArg = linkArguments.split(',')[2].trim()
    const originalCommentId = originalCommentIdArg.substring(1, originalCommentIdArg.length - 1)

    const $originalComment = document.querySelector(`[data-post-id="${originalCommentId}"]`)

    if($originalComment)
        return parseComment($originalComment, postId)
    else return {commentId: -1}
}

//yeah it shuld be double escaped
const htmlToText = html => {
    html = html.replace(/(<br\s*\/?>)/g, ' ')
    html = html.replace(/<[^>]*>/g, '')

    return html
}

export const parseComment = ($comment, postId = -1) => {
    const commentId = $comment.getAttribute('data-post-id')
    const authorId = $comment.querySelector('a.author').getAttribute('data-from-id')
   
    const $replyLink = $comment.querySelector('a.reply_to') 
    console.log($replyLink)
    const mentions = $replyLink ? parseReplyLink($replyLink).commentId : '-1'

    const text = htmlToText($comment.querySelector('.wall_reply_text')
                         .innerHTML)

    return {commentId, authorId, postId, text, mentions}
}

export default parseComment


// Watchers
const watchedPosts = []

let nextWatcherId = 0

export const watchPost = (postId, cb) => {
    const newWatcher = {
        postId,
        cb,
        oldComments: [],
        watcherId: nextWatcherId++
    }

    if(watchedPosts.map(w => w.postId).indexOf(postId) === -1) {
        watchedPosts.push(newWatcher)
        return newWatcher
    }

    return false
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
        console.log(watchedPosts)
        try {
            const $comments = $getCommentsByPostId(watcher.postId)
            $comments.forEach($comment => {
                const comment = parseComment($comment, watcher.postId)
                if(watcher.oldComments.indexOf(comment.commentId) === -1) {
                    watcher.oldComments.push(comment.commentId)
                    watcher.cb(comment)
                }
            })
        } catch (err) {
            console.error(err)
            unwatchPost
        }
    })
})