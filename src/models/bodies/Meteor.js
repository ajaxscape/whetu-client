const Body = require('./Body')

class Meteor extends Body {
  constructor (details) {
    super(details)
    this.classList.add('meteor')
  }
}

module.exports = Meteor
