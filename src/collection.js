export default class ServiceCollection {

  services = {}

  addScoped(service, name) {
    if (typeof service !== 'function') {
      this.addSingleton(service, name)
      return
    }
    name = (name || service.service).toLowerCase()
    // Allow replacing a service that starts with `@`
    if (name[0] !== '@' && this.services[name])
      throw new Error(`Service "${name}" is already registered`)
    this.services[name] = service
  }

  addSingleton(service, name) {
    if (typeof service !== 'function') {
      if (!name) throw new Error('Concrete service must have a name')
      const WrapperService = () => service
      WrapperService.isConcrete = true
      WrapperService.isSingleton = true
      WrapperService.service = name
      this.addScoped(WrapperService, name)
      return
    }
    service.isSingleton = true
    this.addScoped(service, name)
  }

}