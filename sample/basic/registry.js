const Server = require('./server')
const SingletonService = require('./services/singleton')
const ScopedService = require('./services/scoped')
const Transient = require('./services/transient')

module.exports = services => {

  services.addSingleton(SingletonService)
  services.addScoped(ScopedService)
  services.addTransient(Transient)

  services.addSingleton({ foo: 'bar' }, 'foo')
  services.addSingleton(Server)

}
