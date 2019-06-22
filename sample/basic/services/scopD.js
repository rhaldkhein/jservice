const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Scoped D', this.id)
}

Server.service = 'scop-d'
