import { isConstructor, isFunction, isString } from './util'

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

  // _push(service, name, config, skip) {
  _push(value, desc, skipIfExist) {
    const name = desc.name = (desc.name || value.service || '').toLowerCase()
    if (!name) throw new Error('Service must have a name')
    const index = this.names[name]
    if (index > -1) {
      if (skipIfExist) return
      // Allow override of service if name starts with `@`
      if (name[0] !== '@')
        throw new Error(`Service "${name}" is already registered`)
      this.services[index] = { value, desc }
    } else {
      if (value.singleton && desc.type !== this.types.SINGLETON)
        throw new Error(`Service "${name}" must be a singleton`)
      desc.index = this.names[name] = this.services.length
      this.services.push({ value, desc })
    }
    // Run setup static method
    if (isFunction(value.setup)) {
      const core = this.services[0].value()
      value.setup(core.provider, core.collection)
    }
  }

  configure(name, config) {
    const index = this.names[isConstructor(name) ? name.service : name]
    if (index === undefined)
      throw new Error(`Unable to configure unregistered service "${name}"`)
    this.services[index].desc.config = config
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
        this._push(service.value, service.desc, true)
      }
    }
  }

}
