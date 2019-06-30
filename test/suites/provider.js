const { Builder } = require('../../lib')

describe('provider', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService
  } = global.services

  it('get singleton service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
    })
    const { provider } = builder
    const singletonA = provider.service('singleton')
    const singletonB = provider.service('singleton')
    const ultramanA = provider.service('ultra')
    const ultramanB = provider.service('ultra')
    expect(singletonA).to.be.instanceOf(SingletonService)
    expect(singletonB).to.be.equal(singletonA)
    expect(ultramanB).to.be.equal(ultramanA)
  })

  it('get scoped service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.scoped(ScopedService)
    })
    const { provider } = builder;
    // Singleton should not get scoped or transient
    (() => provider.service('scoped')).should.throw(Error)
    const scopedProviderA = builder.createScopedProvider()
    const scopedProviderB = builder.createScopedProvider()
    // 1st scope
    const scopedAA = scopedProviderA.service('scoped')
    const scopedAB = scopedProviderA.service('scoped')
    // 2nd scope
    const scopedBA = scopedProviderB.service('scoped')
    expect(scopedAB).to.be.equal(scopedAA)
    expect(scopedAB).to.be.not.equal(scopedBA)
  })

  it('get transient service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.transient(TransientService)
    })
    const { provider } = builder;
    // Singleton should not get scoped or transient
    (() => provider.service('transient')).should.throw(Error)
    const scopedProviderA = builder.createScopedProvider()
    const scopedProviderB = builder.createScopedProvider()
    // 1st scope
    const tranAA = scopedProviderA.service('transient')
    const tranAB = scopedProviderA.service('transient')
    // 2nd scope
    const tranBA = scopedProviderB.service('transient')
    expect(tranAB).to.be.not.equal(tranAA)
    expect(tranAB).to.be.not.equal(tranBA)
  })

  it('get optional service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.singleton(SingletonService)
    })
    const nothing = builder.provider.serviceOrNull('nothing')
    const singleton = builder.provider.serviceOrNull('singleton')
    expect(nothing).to.not.exist
    expect(singleton).to.exist
  })

  it('get required service', () => {
    const builder = new Builder()
    const provider = builder.provider;
    (() => provider.service('nothing')).should.throw(Error)
  })

  it('get service from parent', () => {
    const builder = new Builder()
    builder.build(services => {
      services.singleton(SingletonService)
    })
    const scopedProvider = builder.createScopedProvider()
    const singleton = scopedProvider.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

})