import Container from './container'
import ServiceCollection from './collection'
import ServiceProvider from './provider'

function create(registry) {
  return new Container().build(registry)
}

function mock(...services) {
  const container = new Container()
  if (typeof services[1] === 'string')
    services = [[services[0], services[1]]]
  services.forEach(s => container.collection.add(s[0], s[1], s[2]))
  return container
}

Object.assign(Container, {
  // Functions
  create,
  mock,
  // Classes
  ServiceCollection,
  ServiceProvider
})

export default Container
