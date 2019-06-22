const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Scoped C', this.id)
}

Server.service = 'scop-c'
