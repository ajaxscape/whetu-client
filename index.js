const Render = require('whetu-render')
const ws = require('ws')

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
      const now = Date.now()
      data.forEach((_data) => {
        Render.updateBody(_data)
      })
      Body.all.forEach((body) => {
        if (body !== player && body.lastUpdated < now) {
          body.destroy()
        }
      })
      Render.render()
      break
    }
  }
}