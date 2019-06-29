const { Builder, ServiceCollection } = require('../../lib')

describe('collection', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService,
    FooService
  } = global.services

  it('add services with minimum arguments', () => {
    new Builder().build(services => {
      services.should.be.instanceOf(ServiceCollection)
      services.addTransient(TransientService)
      services.addScoped(ScopedService)
      services.addSingleton(SingletonService)
      services.addSingleton({ ultra: 'man' }, 'ultra')
      services.add(FooService)
      // 3 services + 1 core
      expect(services.services).to.have.lengthOf(6)
      expect(services.services).to.include.members([
        TransientService,
        ScopedService,
        SingletonService,
        FooService
      ])
    })
  })

  it('add services with different name', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addTransient(TransientService, 'xtransient')
      services.addScoped(ScopedService, 'xscoped')
      services.addSingleton(SingletonService, 'xsingleton')
      services.add(FooService, 'xfoo')
    })
    const { collection: col } = builder
    const transient = col.services[col.names['xtransient']]
    const scoped = col.services[col.names['xscoped']]
    const singleton = col.services[col.names['xsingleton']]
    const foo = col.services[col.names['xfoo']]
    expect(transient).to.equal(TransientService)
    expect(scoped).to.equal(ScopedService)
    expect(singleton).to.equal(SingletonService)
    expect(foo).to.equal(FooService)
  })

  it('add services and check types with config ', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addTransient(TransientService, () => null)
      services.addScoped(ScopedService, () => null)
      services.addSingleton(SingletonService, () => null)
      services.addSingleton({ ultra: 'man' }, 'ultra')
      services.add(FooService, () => null)
    })
    const { collection: col } = builder
    const transient = col.services[col.names['transient']]
    const scoped = col.services[col.names['scoped']]
    const singleton = col.services[col.names['singleton']]
    const ultra = col.services[col.names['ultra']]
    const foo = col.services[col.names['foo']]
    // Types
    expect(transient.type).to.be.equal(col.types.TRANSIENT)
    expect(scoped.type).to.be.equal(col.types.SCOPED)
    expect(singleton.type).to.be.equal(col.types.SINGLETON)
    expect(ultra.type).to.be.equal(col.types.CONCRETE)
    expect(foo.type).to.be.equal(col.types.SINGLETON)
    // Config
    expect(transient.config).to.be.a('function')
    expect(scoped.config).to.be.a('function')
    expect(singleton.config).to.be.a('function')
    expect(foo.config).to.be.a('function')
  })

  it('replace service', () => {
    const builder = new Builder()
    function ReplacableService() { }
    ReplacableService.service = '@replacable'
    function NewService() { }
    NewService.service = '@replacable'
    builder.build(services => {
      services.addTransient(ReplacableService, () => null)
      services.addTransient(NewService, () => null)
    })
    expect(builder.collection.services.length).to.be.equal(2)
    expect(builder.collection.services[1]).to.be.equal(NewService)
  })

  it('configure services', () => {
    const builder = new Builder()
    builder.build(services => {
      services.addSingleton(SingletonService)
      services.addTransient(TransientService)
      // By constructor
      services.configure(SingletonService, () => null)
      // By name
      services.configure(TransientService, () => null)
    })
    const { collection: col } = builder
    const singleton = col.services[col.names['singleton']]
    const transient = col.services[col.names['transient']]
    expect(singleton.config).to.be.a('function')
    expect(transient.config).to.be.a('function')
  })

})
