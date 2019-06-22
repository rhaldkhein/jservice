const shortid = require('shortid')

const Server = module.exports = function () {
  this.id = shortid.generate()
  console.log('Transient F', this.id)
}

Server.service = 'tran-f'
