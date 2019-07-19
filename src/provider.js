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
    let index = this._collection.names[name]
    if (index === undefined)
      throw new Error(`Missing service "${name}"`)
    return this._createService(index)
  }

  serviceOrNull(name) {
    name = name.toLowerCase()
    let index = this._collection.names[name]
    if (index === undefined) return null
    return this._createService(index)
  }

  _createService(index) {
    let { SINGLETON, SCOPED } = this._collection.types
    let instance,
      service = this._collection.services[index],
      { name, type } = service.desc

    // Validate resolution, singleton must not resolve scoped or transient.
    // If `this._parent` exists, means that, this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && type > SINGLETON)
      throw new Error('Singletons should not get scoped or transient services')

    if (type <= SINGLETON) {
      if (this._parent) {
        // Use parent instead
        instance = this._parent._createService(index)
      } else {
        instance = this._instances[name]
        if (!instance) {
          instance = this._instantiate(service)
          this._instances[name] = instance
        }
      }
    } else if (type === SCOPED) {
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
    const { config } = service.desc
    if (isConstructor(Service)) return new Service(this, isFunction(config) ? config(this) : config)
    return Service()
  }

}
