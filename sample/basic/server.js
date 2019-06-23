const shortid = require('shortid')

const Server = module.exports = function (provider) {
  this.id = shortid.generate()
  // Get other services
  // provider.getService('singleton')
}

Server.service = '@server'
