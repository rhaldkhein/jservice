import ServiceCollection from './collection'
import ServiceProvider from './provider'

export default class Container {

  isReady = false

  constructor(registry, parent) {
    this.parent = parent
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection, parent && parent.provider)
    this.build(registry)
  }

  init(proto, opt = {}) {
    const setter = opt.setter || function (req, res, next) {
      req.provider = this.createProvider()
      res.constructor === Function ? res() : next()
    }
    proto.serviceOrNull = opt.getter || function (name) {
      return this.provider.serviceOrNull(name)
    }
    proto.service = function (name) {
      const service = this.serviceOrNull(name)
      if (!service) throw new Error(`Missing service "${name}"`)
      return service
    }
    return setter.bind(this)
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
      if (!service.enabled) return
      const method = service.value[event]
      if (method) results.push(method(this.provider))
    })
    return results
  }

  merge(container) {
    this.collection.merge(container.collection)
    return this
  }

  set strict(val) {
    this.collection.strict = val
  }

}
