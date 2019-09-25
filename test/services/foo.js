const shortid = require('shortid')

const FooService = module.exports = function () {
  return {
    id: shortid.generate()
  }
}

FooService.service = 'foo'
