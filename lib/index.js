"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.mock = mock;
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
exports.Builder = exports["default"] = void 0;

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Builder =
/*#__PURE__*/
function () {
  function Builder() {
    _classCallCheck(this, Builder);

    _defineProperty(this, "collection", null);

    _defineProperty(this, "provider", null);

    _defineProperty(this, "isReady", false);

    this.collection = new _collection["default"](this);
    this.collection.singleton(this, '$core');
    this.provider = new _provider["default"](this.collection);
  }

  _createClass(Builder, [{
    key: "build",
    value: function build(registry) {
      if (typeof registry === 'function') registry(this.collection);
      return this;
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      return Promise.all(this.invoke('start')).then(function () {
        _this.isReady = true;

        _this.invoke('ready');
      }).then(function () {
        return _this.provider;
      });
    }
  }, {
    key: "createScopedProvider",
    value: function createScopedProvider() {
      return new _provider["default"](this.collection, this.provider);
    }
  }, {
    key: "invoke",
    value: function invoke(event) {
      var _this2 = this;

      var results = [];
      var services = this.collection.services;
      services.forEach(function (service) {
        var method = service[event];
        if (method) results.push(method(_this2.provider));
      });
      return results;
    }
  }]);

  return Builder;
}();

exports.Builder = Builder;

function build(registry) {
  return new Builder().build(registry);
}

function mock() {
  for (var _len = arguments.length, services = new Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  var builder = new Builder();
  if (typeof services[1] === 'string') services = [[services[0], services[1]]];
  services.forEach(function (s) {
    return builder.collection.add(s[0], s[1]);
  });
  return builder.provider;
}

var _default = build;
exports["default"] = _default;