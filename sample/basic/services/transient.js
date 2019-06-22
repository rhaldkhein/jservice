const shortid = require('shortid')

const TransientService = module.exports = function (provider) {
  this.id = shortid.generate()
  // Get other services
  // provider.getService('scoped')
}

TransientService.service = 'transient'
