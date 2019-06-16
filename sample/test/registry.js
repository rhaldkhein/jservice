const Server = require('./server')

module.exports = services => {

  services.addService({ foo: 'bar' }, '@foo')

  services.addService(Server)

}