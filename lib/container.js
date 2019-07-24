"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Container =
/*#__PURE__*/
function () {
  function Container(registry, parent) {
    _classCallCheck(this, Container);

    _defineProperty(this, "isReady", false);

    this.parent = parent;
    this.collection = new _collection["default"](this);
    this.provider = new _provider["default"](this.collection, parent && parent.provider);
    this.build(registry);
  }

  _createClass(Container, [{
    key: "init",
    value: function init(adapter) {
      adapter.proto.serviceOrNull = adapter.getter;

      adapter.proto.service = function (name) {
        var service = this.serviceOrNull(name);
        if (!service) throw new Error("Missing service \"".concat(name, "\""));
        return service;
      };

      return adapter.setter.bind(this);
    }
  }, {
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
    key: "createContainer",
    value: function createContainer(registry) {
      return new Container(registry, this);
    }
  }, {
    key: "createProvider",
    value: function createProvider() {
      return new _provider["default"](this.collection, this.provider);
    }
  }, {
    key: "invoke",
    value: function invoke(event) {
      var _this2 = this;

      var results = [];
      var services = this.collection.services;
      services.forEach(function (service) {
        var method = service.value[event];
        if (method) results.push(method(_this2.provider));
      });
      return results;
    }
  }, {
    key: "merge",
    value: function merge(container) {
      this.collection.merge(container.collection);
      return this;
    }
  }]);

  return Container;
}();

exports["default"] = Container;