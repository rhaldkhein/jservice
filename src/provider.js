export default class ServiceProvider {

  _collection = null
  _instances = {}

  constructor(collection) {
    this._collection = collection
  }

  get(name, options) {
    return this.getService(name, options)
  }

  getService(name, options) {
    let index = this._collection.names[name.toLowerCase()]
    if (index === undefined) return null
    return this.createService(index, options)
  }

  getRequired(name, options) {
    return this.getRequiredService(name, options)
  }

  getRequiredService(name, options) {
    let index = this._collection.names[name.toLowerCase()]
    if (index === undefined)
      throw new Error(`Missing required service "${name}"`)
    return this.createService(index, options)
  }

  createService(index, options) {
    let Service = this._collection.services[index]
    let instance, name = Service.service
    if (Service.isSingleton) {
      instance = this._instances[name]
      if (!instance) {
        instance = Service.isConcrete ? Service() : new Service(this, options)
        this._instances[name] = instance
      }
    } else {
      instance = new Service(this, options)
    }
    return instance
  }

}