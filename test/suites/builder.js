const Builder = require('../../lib')
const {
  ServiceProvider,
  ServiceCollection,
  create,
  mock
} = Builder

describe('builder', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService,
    FooService
  } = global.services

  it('initial state', () => {
    const builder = new Builder()
    expect(builder.isReady).to.be.false
    expect(builder.collection).to.exist
    expect(builder.provider).to.exist
  })

  it('start normally', () => {
    const builder = new Builder()
    return builder
      .build(services => {
        services.should.be.instanceOf(ServiceCollection)
      })
      .start().should.eventually.be.instanceOf(ServiceProvider)
  })

  it('create scoped provider', () => {
    const builder = new Builder()
    const provider = builder.createProvider()
    expect(provider).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.equal(builder.provider)
    expect(provider).to.be.not.equal(builder.provider)
  })

  it('create using build function', () => {
    const builder = create()
    expect(builder).to.be.instanceOf(Builder)
  })

  it('merge', () => {
    const builderA = create(services => {
      services.singleton(SingletonService)
      services.scoped(ScopedService)
      services.transient(TransientService)
    })
    const builderB = create(services => {
      services.transient(FooService)
    })
    builderB.merge(builderA)
    const singleton = builderB.provider.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
    // For scoped services
    const provider = builderB.createProvider()
    const scoped = provider.service('scoped')
    const transient = provider.service('transient')
    expect(scoped).to.be.instanceOf(ScopedService)
    expect(transient).to.be.instanceOf(TransientService)
  })

  it('mock function - empty', () => {
    const builder = mock()
    expect(builder).to.be.instanceOf(Builder)
  })

  it('mock function - single service', () => {
    const builder = mock({ foo: 'Bar' }, 'foo')
    expect(builder).to.be.instanceOf(Builder);
    (() => builder.provider.service('foo')).should.not.throw(Error)
  })

  it('mock function - multiple services', () => {
    const builder = mock(
      [{ foo: 'Bar' }, 'foo'],
      [{ baz: 'Yoo' }, 'baz']
    )
    expect(builder).to.be.instanceOf(Builder);
    (() => builder.provider.service('foo')).should.not.throw(Error);
    (() => builder.provider.service('baz')).should.not.throw(Error)
  })

})