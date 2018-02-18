const Render = require('whetu-render')

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
