const shortid = require('shortid')

const ScopedService = module.exports = function () {
  this.id = shortid.generate()
}

ScopedService.service = 'scoped'
