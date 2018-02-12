class ClassList {
  constructor (classes = '') {
    this._classes = []
    classes.split(',').forEach((className) => this.add(className.trim()))
  }

  add (className) {
    if (className && !this._classes.some((item) => item === className)) {
      this._classes.push(className)
    }
    return this
  }

  remove (className) {
    if (className) {
      this._classes = this._classes.filter((item) => item !== className)
    }
    return this
  }

  toString () {
    return this._classes.join(' ')
  }
}

module.exports = ClassList
