const Container = require('../../lib')
const { ServiceProvider } = Container

describe('provider', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService
  } = global.services

  it('correct instances', () => {
    const container = new Container()
    container.build(services => {
      services.singleton(SingletonService)
      services.scoped(ScopedService)
      services.transient(TransientService)
      services.add(() => ({ fat: 'arrow' }), 'fat')
    })

    const singA = container.provider.service('singleton')
    const providerA = container.createProvider()
    const singB = providerA.service('singleton')
    expect(singB).to.be.equal(singA)

    const containerA = container.createContainer()
    const singC = containerA.provider.service('singleton')
    expect(singC).to.be.equal(singA)

    const fatService = container.provider.service('fat')
    expect(fatService && fatService.fat).to.be.equal('arrow')

  })

  it('custom dependency', (done) => {
    const hello = { a: 1 }
    const world = { b: 2 }
    function ZooService(provider) {
      const helloService = provider.service('hello')
      const singleton = provider.service('singleton')
      expect(provider).to.be.instanceOf(ServiceProvider)
      expect(helloService).to.be.equal(hello)
      expect(singleton).to.be.instanceOf(SingletonService)
    }
    ZooService.service = 'zoo'

    function YooService(provider) {
      const worldService = provider.service('world')
      const singleton = provider.service('singleton')
      expect(worldService).to.be.equal(world)
      expect(singleton).to.be.instanceOf(SingletonService)
      done()
    }

    const container = new Container()
    container.build(services => {
      services.add(SingletonService)
      services.add(ZooService, provider => {
        expect(provider).to.be.instanceOf(ServiceProvider)
        return { hello }
      })
    })

    const subContainer = container.createContainer(services => {
      services.add(YooService, 'yoo', provider => {
        provider.service('zoo')
        return { world }
      })
    })
    subContainer.provider.service('yoo')
  })

  it('correct service arguments with config', (done) => {
    // Service 1
    const serviceConfig = { a: 1 }
    const serviceConfigFunc = () => ({ a: 'yes' })
    function CustomService(provider, config) {
      expect(provider).to.be.instanceOf(ServiceProvider)
      expect(config).to.be.equal(serviceConfig)
    }
    // Service 2
    function ZooService(provider, config) {
      expect(config.a).to.be.equal('yes')
      expect(config.name).to.be.equal('zoonew')
    }
    ZooService.service = 'zoo'
    // Service 3
    const booConfig = { a: 1 }
    const Boo = (provider, config) => {
      expect(provider).to.be.instanceOf(ServiceProvider)
      expect(config).to.be.equal(booConfig)
      expect(config.name).to.be.equal('boo')
      done()
      return { boo: 'boo' }
    }
    // Container
    const container = new Container()
    container.build(services => {
      services.add(CustomService, 'custom')
      services.configure('custom', serviceConfig)
      services.add(ZooService, 'zoonew')
      services.configure('zoonew', serviceConfigFunc)
      services.add(Boo, 'boo')
      services.configure('boo', booConfig)
    })
    container.provider.get('custom')
    container.provider.get('zoonew')
    container.provider.get('boo')
  })

  it('correct instance keys', () => {
    const container = new Container()
    // Function variable
    const FuncService = function () { }
    // Function pure
    function HelloService() { }
    // Build
    container.build(services => {
      services.singleton(FuncService, 'func')
      services.singleton(HelloService, 'hello')
    })
    const { provider } = container
    provider.service('func')
    provider.service('hello')
    expect(provider._instances.func).to.exist
    expect(provider._instances.hello).to.exist
  })

  it('get singleton service', () => {
    const container = new Container()
    const anonValue = { anon: 'Anonymous' }
    const anonLambda = () => anonValue
    const consFunc = function () { }
    container.build(services => {
      // Constructors
      services.singleton(SingletonService)
      services.singleton(consFunc, 'consfunc')
      // Object
      services.singleton({ ultra: 'man' }, 'ultra')
      // Lambda (non contructor function)
      services.singleton(anonLambda, 'anon')
    })
    const { provider } = container
    const singletonA = provider.service('singleton')
    const singletonB = provider.service('singleton')
    const ultramanA = provider.service('ultra')
    const ultramanB = provider.service('ultra')
    const anonA = provider.service('anon')
    const consfuncA = provider.service('consfunc')
    expect(singletonA).to.be.instanceOf(SingletonService)
    expect(singletonB).to.be.equal(singletonA)
    expect(ultramanB).to.be.equal(ultramanA)
    expect(anonA).to.be.equal(anonValue)
    expect(consfuncA).to.be.instanceOf(consFunc)
  })

  it('get scoped service', () => {
    const container = new Container()
    container.build(services => {
      services.scoped(ScopedService)
    })
    const { provider } = container;
    // Singleton should not get scoped or transient
    (() => provider.service('scoped')).should.throw(Error)
    const scopedProviderA = container.createProvider()
    const scopedProviderB = container.createProvider()
    // 1st scope
    const scopedAA = scopedProviderA.service('scoped')
    const scopedAB = scopedProviderA.service('scoped')
    // 2nd scope
    const scopedBA = scopedProviderB.service('scoped')
    expect(scopedAB).to.be.equal(scopedAA)
    expect(scopedAB).to.be.not.equal(scopedBA)
  })

  it('get transient service', () => {
    const container = new Container()
    container.build(services => {
      services.transient(TransientService)
    })
    const { provider } = container;
    // Singleton should not get scoped or transient
    (() => provider.service('transient')).should.throw(Error)
    const scopedProviderA = container.createProvider()
    const scopedProviderB = container.createProvider()
    // 1st scope
    const tranAA = scopedProviderA.service('transient')
    const tranAB = scopedProviderA.service('transient')
    // 2nd scope
    const tranBA = scopedProviderB.service('transient')
    expect(tranAB).to.be.not.equal(tranAA)
    expect(tranAB).to.be.not.equal(tranBA)
  })

  it('get optional service', () => {
    const container = new Container()
    container.build(services => {
      services.singleton(SingletonService)
    })
    const nothing = container.provider.serviceOrNull('nothing')
    const singleton = container.provider.serviceOrNull('singleton')
    expect(nothing).to.not.exist
    expect(singleton).to.exist
  })

  it('get required service', () => {
    const container = new Container()
    const provider = container.provider;
    (() => provider.service('nothing')).should.throw(Error)
  })

  it('get service from parent', () => {
    const container = new Container()
    container.build(services => {
      services.singleton(SingletonService)
    })
    const scopedProvider = container.createProvider()
    const singleton = scopedProvider.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
  })

  it('get service using shorthand', () => {
    const container = new Container()
    container.build(services => {
      services.singleton(SingletonService)
    })
    const scopedProvider = container.createProvider()
    const singleton = scopedProvider.get('singleton')
    const nothing = scopedProvider.getOrNull('nothing')
    expect(singleton).to.be.instanceOf(SingletonService)
    expect(nothing).to.not.exist
  })

})