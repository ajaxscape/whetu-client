const Body = require('./Body')

class Bolt extends Body {
  constructor (details) {
    super(details)
    this.classList.add('bolt')
  }
}

module.exports = Bolt
