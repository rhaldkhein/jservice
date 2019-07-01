"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _require = require('jservice'),
    Builder = _require.Builder;

var proto = require('http').IncomingMessage.prototype;

if (proto.service !== undefined || proto.serviceOrNull !== undefined) throw new Error('Not compatible with the version of node');

proto.service = function (name) {
  return this._provider.service(name);
};

proto.serviceOrNull = function (name) {
  return this._provider.serviceOrNull(name);
};

function _default(registry) {
  var builder = new Builder().build(registry);

  function middleware(req, res, next) {
    req._provider = this.createScopedProvider();
    next();
  }

  return middleware.bind(builder);
}