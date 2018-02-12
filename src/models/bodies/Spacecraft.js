const Body = require('./Body')

class Spacecraft extends Body {
  constructor (details) {
    super(details)
    this.classList.add('spacecraft')
  }

  render (...args) {
    if (this.inView) {
      const {shield, afterBurner, collision, destroyed, classList} = this

      destroyed ? classList.add('destroyed') : classList.remove('destroyed')
      shield ? classList.add('shield') : classList.remove('shield')
      collision ? classList.add('collision') : classList.remove('collision')
      afterBurner ? classList.add('after-burner') : classList.remove('after-burner')
    }
    return super.render(...args)
  }
}

module.exports = Spacecraft
