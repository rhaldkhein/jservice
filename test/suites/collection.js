const Builder = require('../../lib')
const { ServiceCollection } = Builder

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
      services.transient(TransientService)
      services.scoped(ScopedService)
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
      services.add(FooService)
      services.add(() => ({ anon: 'Anonymous' }), 'anon')
      // # of services + 1 core
      expect(services.services).to.have.lengthOf(7)
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
      services.transient(TransientService, 'xtransient')
      services.scoped(ScopedService, 'xscoped')
      services.singleton(SingletonService, 'xsingleton')
      services.add(FooService, 'xfoo')
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

  it('run setup method', (done) => {
    const builder = new Builder()
    function CustomService() { }
    CustomService.setup = () => { done() }
    builder.collection.singleton(CustomService, 'custom')
  })

})
