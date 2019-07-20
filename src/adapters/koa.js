export default function (contextProto, options = {}) {
  return {
    proto: contextProto,
    getter: options.getter || function (name) {
      // this = ctx
      return this.provider.serviceOrNull(name)
    },
    setter: options.setter || function (ctx, next) {
      // this = container
      ctx.provider = this.createProvider()
      next()
    }
  }
}
