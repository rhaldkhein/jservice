const Server = require('./server')
const SingletonService = require('./services/singleton')
const ScopedService = require('./services/scoped')
const TransientService = require('./services/transient')

module.exports = services => {

  services.addSingleton(SingletonService)
  services.addScoped(ScopedService)
  services.addTransient(TransientService)

  services.addSingleton({ foo: 'bar' }, 'foo')
  services.addSingleton(Server)

}
