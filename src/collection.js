export default class ServiceCollection {

  services = {}

  addScopeService(service, name) {
    if (typeof service !== 'function') {
      this.addService(service, name)
      return
    }
    name = (name || service.service).toLowerCase()
    // Allow replacing a service that starts with `@`
    if (name[0] !== '@' && this.services[name])
      throw new Error(`Service "${name}" is already registered`)
    this.services[name] = service
  }

  addService(service, name) {
    if (typeof service !== 'function') {
      if (!name) throw new Error('Concrete service must have a name')
      const defaultService = () => service
      defaultService.isConcrete = true
      defaultService.isSingleton = true
      defaultService.service = name
      this.addScopeService(defaultService, name)
      return
    }
    service.isSingleton = true
    this.addScopeService(service, name)
  }

}