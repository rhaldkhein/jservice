export default class ServiceProvider {

  _collection = null
  _instances = {}

  constructor(collection) {
    this._collection = collection
  }

  getService(name, options) {
    let Service = this._collection.services[name.toLowerCase()]
    if (!Service) return null
    return this._createService(Service, options)
  }

  getRequiredService(name, options) {
    let Service = this._collection.services[name.toLowerCase()]
    if (!Service)
      throw new Error(`Missing required service: ${name}`)
    return this._createService(Service, options)
  }

  _createService(Service) {
    let service, name = Service.service
    if (Service.isSingleton) {
      service = this._instances[name]
      if (!service) {
        service = Service.isConcrete ? Service() : new Service(this)
        this._instances[name] = service
      }
    } else {
      service = new Service(this)
    }
    return service
  }

}