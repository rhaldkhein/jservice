"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectAdapter = connectAdapter;
exports.koaAdapter = koaAdapter;

function defaultGetter(name) {
  return this.provider.serviceOrNull(name);
}

function connectAdapter(contextProto) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    proto: contextProto,
    getter: options.getter || defaultGetter,
    setter: options.setter || function (req, res, next) {
      // this = container
      req.provider = this.createProvider();
      next();
    }
  };
}

function koaAdapter(contextProto) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    proto: contextProto,
    getter: options.getter || defaultGetter,
    setter: options.setter || function (ctx, next) {
      // this = container
      ctx.provider = this.createProvider();
      next();
    }
  };
}