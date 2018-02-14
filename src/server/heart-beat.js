const WebSocket = require('ws')
const service = `${process.env.EXPANSE_SERVICE || 'ws://localhost:40510'}`
const ws = new WebSocket(service)

/* ******************************************************************************** */
/* ************************* WEB SOCKETS COMMUNICATION **************************** */
/* ******************************************************************************** */

function start () {
  ws.onopen = function () {
    console.log('websocket is connected ...')
  }

// Now keep this and the game server alive
  ws.onmessage = function (ev) {
    const {type} = JSON.parse(ev.data)
    if (type === 'ping') {
      console.log('ping')
      setTimeout(() => ws.send(JSON.stringify({type: 'pong'})), 10000)
    }
  }
}

module.exports = { start }
