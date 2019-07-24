
function defaultGetter(name) {
  return this.provider.serviceOrNull(name)
}

export function connectAdapter(contextProto, options = {}) {
  return {
    proto: contextProto,
    getter: options.getter || defaultGetter,
    setter: options.setter || function (req, res, next) {
      // this = container
      req.provider = this.createProvider()
      next()
    }
  }
}

export function koaAdapter(contextProto, options = {}) {
  return {
    proto: contextProto,
    getter: options.getter || defaultGetter,
    setter: options.setter || function (ctx, next) {
      // this = container
      ctx.provider = this.createProvider()
      next()
    }
  }
}
