const shortid = require('shortid')

const TransientService = module.exports = function (provider) {
  this.id = shortid.generate()
  // Get other services
  provider.service('scoped')
}

/**
 * MORE SERVICE OPTIONS
 */

Object.assign(TransientService, {

  // Service name
  service: 'transient',

  // Force this services to be added as singletong
  // singleton: true,

  // Triggers when this service is added
  setup: ({ provider }) => {
    const sing = provider.service('singleton')
    // Do something with `sing`
    sing.sayHello()
  },

  // Triggers when JService is starting
  start: provider => {
    const sing = provider.service('singleton')
    // Do something with `sing` before starting the server
    sing.sayHello()
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  },

  // Triggers when all services have started
  ready: provider => {
    const sing = provider.service('singleton')
    sing.sayHello()
    // or do something else
  }

})