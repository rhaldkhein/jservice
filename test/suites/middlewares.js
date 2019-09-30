const Container = require('../../lib')

describe('middlewares', () => {

  const {
    SingletonService
  } = global.services

  it('default adapter', () => {
    const container = new Container()
    container.collection.singleton(SingletonService)
    let proto = {}
    const middleware = container.init(proto)
    expect(middleware).to.be.a('function')
    expect(proto.serviceOrNull).to.be.a('function')
    expect(proto.service).to.be.a('function')
    // For connect
    middleware(proto, {}, () => null)
    // For koa
    middleware(proto, () => null)
    const singleton = proto.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

})
