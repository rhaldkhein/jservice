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
      services.addSingleton(SingletonService)
      services.addSingleton({ ultra: 'man' }, 'ultra')
    })
    const { provider } = builder
    const singletonA = provider.getService('singleton')
    const singletonB = provider.getService('singleton')
    const singletonC = provider.get('singleton')
    const ultramanA = provider.getService('ultra')
    const ultramanB = provider.getService('ultra')
    expect(singletonA).to.be.instanceOf(SingletonService)
    expect(singletonB).to.be.equal(singletonA)
    expect(singletonC).to.be.equal(singletonB)
    expect(ultramanB).to.be.equal(ultramanA)
  })

  it('get scoped service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addScoped(ScopedService)
    })
    const { provider } = builder;
    // Singleton should not get scoped or transient
    (() => provider.getService('scoped')).should.throw(Error)
    const scopedProviderA = builder.createScopedProvider()
    const scopedProviderB = builder.createScopedProvider()
    // 1st scope
    const scopedAA = scopedProviderA.getService('scoped')
    const scopedAB = scopedProviderA.getService('scoped')
    // 2nd scope
    const scopedBA = scopedProviderB.getService('scoped')
    expect(scopedAB).to.be.equal(scopedAA)
    expect(scopedAB).to.be.not.equal(scopedBA)
  })

  it('get transient service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addTransient(TransientService)
    })
    const { provider } = builder;
    // Singleton should not get scoped or transient
    (() => provider.getService('transient')).should.throw(Error)
    const scopedProviderA = builder.createScopedProvider()
    const scopedProviderB = builder.createScopedProvider()
    // 1st scope
    const tranAA = scopedProviderA.getService('transient')
    const tranAB = scopedProviderA.getService('transient')
    // 2nd scope
    const tranBA = scopedProviderB.getService('transient')
    expect(tranAB).to.be.not.equal(tranAA)
    expect(tranAB).to.be.not.equal(tranBA)
  })

  it('get optional service', () => {
    const provider = new Builder().provider
    const nothing = provider.getService('nothing')
    expect(nothing).to.not.exist
  })

  it('get required service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addSingleton(SingletonService)
    })
    const provider = builder.provider;
    (() => provider.getRequiredService('nothing')).should.throw(Error);
    (() => provider.getRequired('nothing')).should.throw(Error)
    const singleton = provider.getRequiredService('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

  it('get service from parent', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addSingleton(SingletonService)
    })
    const scopedProvider = builder.createScopedProvider()
    const singleton = scopedProvider.getService('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

})