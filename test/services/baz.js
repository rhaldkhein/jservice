const shortid = require('shortid')

const BazService = module.exports = function () {
  return {
    id: shortid.generate()
  }
}

BazService.service = 'baz'
