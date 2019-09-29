const shortid = require('shortid')

const SingletonService = module.exports = function () {
  return {
    id: shortid.generate(),
    sayHello: function () {
      // console.log('Hello World')
    }
  }
}

SingletonService.service = 'singleton'
