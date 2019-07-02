import Builder from './builder'
import ServiceCollection from './collection'
import ServiceProvider from './provider'
import defaultAdapter from './adapters/connect'

function middleware(registry, adapter) {
  if (!adapter) adapter = defaultAdapter()
  adapter.proto.serviceOrNull = adapter.getter
  adapter.proto.service = function (name) {
    const service = this.serviceOrNull(name)
    if (!service) throw new Error(`Missing service "${name}"`)
    return service
  }
  return adapter.setter.bind(build(registry))
}

function build(registry) {
  return new Builder().build(registry)
}

function mock(...services) {
  const builder = new Builder()
  if (typeof services[1] === 'string')
    services = [[services[0], services[1]]]
  services.forEach(s => builder.collection.add(s[0], s[1]))
  return builder.provider
}

export default middleware
export {
  // Middlewares
  middleware as jservice,
  // Functions
  build,
  mock,
  // Classes
  Builder,
  ServiceCollection,
  ServiceProvider
}
