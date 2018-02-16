const Render = require('whetu-render')
const queryString = require('query-string')

const params = queryString.parse(location.search)

if (params.singlePlayer) {
  const Worker = require('./whetu-engine.worker')
  const worker = new Worker()

  worker.postMessage({type: 'join'})
  worker.onmessage = function (event) {
    const {data: {type, data}} = event
    switch (type) {
      case 'joined': {
        Render.updatePlayer(data, (data) => {
          worker.postMessage({type: 'player', data})
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
}

if (params.multiPlayer) {
  const service = window.expanse.config
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
}
