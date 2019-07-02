import Builder from './builder'
import ServiceCollection from './collection'
import ServiceProvider from './provider'

function create(registry) {
  return new Builder().build(registry)
}

function mock(...services) {
  const builder = new Builder()
  if (typeof services[1] === 'string')
    services = [[services[0], services[1]]]
  services.forEach(s => builder.collection.add(s[0], s[1]))
  return builder.provider
}

Object.assign(Builder, {
  // Functions
  create,
  mock,
  // Classes
  ServiceCollection,
  ServiceProvider
})

export default Builder
