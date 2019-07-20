import { isFunction, isConstructor } from './util'

export default class ServiceProvider {

  _collection = null
  _instances = {}
  _parent = null

  constructor(collection, parentProvider) {
    this._collection = collection
    this._parent = parentProvider
  }

  get(name) {
    return this.service(name)
  }

  getOrNull(name) {
    return this.serviceOrNull(name)
  }

  service(name) {
    name = name.toLowerCase()
    const service = this._collection.get(name)
    if (service === undefined)
      throw new Error(`Missing service "${name}"`)
    return this._createService(service)
  }

  serviceOrNull(name) {
    name = name.toLowerCase()
    const service = this._collection.get(name)
    if (service === undefined) return null
    return this._createService(service)
  }

  _createService(service) {
    let instance,
      { name } = service,
      { SINGLETON, SCOPED } = this._collection.types

    // Validate resolution, singleton must not resolve scoped or transient.
    // If `this._parent` exists, means that, this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && service.type > SINGLETON)
      throw new Error('Scoped provider should not get scoped or transient services')

    if (service.type <= SINGLETON) {
      if (this._parent) {
        // Use parent instead
        instance = this._parent._createService(service)
      } else {
        instance = this._instances[name]
        if (!instance) {
          instance = this._instantiate(service)
          this._instances[name] = instance
        }
      }
    } else if (service.type === SCOPED) {
      instance = this._instances[name]
      if (!instance) {
        instance = this._instantiate(service)
        this._instances[name] = instance
      }
    } else {
      instance = this._instantiate(service)
    }
    return instance
  }

  _instantiate(service) {
    const Service = service.value
    const { config } = service
    if (isConstructor(Service)) return new Service(this, isFunction(config) ? config(this) : config)
    return Service()
  }

}
