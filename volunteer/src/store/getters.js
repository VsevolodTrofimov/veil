export const currentComment = state => {
    if(state.allDone) return false
    
    const { discussion, idx } = state.cursor
    
    console.log(state.comments)
    return state.discussions[discussion][idx]
}
