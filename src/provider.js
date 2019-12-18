import { isFunction } from './util'

export default class ServiceProvider {

  _collection = null
  _parent = null
  _instances = null

  constructor(collection, parentProvider, instances = {}) {
    // The collection of services to resolve from
    this.setCollection(collection)
    // The parent also holds instances
    this.setParent(parentProvider, instances)
  }

  clear() {
    this._instances = {}
  }

  create(instances) {
    return new ServiceProvider(
      this._collection,
      this._parent,
      instances
    )
  }

  get(name) {
    return this.service(name)
  }

  getOrNull(name) {
    return this.serviceOrNull(name)
  }

  service(name) {
    const service = this.serviceOrNull(name)
    if (service === null)
      throw new Error(`Missing service "${name}"`)
    return service
  }

  serviceOrNull(name) {
    return this._createService(name.toLowerCase())
  }

  setCollection(collection) {
    this._collection = collection
  }

  setParent(provider, instances) {
    this._parent = provider
    if (instances) this._instances = instances
  }

  _createService(name) {
    // CONCRETE: 0
    // SINGLETON: 1
    // SCOPED: 2
    // TRANSIENT: 3

    let instance = this._instances[name]
    if (instance) return instance
    // Resolve service from collection
    const service = this._collection.get(name)
    if (service === undefined || !service.enabled) return null

    // Validate resolution, singleton must not resolve scoped or transient.
    // If `this._parent` exists, means that, this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && service.type > 1)
      throw new Error('Scoped provider should not get scoped or transient services')

    // No instance create one
    if (service.type <= 1) {
      if (this._parent)
        instance = this._parent._createService(name)
      if (!instance) {
        instance = this._instantiate(service)
        this._instances[name] = instance
      }
    } else {
      instance = this._instantiate(service)
      if (service.type === 2) this._instances[name] = instance
    }
    return instance
  }

  _instantiate(service) {
    const { config, value: Service, deps } = service
    const desc = this._collection.trimDesc(service)
    const objConfig = isFunction(config) ? config(this) : config
    if (deps) return deps(this, objConfig, desc)
    return service.klass ?
      (new Service(this, objConfig, desc)) :
      (isFunction(Service) ? Service(this, objConfig, desc) : Service)
  }

}
