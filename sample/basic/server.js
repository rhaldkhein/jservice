const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Server', this.id)
}

Server.service = 'server'
