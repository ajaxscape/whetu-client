const Body = require('./bodies/Body')
const viewport = document.getElementById('viewport')

class Viewport {
  static get width () {
    return viewport.clientWidth
  }

  static get height () {
    return viewport.clientHeight
  }

  static render (offSetX, offSetY) {
    const {clientWidth, clientHeight} = viewport
    viewport.innerHTML = Body.all
      .filter((body) => body.inView)
      .map((body) => {
      const x = offSetX + clientWidth / 2
      const y = offSetY + clientHeight / 2
      return body.render(x, y)
    }).join('')
  }
}

module.exports = Viewport
