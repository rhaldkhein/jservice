const shortid = require('shortid')

const ScopedService = module.exports = function (provider) {

  // Get other services
  provider.service('singleton')

  return {
    id: shortid.generate()
  }
}

ScopedService.service = 'scoped'
