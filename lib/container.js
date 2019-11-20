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

    _defineProperty(this, "hooks", {});

    this.parent = parent;
    this.collection = new _collection["default"](this);
    this.provider = new _provider["default"](this.collection, parent && parent.provider);
    this.build(registry);
  }

  _createClass(Container, [{
    key: "build",
    value: function build(registry) {
      if (typeof registry === 'function') registry(this.collection);
      return this;
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
    key: "init",
    value: function init(proto) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var setter = opt.setter || function (req, res, next) {
        req.provider = this.createProvider();
        res.constructor === Function ? res() : next();
      };

      proto.serviceOrNull = opt.getter || function (name) {
        return this.provider.serviceOrNull(name);
      };

      proto.service = function (name) {
        var service = this.serviceOrNull(name);
        if (!service) throw new Error("Missing service \"".concat(name, "\""));
        return service;
      };

      return setter.bind(this);
    }
  }, {
    key: "invoke",
    value: function invoke(event) {
      var _this = this;

      var results = [];
      var services = this.collection.services,
          hook = this.hooks[event];
      services.forEach(function (service) {
        if (!service.enabled) return;
        var method = service.value[event];
        if (method) results.push(method(_this.provider, _this.collection.trimDesc(service)));
      });
      if (hook) results.push(hook(this.provider));
      return results;
    }
  }, {
    key: "merge",
    value: function merge(container) {
      this.collection.merge(container.collection);
      return this;
    }
  }, {
    key: "on",
    value: function on(event, handler) {
      this.hooks[event] = handler;
      return this;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      return Promise.all(this.collection.asyncs).then(function () {
        return Promise.all(_this2.invoke('start'));
      }).then(function () {
        return Promise.all(_this2.invoke('prepare'));
      }).then(function () {
        _this2.collection.asyncs = null;
        _this2.isReady = true;
        return Promise.all(_this2.invoke('ready'));
      }).then(function () {
        return _this2.provider;
      });
    }
  }, {
    key: "strict",
    set: function set(val) {
      this.collection.strict = val;
    }
  }]);

  return Container;
}();

exports["default"] = Container;