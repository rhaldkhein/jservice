import { isConstructor, isFunction, isString } from './util'

export default class ServiceCollection {

  container = null
  services = []
  names = {}

  constructor(container) {
    if (!container.parent) this.singleton(container, 'core')
    this.container = container
  }

  _push(service, desc, skipIfExist) {
    const name = desc.name = (desc.name || service.service || '').toLowerCase()
    if (!name) throw new Error('Service must have a name')
    const index = this.names[name]
    desc.value = service
    if (index > -1) {
      if (skipIfExist) return
      // Allow override of service if name starts with `@`
      if (name[0] !== '@')
        throw new Error(`Service "${name}" is already registered or reserved`)
      this.services[index] = desc
    } else {
      if (service.singleton && desc.type !== this.types.SINGLETON)
        throw new Error(`Service "${name}" must be a singleton`)
      this.names[name] = this.services.length
      this.services.push(desc)
    }
    // Run setup static method
    if (isFunction(service.setup)) {
      service.setup(this.container.provider, this)
    }
  }

  get(name) {
    let service = this.services[this.names[name]],
      { parent } = this.container
    if (!service && parent) service = parent.collection.get(name)
    return service
  }

  configure(name, config) {
    const index = this.names[isConstructor(name) ? name.service : name]
    if (index === undefined)
      throw new Error(`Unable to configure unregistered service "${name}"`)
    this.services[index].config = config
  }

  add(service, name, config) {
    this.singleton(service, name, config)
  }

  singleton(service, name, config) {
    if (!service) return
    if (!isString(name)) {
      config = name
      name = null
    }
    let desc = { name, config }
    if (!isConstructor(service)) {
      const Service = () => service
      desc.type = this.types.CONCRETE
      desc.typeof = typeof service
      this._push(Service, desc)
      return
    }
    desc.type = this.types.SINGLETON
    this._push(service, desc)
  }

  transient(service, name, config) {
    if (!isConstructor(service)) return
    if (!isString(name)) {
      config = name
      name = null
    }
    let desc = { name, config, type: this.types.TRANSIENT }
    this._push(service, desc)
  }

  scoped(service, name, config) {
    if (!isConstructor(service)) return
    if (!isString(name)) {
      config = name
      name = null
    }
    let desc = { name, config, type: this.types.SCOPED }
    this._push(service, desc)
  }

  merge(col) {
    for (const key in col.names) {
      if (col.names.hasOwnProperty(key)) {
        const service = col.services[col.names[key]]
        this._push(service.value, service, true)
      }
    }
  }

}

ServiceCollection.prototype.types = {
  CONCRETE: 0,
  SINGLETON: 1,
  SCOPED: 2,
  TRANSIENT: 3,
}
