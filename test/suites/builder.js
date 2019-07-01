const {
  Builder,
  ServiceProvider,
  ServiceCollection,
  build,
  mock
} = require('../../lib')

describe('builder', () => {

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
    const provider = builder.createScopedProvider()
    expect(provider).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.equal(builder.provider)
    expect(provider).to.be.not.equal(builder.provider)
  })

  it('create using build function', () => {
    const builder = build()
    expect(builder).to.be.instanceOf(Builder)
  })

  it('mock function - empty', () => {
    const provider = mock()
    expect(provider).to.be.instanceOf(ServiceProvider)
  })

  it('mock function - single service', () => {
    const provider = mock({ foo: 'Bar' }, 'foo')
    expect(provider).to.be.instanceOf(ServiceProvider);
    (() => provider.service('foo')).should.not.throw(Error)
  })

  it('mock function - multiple services', () => {
    const provider = mock(
      [{ foo: 'Bar' }, 'foo'],
      [{ baz: 'Yoo' }, 'baz']
    )
    expect(provider).to.be.instanceOf(ServiceProvider);
    (() => provider.service('foo')).should.not.throw(Error);
    (() => provider.service('baz')).should.not.throw(Error)
  })

})