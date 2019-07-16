const Builder = require('../../lib')
const { ServiceProvider } = Builder

describe('provider', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService
  } = global.services

  it('correct service arguments', (done) => {
    const serviceConfig = { a: 1 }
    const serviceConfigFunc = () => 'yes'
    function CustomService(provider, config) {
      expect(provider).to.be.instanceOf(ServiceProvider)
      expect(config).to.be.equal(config)
    }
    function ZooService(provider, config) {
      expect(config).to.be.equal('yes')
    }
    function YooService(provider, config) {
      expect(config).to.be.equal(config)
      done()
    }
    YooService.service = 'yoo'
    const builder = new Builder()
    builder.build(services => {
      services.add(CustomService, 'custom', serviceConfig)
      services.add(ZooService, 'zoo', serviceConfigFunc)
      services.add(YooService, serviceConfig)
    })
    builder.provider.get('custom')
    builder.provider.get('zoo')
    builder.provider.get('yoo')
  })

  it('correct instance keys', () => {
    const builder = new Builder()
    // Function variable
    const FuncService = function () { }
    // Function pure
    function HelloService() { }
    // Build
    builder.build(services => {
      services.singleton(FuncService, 'func')
      services.singleton(HelloService, 'hello')
    })
    const { provider } = builder
    provider.service('func')
    provider.service('hello')
    expect(provider._instances.func).to.exist
    expect(provider._instances.hello).to.exist
  })

  it('get singleton service', () => {
    const builder = new Builder()
    const anonValue = { anon: 'Anonymous' }
    builder.build(services => {
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
      services.singleton(() => anonValue, 'anon')
    })
    const { provider } = builder
    const singletonA = provider.service('singleton')
    const singletonB = provider.service('singleton')
    const ultramanA = provider.service('ultra')
    const ultramanB = provider.service('ultra')
    const anonA = provider.service('anon')
    expect(singletonA).to.be.instanceOf(SingletonService)
    expect(singletonB).to.be.equal(singletonA)
    expect(ultramanB).to.be.equal(ultramanA)
    expect(anonA).to.be.equal(anonValue)
  })

  it('get scoped service', () => {
    const builder = new Builder()
    builder.build(services => {
      services.scoped(ScopedService)
    })
    const { provider } = builder;
    // Singleton should not get scoped or transient
    (() => provider.service('scoped')).should.throw(Error)
    const scopedProviderA = builder.createProvider()
    const scopedProviderB = builder.createProvider()
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
    const scopedProviderA = builder.createProvider()
    const scopedProviderB = builder.createProvider()
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
    const scopedProvider = builder.createProvider()
    const singleton = scopedProvider.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

  it('get service using shorthand', () => {
    const builder = new Builder()
    builder.build(services => {
      services.singleton(SingletonService)
    })
    const scopedProvider = builder.createProvider()
    const singleton = scopedProvider.get('singleton')
    const nothing = scopedProvider.getOrNull('nothing')
    expect(singleton).to.be.instanceOf(SingletonService)
    expect(nothing).to.not.exist
  })

})