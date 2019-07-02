"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jservice = middleware;
exports.build = build;
exports.mock = mock;
Object.defineProperty(exports, "Builder", {
  enumerable: true,
  get: function get() {
    return _builder["default"];
  }
});
Object.defineProperty(exports, "ServiceCollection", {
  enumerable: true,
  get: function get() {
    return _collection["default"];
  }
});
Object.defineProperty(exports, "ServiceProvider", {
  enumerable: true,
  get: function get() {
    return _provider["default"];
  }
});
exports["default"] = void 0;

var _builder = _interopRequireDefault(require("./builder"));

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

var _connect = _interopRequireDefault(require("./adapters/connect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function middleware(registry, adapter) {
  if (!adapter) adapter = (0, _connect["default"])();
  adapter.proto.serviceOrNull = adapter.getter;

  adapter.proto.service = function (name) {
    var service = this.serviceOrNull(name);
    if (!service) throw new Error("Missing service \"".concat(name, "\""));
    return service;
  };

  return adapter.setter.bind(build(registry));
}

function build(registry) {
  return new _builder["default"]().build(registry);
}

function mock() {
  for (var _len = arguments.length, services = new Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  var builder = new _builder["default"]();
  if (typeof services[1] === 'string') services = [[services[0], services[1]]];
  services.forEach(function (s) {
    return builder.collection.add(s[0], s[1]);
  });
  return builder.provider;
}

var _default = middleware;
exports["default"] = _default;