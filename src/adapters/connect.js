import http from 'http'

export default function (contextProto = http.IncomingMessage.prototype, options = {}) {
  return {
    proto: contextProto,
    getter: options.getter || function (name) {
      // this = req
      return this.provider.serviceOrNull(name)
    },
    setter: options.setter || function (req, res, next) {
      // this = builder
      req.provider = this.createScopedProvider()
      next()
    }
  }
}
