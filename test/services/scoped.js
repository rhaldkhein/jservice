const shortid = require('shortid')

module.exports = class ScopedService {
  static get service() { return 'scoped' }
  constructor() {
    this.id = shortid.generate()
  }
}