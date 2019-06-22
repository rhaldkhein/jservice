const shortid = require('shortid')

const ScopedService = module.exports = function (provider) {
  this.id = shortid.generate()
  // Get other services
  // provider.getService('singleton')
}

ScopedService.service = 'scoped'
