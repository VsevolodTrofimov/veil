// import game

const $makeMessageBox = (text, from='bot') => {
    const $message = document.createElement('div')
    $message.innerText = text
    $message.style.padding = '16px'
    $message.style.marginBottom = '20px'

    if(from === 'player') $message.style.alignSelf = 'flex-end'

    return $message
}

const renderStage = ({$chatbox}, stage) => {
    stage.text.forEach(text => {
        $chatbox.appendChild($makeMessageBox(text))
    })
}

const $makeAction = (context, action) => {
    const $btn = document.createElement('button')
    $btn.classList.add('flat_button')
    $btn.innerText = action.text

    $btn.addEventListener('click', () => transition(context, action))

    return $btn
}
const renderActions = (context, actions) => {
    context.$actionbox.innerHTML = ''

    actions.forEach(action => {
        context.$actionbox.appendChild($makeAction(context, action))
    });
}

const transition = (context, action) => {

}

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
                        <div class='chat' style="display:flex; felx-direction: column; justify-content: flex-start;"> </div>
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

    const $postInserted = $wall.insertBefore($post, wall.children[8])
}

export default injectGame