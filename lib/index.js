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

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var proto = _http["default"].IncomingMessage.prototype;

function middleware(registry) {
  if (proto.service !== undefined || proto.serviceOrNull !== undefined) throw new Error('Not compatible with the version of node');

  proto.service = function (name) {
    return this._provider.service(name);
  };

  proto.serviceOrNull = function (name) {
    return this._provider.serviceOrNull(name);
  };

  var builder = build(registry);

  function middleware(req, res, next) {
    req._provider = this.createScopedProvider();
    next();
  }

  return middleware.bind(builder);
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