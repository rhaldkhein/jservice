export default class ServiceCollection {

  types = {
    CONCRETE: 0,
    SINGLETON: 1,
    SCOPED: 2,
    TRANSIENT: 3,
  }

  services = []
  names = {}

  _push(service, name) {
    if (!name) throw new Error('Service must have a name')
    if (this.names[name])
      throw new Error(`Service "${name}" is already registered`)
    this.names[name] = this.services.length
    this.services.push(service)
  }

  add(service, name) {
    return this.addSingleton(service, name)
  }

  addSingleton(service, name) {
    if (!service) return
    if (typeof service !== 'function') {
      const Service = () => service
      this._push(Service, name)
      Service.type = this.types.CONCRETE
      Service.service = name
      return
    }
    name = (name || service.service).toLowerCase()
    this._push(service, name)
    service.type = this.types.SINGLETON
  }

  addTransient(service, name) {
    if (!service) return
    name = (name || service.service).toLowerCase()
    this._push(service, name)
    service.type = this.types.TRANSIENT
  }

  addScoped(service, name) {
    if (!service) return
    name = (name || service.service).toLowerCase()
    this._push(service, name)
    service.type = this.types.SCOPED
  }

}
