const Spacecraft = require('./Spacecraft')
const Events = require('../Events')
const Radar = require('../Radar')
const Viewport = require('../Viewport')
const {Howl} = require('howler')
const {keyboard, floatingObjects} = require('../../constants')
const {LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, S_KEY, R_KEY, SPACEBAR} = keyboard

const thrustSound = new Howl({
  src: ['/assets/sound/rocket.mp3'],
  volume: 0.2
})
const explosionSound = new Howl({
  src: ['/assets/sound/explosion.mp3'],
  volume: 0.4
})
const boltSound = new Howl({
  src: ['/assets/sound/bolt.mp3'],
  volume: 0.3
})

class Player extends Spacecraft {
  constructor (details, ws) {
    super(details)
    this.username = 'You'
    this.classList.add('player')
    this.setUpEvents(ws)
  }

  update (changes) {
    return super.update(changes)
  }

  setUpEvents (ws) {
    const id = this.id
    const actions = this.actions = {
      rotate: 0,
      thrust: 0,
      shield: false,
      fire: false
    }

    const events = new Events()

    events
      .whileHeldDown(LEFT_ARROW, () => { actions.rotate = -1 })
      .onUnPressed(LEFT_ARROW, () => { actions.rotate = 0 })

      .whileHeldDown(RIGHT_ARROW, () => { actions.rotate = 1 })
      .onUnPressed(RIGHT_ARROW, () => { actions.rotate = 0 })

      .onPressed(DOWN_ARROW, () => { thrustSound.play() })
      .whileHeldDown(DOWN_ARROW, () => { actions.thrust = true })
      .onUnPressed(DOWN_ARROW, () => {
        actions.thrust = false
        thrustSound.stop()
      })

      .onPressed(S_KEY, () => { actions.shield = !actions.shield })

      .onPressed(R_KEY, () => { Radar.toggle() })

      .onPressed(SPACEBAR, () => { boltSound.play() })
      .whileHeldDown(SPACEBAR, () => { actions.fire = true })
      .onUnPressed(SPACEBAR, () => { actions.fire = false })

      .onAction(() => {
        const viewport = {width: Viewport.width, height: Viewport.height}
        const radar = {width: Radar.width, height: Radar.height}
        ws.send(JSON.stringify({type: 'player', data: {id, actions, viewport, radar}}))
      })

    setInterval(() => {
      if (actions.fire) {
        boltSound.play()
      }
    }, 300)
  }
}

module.exports = Player
