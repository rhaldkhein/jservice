const Server = require('./server')
const SingA = require('./services/singA')
const SingB = require('./services/singB')
const ScopC = require('./services/scopC')
const ScopD = require('./services/scopD')
const TranE = require('./services/tranE')
const TranF = require('./services/tranF')

module.exports = services => {

  services.addSingleton(SingA)
  services.addSingleton(SingB)
  services.addScoped(ScopC)
  services.addScoped(ScopD)
  services.addTransient(TranE)
  services.addTransient(TranF)

  services.addSingleton({ foo: 'bar' }, 'foo')
  services.addSingleton(Server)

}
