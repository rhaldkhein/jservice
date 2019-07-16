"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(contextProto) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    proto: contextProto,
    getter: options.getter || function (name) {
      // this = ctx
      return this.provider.serviceOrNull(name);
    },
    setter: options.setter || function (ctx, next) {
      // this = builder
      ctx.provider = this.createProvider();
      next();
    }
  };
}