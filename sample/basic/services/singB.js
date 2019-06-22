const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Singleton B', this.id)
}

Server.service = 'sing-b'
