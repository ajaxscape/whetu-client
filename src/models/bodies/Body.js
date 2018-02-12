const ClassList = require('../ClassList')

function camelCaseToDash (str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

const bodiesById = {}

class Body {
  constructor (details) {
    Object.assign(this, details)
    this.classList.add('body')
    this.classList.add(camelCaseToDash(details.type))
    this.classList.add(camelCaseToDash(details.klass))
    bodiesById[this.id] = this
  }

  static get (id) {
    return bodiesById[id]
  }

  static get all () {
    return Object.keys(bodiesById).map((id) => bodiesById[id])
  }

  get classList () {
    if (!this.__classList) {
      this.__classList = new ClassList()
    }
    return this.__classList
  }

  get className () {
    return this.__classList.toString()
  }

  update (changes) {
    Object.assign(this, changes, {lastUpdated: Date.now()})
    return this
  }

  render (offSetX, offSetY, scale = 1) {
    const {x, y, width = 100, height = 100, id, orientation, username, className} = this
    const left = (x - (width / 2) + offSetX) * scale
    const top = (y - (height / 2) + offSetY) * scale
    if (scale < 1) {
      return `<div class="${className}" style="left: ${left}px; top: ${top};"><div class="name">${username || ''}</div></div>`
    } else {
      return `<div id="${id}" class="body-container" style="visibility: visible; left: ${left}px; top: ${top};"><div class="${className}" style="transform: rotate(${orientation}deg);"></div><div class="name">${username || ''}</div></div>`
    }
  }

  destroy () {
    delete bodiesById[this.id]
  }
}

module.exports = Body
