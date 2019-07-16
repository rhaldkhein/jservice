export default function (contextProto, options = {}) {
  return {
    proto: contextProto,
    getter: options.getter || function (name) {
      // this = req
      return this.provider.serviceOrNull(name)
    },
    setter: options.setter || function (req, res, next) {
      // this = builder
      req.provider = this.createProvider()
      next()
    }
  }
}
