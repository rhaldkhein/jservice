const shortid = require('shortid')

const BarService = module.exports = function () {
  return {
    id: shortid.generate()
  }
}

BarService.service = 'bar'
