const shortid = require('shortid')

const SingletonService = module.exports = function (provider) {
  this.id = shortid.generate()
}

SingletonService.service = 'singleton'
