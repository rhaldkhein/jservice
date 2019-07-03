"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _builder = _interopRequireDefault(require("./builder"));

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function create(registry) {
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

Object.assign(_builder["default"], {
  // Functions
  create: create,
  mock: mock,
  // Classes
  ServiceCollection: _collection["default"],
  ServiceProvider: _provider["default"]
});
var _default = _builder["default"];
exports["default"] = _default;