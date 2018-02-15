const game = require('whetu-engine')

game.start()
let id
let viewport
let radar
self.addEventListener('message', (event) => {
  const {data: {type, data}} = event
  switch (type) {
    case 'player': {
      viewport = data.viewport
      radar = data.radar
      game.update(data)
      break
    }
    case 'join': {
      const data = game.join()
      id = data.id
      self.postMessage({type: 'joined', data})
      break
    }
  }
})

setInterval(async () => {
  if (id && viewport && radar) {
    const data = await game.state(id, viewport, radar)
    self.postMessage({type: 'state', data})
  }
}, 50)