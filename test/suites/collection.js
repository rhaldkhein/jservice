const { Builder, ServiceCollection } = require('../../lib')

describe('collection', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService
  } = global.services

  it('add services with minimum arguments', () => {
    new Builder().build(services => {
      services.should.be.instanceOf(ServiceCollection)
      services.transient(TransientService)
      services.scoped(ScopedService)
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
      // 3 services + 1 core
      expect(services.services).to.have.lengthOf(5)
      expect(services.services).to.include.members([
        TransientService,
        ScopedService,
        SingletonService
      ])
    })
  })

  it('add services with different name', () => {
    const builder = new Builder()
    builder.build(services => {
      services.transient(TransientService, 'xtransient')
      services.scoped(ScopedService, 'xscoped')
      services.singleton(SingletonService, 'xsingleton')
    })
    const { collection: col } = builder
    const transient = col.services[col.names['xtransient']]
    const scoped = col.services[col.names['xscoped']]
    const singleton = col.services[col.names['xsingleton']]
    expect(transient).to.equal(TransientService)
    expect(scoped).to.equal(ScopedService)
    expect(singleton).to.equal(SingletonService)
  })

  it('add services and check types with config ', () => {
    const builder = new Builder()
    builder.build(services => {
      services.transient(TransientService, () => null)
      services.scoped(ScopedService, () => null)
      services.singleton(SingletonService, () => null)
      services.singleton({ ultra: 'man' }, 'ultra')
    })
    const { collection: col } = builder
    const transient = col.services[col.names['transient']]
    const scoped = col.services[col.names['scoped']]
    const singleton = col.services[col.names['singleton']]
    const ultra = col.services[col.names['ultra']]
    // Types
    expect(transient.type).to.be.equal(col.types.TRANSIENT)
    expect(scoped.type).to.be.equal(col.types.SCOPED)
    expect(singleton.type).to.be.equal(col.types.SINGLETON)
    expect(ultra.type).to.be.equal(col.types.CONCRETE)
    // Config
    expect(transient.config).to.be.a('function')
    expect(scoped.config).to.be.a('function')
    expect(singleton.config).to.be.a('function')
  })

  it('replace service', () => {
    const builder = new Builder()
    function ReplacableService() { }
    ReplacableService.service = '@replacable'
    function NewService() { }
    NewService.service = '@replacable'
    builder.build(services => {
      services.transient(ReplacableService, () => null)
      services.transient(NewService, () => null)
    })
    expect(builder.collection.services.length).to.be.equal(2)
    expect(builder.collection.services[1]).to.be.equal(NewService)
  })

  it('configure services', () => {
    const builder = new Builder()
    builder.build(services => {
      services.singleton(SingletonService)
      services.transient(TransientService)
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
