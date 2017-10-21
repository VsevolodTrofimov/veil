export const init = (state, discussions) =>  {
    state.discussions = discussions 
    state.longestDiscsussion = discussions
                                .reduce((max, d) => d.length > max 
                                                    ? d.length : max, 0)
    state.cursor.idx = 0
    state.cursor.discussion = 0

    state.allDone = false
}

export const verdict = function (state, {verdict, comment}) {
    state.comments[verdict].push(comment)
}

const outOfBonds = (arr, idx) => {
    return arr.length <= idx
}

export const next = state => {
    do {
        if(state.cursor.discussion === state.discussions.length - 1
           && state.cursor.idx === state.longestDiscsussion - 1) {
            state.allDone = true
            state.stage = 'desc'
            state.cursor.discussion = 0
        } else if(state.cursor.discussion === state.discussions.length - 1) {
            state.cursor.discussion = 0
            state.cursor.idx++
        } else {
            state.cursor.discussion++
        }
    } while( ! state.allDone 
            && outOfBonds(
                  state.discussions[state.cursor.discussion],
                  state.cursor.idx
               )
           )
}
