const Container = require('../../lib')
const connectAdapter = require('../../lib/adapters/connect').default
const koaAdapter = require('../../lib/adapters/koa').default

describe('middlewares', () => {

  const {
    SingletonService
  } = global.services

  it('connect adapter', () => {
    const container = new Container()
    container.collection.singleton(SingletonService)
    let proto = {}
    const middleware = container.init(
      connectAdapter(proto)
    )
    expect(middleware).to.be.a('function')
    expect(proto.serviceOrNull).to.be.a('function')
    expect(proto.service).to.be.a('function')
    middleware(proto, null, () => null)
    const singleton = proto.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

  it('koa adapter', () => {
    const container = new Container()
    container.collection.singleton(SingletonService)
    let proto = {}
    const middleware = container.init(
      koaAdapter(proto)
    )
    expect(middleware).to.be.a('function')
    expect(proto.serviceOrNull).to.be.a('function')
    expect(proto.service).to.be.a('function')
    middleware(proto, () => null)
    const singleton = proto.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

})