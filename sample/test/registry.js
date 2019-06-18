const Server = require('./server')

module.exports = services => {

  services.addSingleton({ foo: 'bar' }, '@foo')

  services.addSingleton(Server)

}