
function isFunction(fn) {
  return typeof fn === 'function'
}

export default class ServiceCollection {

  types = {
    CONCRETE: 0,
    SINGLETON: 1,
    SCOPED: 2,
    TRANSIENT: 3,
  }

  services = []
  names = {}

  _push(service, name, config) {
    if (!name) throw new Error('Service must have a name')
    const index = this.names[name]
    if (index > -1) {
      // Allow override of service if name starts with `@`
      if (name[0] !== '@')
        throw new Error(`Service "${name}" is already registered`)
      this.services[index] = service
    } else {
      this.names[name] = this.services.length
      this.services.push(service)
    }
    service.config = config
  }

  configure(name, config) {
    const index = this.names[isFunction(name) ? name.service : name]
    if (index === undefined)
      throw new Error(`Unable to configure unregistered service "${name}"`)
    this.services[index].config = config
  }

  singleton(service, name, config) {
    if (!service) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    if (!isFunction(service)) {
      const Service = () => service
      this._push(Service, name)
      Service.type = this.types.CONCRETE
      Service.service = name
      return
    }
    name = (name || service.service).toLowerCase()
    this._push(service, name, config)
    service.type = this.types.SINGLETON
  }

  transient(service, name, config) {
    if (!isFunction(service)) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    name = (name || service.service).toLowerCase()
    this._push(service, name, config)
    service.type = this.types.TRANSIENT
  }

  scoped(service, name, config) {
    if (!isFunction(service)) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    name = (name || service.service).toLowerCase()
    this._push(service, name, config)
    service.type = this.types.SCOPED
  }

}
