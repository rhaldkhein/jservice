const shortid = require('shortid')

const FooService = module.exports = function () {
  this.id = shortid.generate()
}

FooService.service = 'foo'
