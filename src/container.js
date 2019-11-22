import ServiceCollection from './collection'
import ServiceProvider from './provider'

export default class Container {

  isReady = false
  hooks = {}

  constructor(registry, parent) {
    this.parent = parent
    this.collection = new ServiceCollection(this)
    this.provider = new ServiceProvider(this.collection, parent && parent.provider)
    this.build(registry)
  }

  build(registry) {
    if (typeof registry === 'function')
      registry(this.collection)
    return this
  }

  createContainer(registry) {
    return new Container(registry, this)
  }

  createProvider() {
    return new ServiceProvider(this.collection, this.provider)
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

  merge(container) {
    this.collection.merge(container.collection)
    return this
  }

  on(event, handler) {
    this.hooks[event] = handler
    return this
  }

  setParent(container) {
    this.parent = container
    this.provider.setParent(container.provider)
    this.invoke('mount').then(() => container.invoke('attach'))
  }

  start() {
    if (this.isReady) return Promise.resolve(this.provider)
    return Promise.all(this.collection.asyncs)
      .then(() => this.invoke('start'))
      .then(() => this.invoke('prepare'))
      .then(() => {
        this.collection.asyncs = null
        this.isReady = true
        return this.invoke('ready')
      })
      .then(() => this.provider)
  }

  invoke(event) {
    let results = []
    const { services } = this.collection,
      hook = this.hooks[event]
    services.forEach(service => {
      if (!service.enabled) return
      const method = service.value[event]
      if (method) results.push(method(
        this.provider,
        this.collection.trimDesc(service)
      ))
    })
    if (hook) results.push(hook(this.provider))
    return Promise.all(results)
  }

  set strict(val) {
    this.collection.strict = val
  }

}
