export const init = (state, discussions) =>  {
    state.discussions = discussions 
    state.longestDiscsussion = discussions
                                .reduce((max, d) => d.comments.length > max 
                                                    ? d.comments.length : max
                                        , 0)
    state.cursor.idx = 0
    state.cursor.discussion = 0

    state.commentsDone = false
    if(discussions.length === 0)
        state.stage = 'done'
}

export const verdict = function (state, {verdict, comment}) {
    comment.offensive = verdict === 'offensive' ? 1 : 0
}

export const verdictDiscussion = function (state, {verdict, discussion}) {
    discussion.offensive = verdict === 'offensive' ? 1 : 0
}

const outOfBonds = (arr, idx) => {
    return arr.length <= idx
}

export const next = state => {
    do {
        if(state.cursor.discussion === state.discussions.length - 1
           && state.cursor.idx === state.longestDiscsussion - 1) {
            state.cursor.discussion = 0
            state.stage = 'discussion'
        } else if(state.cursor.discussion === state.discussions.length - 1) {
            state.cursor.discussion = 0
            state.cursor.idx++
        } else {
            state.cursor.discussion++
        }
    } while( ! state.commentsDone 
            && outOfBonds(
                  state.discussions[state.cursor.discussion].comments,
                  state.cursor.idx
               )
           )
}


export const nextDiscussion = state => {
    if(outOfBonds(state.discussions, state.cursor.discussion + 1)) {
        state.stage='done'
    } else {
        state.cursor.discussion++
    }
}