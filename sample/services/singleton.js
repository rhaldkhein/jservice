const shortid = require('shortid')

const SingletonService = module.exports = function () {
  this.id = shortid.generate()
}

SingletonService.service = 'singleton'

/**
 * Hooks to JService start event
 */
SingletonService.start = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}
