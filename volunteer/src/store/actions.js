export const verdict = ({state, getters, commit}, verdict) => { 
    //send to server
    const comment = getters.currentComment

    commit('verdict', {verdict, comment})
    commit('next')
}


export const verdictDiscussion = ({state, getters, commit}, verdict) => { 
    //send to server
    const discussion = state.discussions[state.cursor.discussion]

    commit('verdictDiscussion', {verdict, discussion})
    commit('nextDiscussion')
}

const parseDiscussions = respoce => {
    
}

const packDiscussions = discussions => {
    return JSON.stringify(discussions)
}

export const getDiscussions = ({commit}) => {
    //fetch
    fetch('/data/getDiscussions')
        .then(res => res.json())
        .then(data => commit('init', data))
    
    /* setTimeout(() =>
        commit('init', [{comments: [{
            authorId: '10',
            text: 'Passing Props to Route Components. Using $route in your component creates a tight coupling with the route which limits the flexibility of the component as it can ...'
        }, {
            authorId: '5',
            text: '1-2'
        }, {
            authorId: '5',
            text: 'Bad text'
        }]}, 
    ]), 5000) */
}

export const sendToServer = ({state, commit, dispatch}) => {
    //send store.discussions
    const discussions = packDiscussions(state.discussions)
    console.log('disc', discussions)
    fetch('')
        .then(dispatch('getDiscussions'))
}