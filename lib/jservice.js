"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _container = _interopRequireDefault(require("./container"));

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function create(registry) {
  return new _container["default"]().build(registry);
}

function mock() {
  for (var _len = arguments.length, services = new Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  var container = new _container["default"]();
  if (typeof services[1] === 'string') services = [[services[0], services[1]]];
  services.forEach(function (s) {
    return container.collection.add(s[0], s[1], s[2]);
  });
  return container;
}

Object.assign(_container["default"], {
  // Functions
  create: create,
  mock: mock,
  // Classes
  ServiceCollection: _collection["default"],
  ServiceProvider: _provider["default"]
});
var _default = _container["default"];
exports["default"] = _default;