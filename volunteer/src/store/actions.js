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
            data = `[
                {
                    "comments": "{\"-155414130_258\": [\"[]\", \"asd\", \"84234365\"], \"-155414130_259\": [\"['-155414130_258']\", \"\\u0418\\u043b\\u044c\\u044f, asd\", \"84234365\"], \"-155414130_260\": [\"['-155414130_259']\", \"\\u0418\\u043b\\u044c\\u044f, asdasd\", \"84234365\"], \"-155414130_261\": [\"[]\", \"\\u0435\\u0448 \\u0437\\u0448\\u044b\\u0444\", \"121457736\"]}", 
                    "postId": "-155414130_250"
                }, 
                {
                    "comments": "{\"-155414130_258\": [\"[]\", \"asd\", \"84234365\"], \"-155414130_259\": [\"['-155414130_258']\", \"\\u0418\\u043b\\u044c\\u044f, asd\", \"84234365\"], \"-155414130_260\": [\"['-155414130_259']\", \"\\u0418\\u043b\\u044c\\u044f, asdasd\", \"84234365\"], \"-155414130_261\": [\"[]\", \"\\u0435\\u0448 \\u0437\\u0448\\u044b\\u0444\", \"121457736\"], \"-155414130_262\": [\"[]\", \"\\u042d\\u044d\\u044d\", \"121457736\"]}", 
                    "postId": "-155414130_250"
                }, 
                {
                    "comments": "{\"-155414130_258\": [\"[]\", \"asd\", \"84234365\"], \"-155414130_259\": [\"['-155414130_258']\", \"\\u0418\\u043b\\u044c\\u044f, asd\", \"84234365\"], \"-155414130_260\": [\"['-155414130_259']\", \"\\u0418\\u043b\\u044c\\u044f, asdasd\", \"84234365\"], \"-155414130_261\": [\"[]\", \"\\u0435\\u0448 \\u0437\\u0448\\u044b\\u0444\", \"121457736\"], \"-155414130_262\": [\"[]\", \"\\u042d\\u044d\\u044d\", \"121457736\"], \"-155414130_263\": [\"[]\", \"\\u0412\\u043e\\u0442  \\u042d\\u0442\\u043e  \\u0412\\u0438\\u043d\", \"121457736\"]}", 
                    "postId": "-155414130_250"
                }, 
                {
                    "comments": "{\"-155414130_258\": [\"[]\", \"asd\", \"84234365\"], \"-155414130_259\": [\"['-155414130_258']\", \"\\u0418\\u043b\\u044c\\u044f, asd\", \"84234365\"], \"-155414130_260\": [\"['-155414130_259']\", \"\\u0418\\u043b\\u044c\\u044f, asdasd\", \"84234365\"], \"-155414130_261\": [\"[]\", \"\\u0435\\u0448 \\u0437\\u0448\\u044b\\u0444\", \"121457736\"], \"-155414130_262\": [\"[]\", \"\\u042d\\u044d\\u044d\", \"121457736\"], \"-155414130_263\": [\"[]\", \"\\u0412\\u043e\\u0442  \\u042d\\u0442\\u043e  \\u0412\\u0438\\u043d\", \"121457736\"], \"-155414130_264\": [\"['-155414130_260']\", \"Ilya, \\u0442\\u044b \\u043d\\u0435\\u043e\\u0447))))))))))\", \"121457736\"], \"-155414130_265\": [\"[]\", \"Update from origin/master\", \"121457736\"]}", 
                    "postId": "-155414130_250"
                }, 
                {
                    "comments": "{\"-155414130_258\": [\"[]\", \"asd\", \"84234365\"], \"-155414130_259\": [\"['-155414130_258']\", \"\\u0418\\u043b\\u044c\\u044f, asd\", \"84234365\"], \"-155414130_260\": [\"['-155414130_259']\", \"\\u0418\\u043b\\u044c\\u044f, asdasd\", \"84234365\"], \"-155414130_261\": [\"[]\", \"\\u0435\\u0448 \\u0437\\u0448\\u044b\\u0444\", \"121457736\"], \"-155414130_262\": [\"[]\", \"\\u042d\\u044d\\u044d\", \"121457736\"], \"-155414130_263\": [\"[]\", \"\\u0412\\u043e\\u0442  \\u042d\\u0442\\u043e  \\u0412\\u0438\\u043d\", \"121457736\"], \"-155414130_264\": [\"['-155414130_260']\", \"Ilya, \\u0442\\u044b \\u043d\\u0435\\u043e\\u0447))))))))))\", \"121457736\"], \"-155414130_265\": [\"[]\", \"Update from origin/master\", \"121457736\"]}", 
                    "postId": "-155414130_250"
                }
            ]`
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