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
    console.log(comment)

    let text = decodeURIComponent(JSON.parse('"' + comment[1] + '"'))
    if(text.startsWith("b'")) text = text.substring(2, text.length - 1)

    return {
        //escaping utf8
        text: text,
        authorId: comment[2]
    }
}

const parseServerData = discussions => {
    // const escaped = discussions.replace(/"\s*{/g, '{').replace(/}\s*"/g, '}')
    // console.log(escaped)
    const arr = JSON.parse(discussions)
    
    const res = arr.map(disc => {
        console.log(disc.comments)
        const comments = Object.values(JSON.parse(disc.comments)).map(parseComment)

        return {comments}
    })

    return res
}

export const getDiscussions = ({commit}) => {
    //fetch
    fetch('/data/getDiscussions')
        .then(res => res.text())
        .then(data => {
            console.log(data)
            data = [{
                comments: [{
                    authorId: 'https://vk.com/fidelpinochetov',
                    text: 'То, что младший комсостав их на месте применил не так, как надо - проблема не танков.'
                },
                           {
                    authorId: 'https://vk.com/alxfu3uk',
                    text: 'Согласен, человеческий фактор решает, ничего удивительного'
                },
                           {
                    authorId: 'https://vk.com/id311219213',
                    text: 'Илья, да что ты такое несешь!! ТЫ поехавший?!! При чем тут коммунисты, скажи пожалуйста?! ОНи в операции даже не участвовали!!!'
                },
                           {
                    authorId: 'https://vk.com/fidelpinochetov',
                    text: 'Андрей, они прямое отношение имеют. Советую почитать статью хотя бы в вики, прежде чем писать сюда.'
                },
                           {
                    authorId: 'https://vk.com/id311219213',
                    text: 'Илья, сорян, загуглил, нашел документы. Не знал, спасибо. Мнн стоит все же подучить историю))'
                }],
            }, {
                comments: [{
                    authorId: 'https://vk.com/id_fag',
                    text: 'Хорош, хохлы! Прочь отсюда нафиг!!'
                },
                           {
                    authorId: 'https://vk.com/lisunov_am',
                    text: 'Сам бы шел отсюда, петушок'
                },
                           {
                    authorId: 'https://vk.com/victor_sakhnov',
                    text: 'Вообще все отсюда пошли! Мой паблос, моя страна! ИЛИ УСПОКОИЛИСЬ БЫСТРО!'
                }]
            }]
            commit('init', data)
            // commit('init', parseServerData(data))
        })
        .catch(console.error)
    
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