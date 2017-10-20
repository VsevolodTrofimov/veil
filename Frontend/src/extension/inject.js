// import game

const makeGame = () => {
    const game = document.createElement('div')
    game.innerHTML = `<div style="
                        width: 510px;
                        height: 400px;
                        background: #eee;
                        border-radius: 4px;"
                      ></div>`

    return game
}

const fakePost = () => {
    const feedRow = document.createElement('div')

    feedRow.classList.add('feed_row')

    feedRow.innerHTML = `
        <div class='_post post page_block'>
            <div class='post_header' style='min-height: 0'></div>
            <div class='wall_text'>
            </div>
        </div>`

    return feedRow
}

const injectGame = () => {
    const wall = document.getElementById('feed_rows')
    const post = fakePost()
    const game = makeGame()

    post.querySelector('.wall_text').appendChild(game)

    const postInserted = wall.insertBefore(post, wall.children[8])
}

export default injectGame