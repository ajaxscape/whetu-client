const TICK_INTERVAL = 10

class Events {
  constructor (options) {
    this.keyListeners = {}
    document.addEventListener('keydown', this._onKeyDown.bind(this))
    document.addEventListener('keyup', this._onKeyUp.bind(this))
    this.actionCallback = () => {} // init to noop for now

    this._ticker = setInterval(() => this.tick(), TICK_INTERVAL)
  }

  onAction (callback) {
    this.actionCallback = callback
  }

  _onKeyDown (event) {
    if (event.repeat) {
      return false
    }
    const key = this.keyListeners[`${event.which}`]
    if (key && !key.on && !key.tapped) {
      key.tapped = true
      key.on = true
    }
    return false
  }

  _onKeyUp (event) {
    const key = this.keyListeners[`${event.which}`]
    if (key && key.on && !key.released) {
      key.on = false
      key.released = true
    }
    return false
  }

  tick () {
    Object.keys(this.keyListeners)
      .map((keyCode) => this.keyListeners[`${keyCode}`])
      .filter(({on, tapped, released}) => on || tapped || released)
      .forEach((key) => {
        const {onPressed = () => {}, whileHeldDown = () => {}, onUnPressed = () => {}, on = false, tapped = false, released = false} = key
        if (on) {
          whileHeldDown()
        }
        if (tapped) {
          onPressed()
          key.tapped = false
        }
        if (released) {
          onUnPressed()
          key.released = false
        }
      })
    this.actionCallback()
  }

  onPressed (keyCode, onPressed) {
    this.keyListeners[`${keyCode}`] = Object.assign(this.keyListeners[`${keyCode}`] || {}, {onPressed})
    return this
  }

  onUnPressed (keyCode, onUnPressed) {
    this.keyListeners[`${keyCode}`] = Object.assign(this.keyListeners[`${keyCode}`] || {}, {onUnPressed})
    return this
  }

  whileHeldDown (keyCode, whileHeldDown) {
    this.keyListeners[`${keyCode}`] = Object.assign(this.keyListeners[`${keyCode}`] || {}, {whileHeldDown})
    return this
  }

  destroy () {
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
    clearInterval(this._ticker)
    Object.keys(this.keyListeners)
      .map((keyCode) => this.keyListeners[`${keyCode}`])
      .filter(({on}) => on)
      .forEach(({onUnPressed = () => {}}) => {
        onUnPressed()
      })
  }
}

module.exports = Events
