export default class ServiceCollection {

  services = []
  names = {}

  add(service, name) {
    return this.addSingleton(service, name)
  }

  addSingleton(service, name) {
    if (!service) return
    if (typeof service !== 'function') {
      if (!name) throw new Error('Concrete service must have a name')
      const WrapperService = () => service
      WrapperService.isConcrete = true
      WrapperService.isSingleton = true
      WrapperService.service = name
      this.addTransient(WrapperService, name)
      return
    }
    service.isSingleton = true
    this.addTransient(service, name)
  }

  addTransient(service, name) {
    if (!service) return
    if (typeof service !== 'function') {
      this.addSingleton(service, name)
      return
    }
    name = (name || service.service).toLowerCase()
    if (this.names[name])
      throw new Error(`Service "${name}" is already registered`)
    this.names[name] = this.services.length
    this.services.push(service)
  }

}