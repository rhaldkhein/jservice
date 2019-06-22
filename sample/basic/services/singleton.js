const shortid = require('shortid')

const SingletonService = module.exports = function () {
  this.id = shortid.generate()
}

SingletonService.service = 'singleton'
