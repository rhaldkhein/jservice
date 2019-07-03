const shortid = require('shortid')

const SingletonService = module.exports = function () {
  this.id = shortid.generate()
}

SingletonService.service = 'singleton'

SingletonService.prototype.sayHello = function () {
  // console.log('Hello World')
}