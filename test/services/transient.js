const shortid = require('shortid')

const TransientService = module.exports = function () {
  this.id = shortid.generate()
}

TransientService.service = 'transient'
