import Builder from './builder'
import ServiceCollection from './collection'
import ServiceProvider from './provider'
import http from 'http'

const proto = http.IncomingMessage.prototype

function middleware(registry) {
  if (
    proto.service !== undefined ||
    proto.serviceOrNull !== undefined
  ) throw new Error('Not compatible with the version of node')
  proto.service = function (name) {
    return this._provider.service(name)
  }
  proto.serviceOrNull = function (name) {
    return this._provider.serviceOrNull(name)
  }
  const builder = build(registry)
  function middleware(req, res, next) {
    req._provider = this.createScopedProvider()
    next()
  }
  return middleware.bind(builder)
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
