const Container = require('../../lib')
const { ServiceCollection } = Container

describe('collection', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService,
    FooService
  } = global.services

  it('add services with minimum arguments', () => {
    new Container().build(services => {
      services.should.be.instanceOf(ServiceCollection)
      services.transient(TransientService)
      services.scoped(ScopedService)
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
      services.add(FooService)
      services.add(() => ({ anon: 'Anonymous' }), 'anon')
      expect(services.names.ultra).to.exist
      expect(services.names.anon).to.exist
      // # of services + 1 core
      expect(services.services).to.have.lengthOf(7)
    })
  })

  it('add services with different name', () => {
    const container = new Container()
    container.build(services => {
      services.transient(TransientService, 'xtransient')
      services.scoped(ScopedService, 'xscoped')
      services.singleton(SingletonService, 'xsingleton')
      services.add(FooService, 'xfoo')
    })
    const { collection: col } = container
    const transient = col.services[col.names['xtransient']].value
    const scoped = col.services[col.names['xscoped']].value
    const singleton = col.services[col.names['xsingleton']].value
    expect(transient).to.equal(TransientService)
    expect(scoped).to.equal(ScopedService)
    expect(singleton).to.equal(SingletonService)
  })

  it('add services and check types', () => {
    const container = new Container()
    container.build(services => {
      services.transient(TransientService)
      services.scoped(ScopedService)
      services.singleton(SingletonService)
      services.singleton({ ultra: 'man' }, 'ultra')
      services.add(FooService)
    })
    const { collection: col } = container
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
  })

  it('replace service', () => {
    const container = new Container()
    function ReplacableService() { }
    ReplacableService.service = '@replacable'
    function NewService() { }
    NewService.service = '@replacable'
    container.build(services => {
      services.transient(ReplacableService, () => null)
      services.transient(NewService, () => null)
    })
    expect(container.collection.services.length).to.be.equal(2)
    expect(container.collection.services[1].value).to.be.equal(NewService)
  })

  it('configure services', () => {
    const container = new Container()
    container.build(services => {
      services.singleton(SingletonService)
      services.transient(TransientService)
      // By constructor
      services.configure(SingletonService, () => null)
      // By name
      services.configure(TransientService, () => null)
    })
    const { collection: col } = container
    const singleton = col.services[col.names['singleton']]
    const transient = col.services[col.names['transient']]
    expect(singleton.config).to.be.a('function')
    expect(transient.config).to.be.a('function')
  })

  it('run setup method', (done) => {
    const container = new Container()
    function CustomService() { }
    CustomService.setup = () => { done() }
    container.collection.singleton(CustomService, 'custom')
  })

})
