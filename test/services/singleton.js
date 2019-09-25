const shortid = require('shortid')

module.exports = class SingletonService {
  static get service() { return 'singleton' }
  constructor() {
    this.id = shortid.generate()
  }
}