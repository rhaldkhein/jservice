"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default() {
  var contextProto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _http["default"].IncomingMessage.prototype;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    proto: contextProto,
    getter: options.getter || function (name) {
      // this = ctx
      return this.provider.serviceOrNull(name);
    },
    setter: options.setter || function (req, res, next) {
      // this = builder
      req.provider = this.createScopedProvider();
      next();
    }
  };
}