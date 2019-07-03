const SingletonService = require('./singleton')
const ScopedService = require('./scoped')
const TransientService = require('./transient')

module.exports = services => {

  services.singleton(SingletonService)
  services.scoped(ScopedService)
  services.transient(TransientService)
  services.singleton({ foo: 'bar' }, 'foo')

  // Add and configure more services

}
