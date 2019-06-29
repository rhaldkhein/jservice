const shortid = require('shortid')

const BarService = module.exports = function () {
  this.id = shortid.generate()
}

BarService.service = 'bar'
