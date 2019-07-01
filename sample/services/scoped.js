const shortid = require('shortid')

const ScopedService = module.exports = function (provider) {
  this.id = shortid.generate()
  // Get other services
  provider.service('singleton')
}

ScopedService.service = 'scoped'
