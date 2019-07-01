export default class ServiceProvider {

  _types = null
  _collection = null
  _instances = {}
  _parent = null

  constructor(collection, parentProvider) {
    this._collection = collection
    this._types = collection.types
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

    // Validate resolution, singleton should not resolve scoped or transient.
    // If `this._parent` exists, that means that this provider is a scoped.
    // Otherwise, singleton.
    if (!this._parent && Service.type > this._types.SINGLETON)
      throw new Error('Singletons should not get scoped or transient services')

    if (Service.type <= this._types.SINGLETON) {
      if (this._parent) {
        // Use parent instead
        instance = this._parent.createService(index)
      } else {
        instance = this._instances[name]
        if (!instance) {
          instance = Service.type === this._types.CONCRETE ?
            Service() :
            new Service(this, Service.config && Service.config(this))
          this._instances[name] = instance
        }
      }
    } else if (Service.type === this._types.SCOPED) {
      instance = this._instances[name]
      if (!instance) {
        instance = new Service(this, Service.config && Service.config(this))
        this._instances[name] = instance
      }
    } else {
      instance = new Service(this, Service.config && Service.config(this))
    }
    return instance
  }

}
