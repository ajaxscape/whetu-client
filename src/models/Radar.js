const Body = require('./bodies/Body')
const Bolt = require('./bodies/Bolt')
const Vector = require('./Vector')
const VISIBLE_WIDTH = 10000
const VISIBLE_HEIGHT = 10000
const radar = document.getElementById('radar')
let radarOn = true

class Radar {
  static get width () {
    return VISIBLE_WIDTH
  }

  static get height () {
    return VISIBLE_HEIGHT
  }

  static toggle () {
    radarOn = !radarOn
  }

  static get scale () {
    return radar.clientWidth / VISIBLE_WIDTH
  }

  static renderGlow (body, offSetX, offSetY) {
    // TODO
    // if (body.klass === 'PlayersSpacecraft') {
    //   const dx = body.x - offSetX
    //   const dy = body.y - offSetY
    //   const angle = Vector.getAngle(dx, dy)
    //   const vector = Vector.getVector(angle, VISIBLE_WIDTH / 2)
    //   const left = (vector.x ) * Radar.scale
    //   const top = (vector.y) * Radar.scale
    //   return `<div class="body glow" style="visibility: visible; left: ${left}px; top: ${top};"></div>`
    // }
    return ''
  }

  static render (offSetX, offSetY) {
    if (radarOn) {
      radar.classList.add('visible')
      radar.innerHTML = Body.all
        .filter((body) => !(body instanceof Bolt))
        .map((body) => {
          const x = offSetX + VISIBLE_WIDTH / 2
          const y = offSetY + VISIBLE_HEIGHT / 2
          return body.render(x, y, Radar.scale)
        })
    } else {
      radar.classList.remove('visible')
      radar.innerHTML = ''
    }
  }
}

module.exports = Radar
