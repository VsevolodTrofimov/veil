export const verdict = ({state, getters, commit}, verdict) => { 
    //send to server
    const comment = getters.currentComment

    commit('verdict', {verdict, comment})
    commit('next')
}

const parseSeverDiscussion = discussion => {
    
}
    
export const getDiscussions = ({commit}) => {
    //fetch
    setTimeout(() =>
    commit('init', [['1-1', '1-2'], 
                    ['2-1', '2-2', '2-3'], 
                    ['3-1', '3-2', '3-3', '3-4']])
    , 1000)
}