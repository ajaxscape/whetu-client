const STAR_COUNT = 100
const Viewport = require('./Viewport')
document.getElementById('starfield').innerHTML = `<canvas id="stars" width="${Viewport.width}" height="${Viewport.height}"></canvas>`
const canvas = document.getElementById('stars')
const context = canvas.getContext('2d')
const stars = []

class Starfield {
  static generateStars () {
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(Starfield.createStar())
    }
  }

  static createStar () {
    const hue = 60 + Math.random() * 40
    const saturation = 50
    const lightness = 10 + Math.random() * 70
    return {
      x: Math.random(),
      y: Math.random(),
      distance: Math.sqrt(Math.random()),
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
  }

  static drawStars () {
    if (!stars.length) {
      Starfield.generateStars()
    }
    const {width, height} = canvas
    context.clearRect(0, 0, width, height)
    stars.forEach(({x, y, distance, color}) => {
      context.beginPath()
      context.arc(x * width, y * height, distance, 0, 2 * Math.PI, false)
      context.lineWidth = distance * 2
      context.strokeStyle = 'rgba(255,255,255,0.5)'
      context.stroke()
      context.fillStyle = color
      context.fill()
    })
  }

  static render (player) {
    Starfield.resize()
    let dx = player.x - player.prevX
    let dy = player.y - player.prevY
    if (Math.abs(dx) > Viewport.width) {
      dx = dx % Viewport.width
    }
    if (Math.abs(dy) > Viewport.height) {
      dy = dy % Viewport.height
    }
    if (dx || dy) {
      const {width, height} = canvas
      stars.forEach((star) => {
        if (dx) {
          star.x -= dx / width
          if (star.x < 0) {
            star.x += 1
          }
          if (star.x > 1) {
            star.x -= 1
          }
        }
        if (dy) {
          star.y -= dy / height
          if (star.y < 0) {
            star.y += 1
          }
          if (star.y > 1) {
            star.y -= 1
          }
        }
      })
    }
    Starfield.drawStars()
  }

  static resize () {
    if (canvas.width !== Viewport.width || canvas.height !== Viewport.height) {
      canvas.width = Viewport.width
      canvas.height = Viewport.height
      Starfield.drawStars()
    }
  }

}

module.exports = Starfield
