const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Singleton A', this.id)
}

Server.service = 'sing-a'
