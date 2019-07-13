const isConstructor = fn => typeof fn === 'function' && fn.hasOwnProperty('prototype')

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
    let index = this._collection.names[name.toLowerCase()]
    if (index === undefined)
      throw new Error(`Missing service "${name}"`)
    return this.createService(index)
  }

  serviceOrNull(name) {
    let index = this._collection.names[name.toLowerCase()]
    if (index === undefined) return null
    return this.createService(index)
  }

  createService(index) {
    let Service = this._collection.services[index]
    let instance, name = Service.service
    let { SINGLETON, SCOPED } = this._collection.types

    // Validate resolution, singleton must not resolve scoped or transient.
    // If `this._parent` exists, means that, this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && Service.type > SINGLETON)
      throw new Error('Singletons should not get scoped or transient services')

    if (Service.type <= SINGLETON) {
      if (this._parent) {
        // Use parent instead
        instance = this._parent.createService(index)
      } else {
        instance = this._instances[name]
        if (!instance) {
          instance = this._instantiate(Service)
          this._instances[name] = instance
        }
      }
    } else if (Service.type === SCOPED) {
      instance = this._instances[name]
      if (!instance) {
        instance = this._instantiate(Service)
        this._instances[name] = instance
      }
    } else {
      instance = this._instantiate(Service)
    }
    return instance
  }

  _instantiate(Service) {
    return isConstructor(Service) ?
      new Service(this, Service.config && Service.config(this)) :
      Service()
  }

}
