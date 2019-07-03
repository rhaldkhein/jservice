const isFunction = fn => typeof fn === 'function'

export default class ServiceCollection {

  types = {
    CONCRETE: 0,
    SINGLETON: 1,
    SCOPED: 2,
    TRANSIENT: 3,
  }

  services = []
  names = {}

  constructor(core) {
    this.singleton(core, '__core__')
  }

  _push(service, name, config) {
    if (!name) throw new Error('Service must have a name')
    const index = this.names[name]
    if (index > -1) {
      // Allow override of service if name starts with `@`
      if (name[0] !== '@')
        throw new Error(`Service "${name}" is already registered`)
      this.services[index] = service
    } else {
      if (service.singleton && service.type !== this.types.SINGLETON)
        throw new Error(`Service "${name}" must be a singleton`)
      this.names[name] = this.services.length
      this.services.push(service)
    }
    service.config = config
    // Run setup static method
    if (isFunction(service.setup)) {
      service.setup(this.services[0]().provider)
    }
  }

  configure(name, config) {
    const index = this.names[isFunction(name) ? name.service : name]
    if (index === undefined)
      throw new Error(`Unable to configure unregistered service "${name}"`)
    this.services[index].config = config
  }

  add(service, name, config) {
    this.singleton(service, name, config)
  }

  singleton(service, name, config) {
    if (!service) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    if (!isFunction(service)) {
      const Service = () => service
      Service.type = this.types.CONCRETE
      this._push(Service, name)
      Service.service = name
      return
    }
    name = (name || service.service).toLowerCase()
    service.type = this.types.SINGLETON
    this._push(service, name, config)
  }

  transient(service, name, config) {
    if (!isFunction(service)) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    name = (name || service.service).toLowerCase()
    service.type = this.types.TRANSIENT
    this._push(service, name, config)
  }

  scoped(service, name, config) {
    if (!isFunction(service)) return
    if (isFunction(name)) {
      config = name
      name = null
    }
    name = (name || service.service).toLowerCase()
    service.type = this.types.SCOPED
    this._push(service, name, config)
  }

}
