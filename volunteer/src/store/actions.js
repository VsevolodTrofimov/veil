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
    commit('init', [['Passing Props to Route Components. Using $route in your component creates a tight coupling with the route which limits the flexibility of the component as it can ...', '1-2'], 
                    ['2-1', '2-2', '2-3'], 
                    ['3-1', '3-2', '3-3', '3-4']])
    , 1000)
}