const shortid = require('shortid')

module.exports = class TransientService {
  static get service() { return 'transient' }
  constructor() {
    this.id = shortid.generate()
  }
}