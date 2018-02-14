const Render = require('whetu-render')

const multiplayer = false

if (multiplayer) {
  const service = window.expanse.config
// eslint-disable-next-line no-undef
  const ws = new WebSocket(service)
// event emmited when connected
  ws.onopen = function () {
    console.log('websocket is connected ...')
    // sending a send event to websocket server
    ws.send(JSON.stringify({type: 'join'}))
  }

// event emmited when receiving message
  ws.onmessage = (ev) => {
    const {type, data} = JSON.parse(ev.data)
    switch (type) {
      case 'joined': {
        Render.updatePlayer(data, (data) => {
          ws.send(JSON.stringify({type: 'player', data}))
        })
        break
      }
      case 'state': {
        data.forEach((_data) => {
          Render.updateBody(_data)
        })
        Render.render()
        break
      }
    }
  }
} else {
  let id
  let viewport
  let radar

  const game = require('whetu-engine')
  game.start()
  const data = game.join()
  id = data.id

  Render.updatePlayer(data, (data) => {
    viewport = data.viewport
    radar = data.radar
    game.update(data)
  })

  setInterval(() => {
    if (id && viewport && radar) {
      game.state(id, viewport, radar)
        .then((data) => {
          data.forEach((_data) => {
            Render.updateBody(_data)
          })
          Render.render()
        })
    }
  })
}
