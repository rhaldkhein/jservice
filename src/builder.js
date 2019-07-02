import ServiceCollection from './collection'
import ServiceProvider from './provider'
import defaultAdapter from './adapters/connect'

export default class Builder {

  collection = null
  provider = null
  isReady = false
  defaultAdapter = defaultAdapter

  constructor(registry) {
    this.collection = new ServiceCollection(this)
    this.collection.singleton(this, '$core')
    this.provider = new ServiceProvider(this.collection)
    this.build(registry)
  }

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

  createScopedProvider() {
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

}
