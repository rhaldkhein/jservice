import { isFunction, isConstructor } from './util'

export default class ServiceProvider {

  // _collection = null
  // _instances = null
  // _parent = null

  constructor(collection, parentProvider, instances) {
    this._collection = collection
    this._parent = parentProvider
    // Pre-fill instances
    this._instances = instances || {}
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
    name = name.toLowerCase()
    const instance = this._instances[name]
    if (instance) return instance
    const service = this._collection.get(name)
    if (service === undefined) return null
    return this._createService(service)
  }

  _createService(service) {
    let instance, { name } = service

    // CONCRETE: 0
    // SINGLETON: 1
    // SCOPED: 2
    // TRANSIENT: 3

    // Validate resolution, singleton must not resolve scoped or transient.
    // If `this._parent` exists, means that, this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && service.type > 1)
      throw new Error('Scoped provider should not get scoped or transient services')

    // No instance create one
    if (service.type <= 1) {
      if (this._parent) {
        // Use parent instead
        instance = this._parent._createService(service)
      } else {
        instance = this._instantiate(service)
        this._instances[name] = instance
      }
    } else {
      instance = this._instantiate(service)
      if (service.type === 2) this._instances[name] = instance
    }
    return instance
  }

  _createServiceProvider(service) {
    const { deps } = service
    if (isFunction(deps)) {
      return new ServiceProvider(
        this._collection,
        this._parent,
        deps(this))
    } else {
      return this
    }
  }

  _instantiate(service) {
    const Service = service.value
    const { config } = service
    if (isConstructor(Service))
      return new Service(
        this._createServiceProvider(service),
        isFunction(config) ? config(this) : config
      )
    return Service()
  }

}
