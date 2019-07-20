import ServiceCollection from './collection'
import ServiceProvider from './provider'
import defaultAdapter from './adapters/connect'

export default class Container {

  parent = null
  collection = null
  provider = null
  isReady = false

  constructor(registry, parent) {
    this.parent = parent
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection, parent && parent.provider)
    this.build(registry)
  }

  defaultAdapter = defaultAdapter

  init(adapter) {
    if (!adapter) adapter = this.defaultAdapter()
    adapter.proto.serviceOrNull = adapter.getter
    adapter.proto.service = function (name) {
      const service = this.serviceOrNull(name)
      if (!service) throw new Error(`Missing service "${name}"`)
      return service
    }
    return adapter.setter.bind(this)
  }

  build(registry) {
    if (typeof registry === 'function')
      registry(this.collection)
    return this
  }

  start() {
    return Promise.all(this.invoke('start'))
      .then(() => {
        this.isReady = true
        this.invoke('ready')
      })
      .then(() => this.provider)
  }

  createContainer(registry) {
    return new Container(registry, this)
  }

  createProvider() {
    return new ServiceProvider(this.collection, this.provider)
  }

  invoke(event) {
    let results = []
    const { services } = this.collection
    services.forEach(service => {
      const method = service[event]
      if (method) results.push(method(this.provider))
    })
    return results
  }

  merge(container) {
    this.collection.merge(container.collection)
    return this
  }

}
