const service = window.expanse.config
// eslint-disable-next-line no-undef
const ws = new WebSocket(service)
const {floatingObjects: {ENERGY}} = require('../constants')
const Body = require('./bodies/Body')
const Player = require('./bodies/Player')
const Bolt = require('./bodies/Bolt')
const Meteor = require('./bodies/Meteor')
const Spacecraft = require('./bodies/Spacecraft')
const Starfield = require('./Starfield')
const Radar = require('./Radar')
const Viewport = require('./Viewport')

const viewport = document.getElementById('viewport')
const energyBar = document.getElementById('energy-bar')
const score = document.getElementById('score-value')
let player

class Game {
  static connect () {
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
          Game.updatePlayer(data)
          break
        }
        case 'state': {
          const now = Date.now()
          data.forEach((_data) => {
            Game.updateBody(_data)
          })
          Body.all.forEach((body) => {
            if (body !== player && body.lastUpdated < now) {
              body.destroy()
            }
          })
          Game.render()
          break
        }
      }
    }
  }

  static updatePlayer (details) {
    if (!player) {
      player = new Player(details, ws)
    }
    player.prevX = player.x
    player.prevY = player.y
    return player.update(details)
  }

  static updateBody (details) {
    const {id, klass} = details
    let body = Body.get(id)
    if (body) {
      if (body === player) {
        return Game.updatePlayer(details)
      } else {
        return body.update(details)
      }
    }
    switch (klass) {
      case 'Bolt':
        return new Bolt(details)
      case 'Meteor':
        return new Meteor(details)
      default:
        return new Spacecraft(details)
    }
  }

  static render () {
    if (player) {
      Radar.render(-player.x, -player.y)
      Viewport.render(-player.x, -player.y)
      Starfield.render(player)
      Game.renderInfo()
    }
  }

  static renderInfo () {
    const {clientWidth} = viewport
    energyBar.style.width = `${player.energy / ENERGY * clientWidth}px`
    if (player.score) {
      score.innerHTML = `${player.score}`
    }
  }
}

module.exports = Game
