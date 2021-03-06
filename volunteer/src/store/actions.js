import xhr from 'superagent'

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

const parseComment = comment => {
    return {
        //escaping utf8
        text: decodeURIComponent(JSON.parse('"' + comment[1].replace(/\"/g, '\\"') + '"')),
        authorId: comment[2]
    }
}

const parseServerData = discussions => {
    const escaped = discussions.replace(/"s*{/g, '{').replace(/}s*"/g, '}')
    const arr = JSON.parse(escaped)
    
    const res = arr.map(disc => {
        const comments = Object.values(disc.comments).map(parseComment)

        return {comments}
    })

    return res
}

export const getDiscussions = ({commit}) => {
    //fetch
    fetch('/data/getDiscussions')
        // .then(res => res.json())
        .then(data => {
            console.log(data)
            commit('init', parseServerData(data))
        })
    
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
    const discussions = JSON.parse(JSON.stringify(state.discussions))
    discussions.forEach(desc => {
        xhr.post('/data/postDiscussion')
            .type('form')        
            .send({data: JSON.stringify(desc)})
            .end(resp => console.log(resp))
    })

}