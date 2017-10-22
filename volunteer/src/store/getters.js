export const currentComment = state => {
    if(state.stage !== 'comment') return false
    
    const { discussion, idx } = state.cursor
    return state.discussions[discussion].comments[idx]
}



export const currentDiscussion = state => {
    if(state.stage !== 'discussion') return false
    
    const currDiscussion = state.discussions[state.cursor.discussion]

    const commentAuthorIds = []
    const discussionComments = currDiscussion.comments.map(comment => {
        const authorIdIdx = commentAuthorIds.indexOf(comment.authorId)

        let maskedId = 0

        if(authorIdIdx === -1) {
            commentAuthorIds.push(comment.authorId)
            maskedId = commentAuthorIds.length
        } else {
            maskedId = authorIdIdx + 1
        }

        return Object.assign({}, comment, {user: maskedId})
    })

    const res = Object.assign({}, currDiscussion, {comments: discussionComments})
    
    return res
}
