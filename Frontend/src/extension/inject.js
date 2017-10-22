// import game

import gameMap from './gameMap'
import PerfectScrollbar from 'perfect-scrollbar'

const $makeMessageBox = (text, from='bot') => {
    const $message = document.createElement('div')
    $message.textContent = text
    $message.style.padding = '15px'
    $message.style.marginBottom = '15px'
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
    $btn.style.marginBottom = '15px'
    $btn.innerHTML = action.text

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
    context.$wall.innerHTML = ''
    context.$wall.style.display = 'none'

    context.map[stage].text.forEach(text => {
        context.$chatbox.appendChild($makeMessageBox(text))
    })
    
    if(context.map[stage].wall) {
        context.$wall.style.display = 'block'
        context.$wall.innerHTML = context.map[stage].wall
    }

    renderActions(context, context.map[stage].actions)
}


const transition = (context, action) => {
    context.$chatbox.appendChild($makeMessageBox(action.text, 'player'))
    renderStage(context, action.goto)
}

const makeContext = (map, $game) => ({
    map,
    $wall: $game.querySelector('.wall'),
    $chatbox: $game.querySelector('.chat'),
    $actionbox: $game.querySelector('.actions')
})

//style="display:flex; flex-direction: column; justify-content: flex-end; padding: 0 15px; overflow-y: auto; flex: 1;"

const $makeGame = () => {
    const $game = document.createElement('div')
    $game.innerHTML = `<div style="
                        width: 100%;
                      ">
                        <div class='wall' style="padding: 15px; flex: 1; font-size: 48px; font-weight: 900; line-height: 1.2; postion: absolute;"> </div>
                        <div class='chat-wrap' style='height: 400px; overflow: auto; position: relative; padding: 15px 15px 0 15px;'> 
                            <div class='chat' style="display:flex; flex-direction: column; justify-content: flex-end;"> </div>
                        </div>
                        <div class='submit_post' style="display:block;">
                            <div class='actions' style="display:flex; felx-direction: row; flex-wrap: wrap; margin-bottom: -15px;">
                            </div>
                        </div>
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

const injectGame = function() {
    const $wall = document.getElementById('feed_rows')
    const $post = $fakePost()
    const $game = $makeGame()

    $post.querySelector('.post').appendChild($game)

    const context = makeContext(gameMap, $game)
    
    console.log('setting scroll', context)
    const scroll = new PerfectScrollbar(context.$chatbox)
    console.log(scroll)
    renderStage(context, 'clickbait')
    
    const $postInserted = $wall.insertBefore($post, $wall.children[8])
}
const scrollbarcss = `
/*
 * Container style
 */
.ps {
  overflow: hidden !important;
  overflow-anchor: none;
  -ms-overflow-style: none;
  touch-action: auto;
  -ms-touch-action: auto;
}

/*
 * Scrollbar rail styles
 */
.ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color .2s linear, opacity .2s linear;
  -webkit-transition: background-color .2s linear, opacity .2s linear;
  height: 15px;
  /* there must be 'bottom' or 'top' for ps__rail-x */
  bottom: 0px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color .2s linear, opacity .2s linear;
  -webkit-transition: background-color .2s linear, opacity .2s linear;
  width: 15px;
  /* there must be 'right' or 'left' for ps__rail-y */
  right: 0;
  /* please don't change 'position' */
  position: absolute;
}

.ps--active-x > .ps__rail-x,
.ps--active-y > .ps__rail-y {
  display: block;
  background-color: transparent;
}

.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
}

.ps__rail-x:hover,
.ps__rail-y:hover,
.ps__rail-x:focus,
.ps__rail-y:focus {
  background-color: #eee;
  opacity: 0.9;
}

/*
 * Scrollbar thumb styles
 */
.ps__thumb-x {
  background-color: #aaa;
  border-radius: 6px;
  transition: background-color .2s linear, height .2s ease-in-out;
  -webkit-transition: background-color .2s linear, height .2s ease-in-out;
  height: 6px;
  /* there must be 'bottom' for ps__thumb-x */
  bottom: 2px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__thumb-y {
  background-color: #aaa;
  border-radius: 6px;
  transition: background-color .2s linear, width .2s ease-in-out;
  -webkit-transition: background-color .2s linear, width .2s ease-in-out;
  width: 6px;
  /* there must be 'right' for ps__thumb-y */
  right: 2px;
  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x {
  background-color: #999;
  height: 11px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y {
  background-color: #999;
  width: 11px;
}

/* MS supports */
@supports (-ms-overflow-style: none) {
  .ps {
    overflow: auto !important;
  }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .ps {
    overflow: auto !important;
  }
}`

const style = document.createElement('style')
style.textContent = scrollbarcss
document.body.appendChild(style)

export default injectGame