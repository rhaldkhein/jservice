const Container = require('../../lib')
const {
  ServiceProvider,
  ServiceCollection,
  create,
  mock
} = Container

describe('container', () => {

  const {
    TransientService,
    ScopedService,
    SingletonService,
    FooService
  } = global.services

  it('initial state', () => {
    const container = new Container()
    expect(container.isReady).to.be.false
    expect(container.collection).to.exist
    expect(container.provider).to.exist
  })

  it('start normally', () => {
    const container = new Container()
    return container
      .build(services => {
        services.should.be.instanceOf(ServiceCollection)
      })
      .start().should.eventually.be.instanceOf(ServiceProvider)
  })

  it('create scoped provider', () => {
    const container = new Container()
    const provider = container.createProvider()
    expect(provider).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.instanceOf(ServiceProvider)
    expect(provider._parent).to.be.equal(container.provider)
    expect(provider).to.be.not.equal(container.provider)
  })

  it('create scoped container', () => {

    const mainContainer = create(services => {
      services.singleton(SingletonService)
    })

    const subContainerA = mainContainer.createContainer(services => {
      services.scoped(ScopedService)
    })

    const singleton = subContainerA.provider.service('singleton')
    const scoped = subContainerA.provider.service('scoped')

    expect(singleton).to.be.instanceOf(SingletonService)
    expect(scoped).to.be.instanceOf(ScopedService)

    const subContainerB = subContainerA.createContainer(services => {
      services.transient(TransientService)
    })

    const singletonB = subContainerB.provider.service('singleton')
    const scopedB = subContainerB.provider.service('scoped')
    const transientB = subContainerB.provider.service('transient')

    expect(singletonB).to.be.instanceOf(SingletonService)
    expect(scopedB).to.be.instanceOf(ScopedService)
    expect(transientB).to.be.instanceOf(TransientService)

  })

  it('create using build function', () => {
    const container = create()
    expect(container).to.be.instanceOf(Container)
  })

  it('merge', () => {
    const containerA = create(services => {
      services.singleton(SingletonService)
      services.scoped(ScopedService)
      services.transient(TransientService)
    })
    const containerB = create(services => {
      services.transient(FooService)
    })
    containerB.merge(containerA)
    const singleton = containerB.provider.service('singleton')
    expect(singleton).to.be.instanceOf(SingletonService)
    // For scoped services
    const provider = containerB.createProvider()
    const scoped = provider.service('scoped')
    const transient = provider.service('transient')
    expect(scoped).to.be.instanceOf(ScopedService)
    expect(transient).to.be.instanceOf(TransientService)
  })

  it('mock function - empty', () => {
    const container = mock()
    expect(container).to.be.instanceOf(Container)
  })

  it('mock function - single service', () => {
    const container = mock({ foo: 'Bar' }, 'foo')
    expect(container).to.be.instanceOf(Container);
    (() => container.provider.service('foo')).should.not.throw(Error)
  })

  it('mock function - multiple services', () => {
    const container = mock(
      [{ foo: 'Bar' }, 'foo'],
      [{ baz: 'Yoo' }, 'baz']
    )
    expect(container).to.be.instanceOf(Container);
    (() => container.provider.service('foo')).should.not.throw(Error);
    (() => container.provider.service('baz')).should.not.throw(Error)
  })

  it('events', (done) => {
    function EventService() { }
    EventService.setup = (container) => {
      expect(container).to.be.instanceOf(Container)
    }
    EventService.start = provider => {
      expect(provider).to.be.instanceOf(ServiceProvider)
    }
    EventService.ready = provider => {
      expect(provider).to.be.instanceOf(ServiceProvider)
      done()
    }
    const container = new Container()
    container.build(services => {
      services.add(EventService, 'event')
    })
    container.start()
  })

})
