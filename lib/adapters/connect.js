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
      // this = req
      return this.provider.serviceOrNull(name);
    },
    setter: options.setter || function (req, res, next) {
      // this = container
      req.provider = this.createProvider();
      next();
    }
  };
}