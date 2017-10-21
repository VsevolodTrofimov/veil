// import game

var gameMap = {
    'clickbait': {
        text: ['Достали тролли?'],
        actions: [{
            text: 'Ага!',
            goto: 'resist'
        }, {
            text: 'Игнорю их и не парюсь',
            goto: 'im good'
        }]
    },
    'im good': {
        text: ['Так держать! Но не забывай помогать тем, кто трепетнее к этому отностится'],
        actions: []
    }
}

const $makeMessageBox = (text, from='bot') => {
    const $message = document.createElement('div')
    $message.textContent = text
    $message.style.padding = '15px'
    $message.style.marginBottom = '20px'
    $message.style.border = '1px solid #eee'
    
    if(from === 'player') {
        $message.style.alignSelf = 'flex-end'
        $message.style.background = '#edf0f5'
    } else {
        $message.style.alignSelf = 'flex-start'
    }

    return $message
}

const $makeAction = (context, action) => {
    const $btn = document.createElement('button')
    $btn.classList.add('flat_button')
    $btn.style.marginRight = '15px'
    $btn.textContent = action.text

    $btn.addEventListener('click', () => transition(context, action))

    return $btn
}
const renderActions = (context, actions) => {
    context.$actionbox.innerHTML = ''

    actions.forEach(action => {
        context.$actionbox.appendChild($makeAction(context, action))
    });
}

const renderStage = (context, stage) => {
    context.map[stage].text.forEach(text => {
        context.$chatbox.appendChild($makeMessageBox(text))
    })

    renderActions(context, context.map[stage].actions)
}


const transition = (context, action) => {
    context.$chatbox.appendChild($makeMessageBox(action.text, 'player'))
    renderStage(context, action.goto)
}

const makeContext = (map, $game) => ({
    map,
    $chatbox: $game.querySelector('.chat'),
    $actionbox: $game.querySelector('.actions')
})

const $makeGame = () => {
    const $game = document.createElement('div')
    $game.innerHTML = `<div style="
                        width: 100%;
                        height: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        border-radius: 4px;"
                      >
                        <div class='chat' style="display:flex; flex-direction: column; justify-content: flex-start; padding: 0 15px;"> </div>
                        <div class='actions submit_post' style="display:flex; felx-direction: row; flex-wrap: wrap;"> </div>
                      </div>`

    return $game
}

const $fakePost = () => {
    const $feedRow = document.createElement('div')

    $feedRow.classList.add('feed_row')

    $feedRow.innerHTML = `
        <div class='_post post page_block'>
            <div class='post_header' style='min-height: 0'></div>
        </div>`

    return $feedRow
}

const injectGame = () => {
    const $wall = document.getElementById('feed_rows')
    const $post = $fakePost()
    const $game = $makeGame()

    $post.querySelector('.post').appendChild($game)

    const context = makeContext(gameMap, $game)

    renderStage(context, 'clickbait')

    const $postInserted = $wall.insertBefore($post, $wall.children[8])
}

export default injectGame