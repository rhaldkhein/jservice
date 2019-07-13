const Builder = require('../../lib')
const connectAdapter = require('../../lib/adapters/connect').default
const koaAdapter = require('../../lib/adapters/koa').default

describe('middlewares', () => {

  const {
    SingletonService
  } = global.services

  it('connect adapter', () => {
    const builder = new Builder()
    builder.collection.singleton(SingletonService)
    let proto = {}
    const middleware = builder.init(
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
    const builder = new Builder()
    builder.collection.singleton(SingletonService)
    let proto = {}
    const middleware = builder.init(
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