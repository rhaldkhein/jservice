"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ServiceProvider =
/*#__PURE__*/
function () {
  function ServiceProvider(collection, parentProvider, instances) {
    _classCallCheck(this, ServiceProvider);

    _defineProperty(this, "_collection", null);

    _defineProperty(this, "_parent", null);

    _defineProperty(this, "_instances", null);

    // The collection of services to resolve from
    this.setCollection(collection); // The parent also holds instances

    this.setParent(parentProvider, instances);
  }

  _createClass(ServiceProvider, [{
    key: "create",
    value: function create(instances) {
      return new ServiceProvider(this._collection, this._parent, instances);
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.service(name);
    }
  }, {
    key: "getOrNull",
    value: function getOrNull(name) {
      return this.serviceOrNull(name);
    }
  }, {
    key: "service",
    value: function service(name) {
      var service = this.serviceOrNull(name);
      if (service === null) throw new Error("Missing service \"".concat(name, "\""));
      return service;
    }
  }, {
    key: "serviceOrNull",
    value: function serviceOrNull(name) {
      return this._createService(name.toLowerCase());
    }
  }, {
    key: "setCollection",
    value: function setCollection(collection) {
      this._collection = collection;
    }
  }, {
    key: "setParent",
    value: function setParent(provider) {
      var instances = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this._parent = provider;
      this._instances = instances;
    }
  }, {
    key: "_createService",
    value: function _createService(name) {
      // CONCRETE: 0
      // SINGLETON: 1
      // SCOPED: 2
      // TRANSIENT: 3
      var instance = this._instances[name];
      if (instance) return instance; // Resolve service from collection

      var service = this._collection.get(name);

      if (service === undefined || !service.enabled) return null; // Validate resolution, singleton must not resolve scoped or transient.
      // If `this._parent` exists, means that, this provider is a scoped.
      // Otherwise, singleton.

      if (!this._parent && service.type > 1) throw new Error('Scoped provider should not get scoped or transient services'); // No instance create one

      if (service.type <= 1) {
        if (this._parent) instance = this._parent._createService(name);

        if (!instance) {
          instance = this._instantiate(service);
          this._instances[name] = instance;
        }
      } else {
        instance = this._instantiate(service);
        if (service.type === 2) this._instances[name] = instance;
      }

      return instance;
    }
  }, {
    key: "_instantiate",
    value: function _instantiate(service) {
      var config = service.config,
          Service = service.value,
          deps = service.deps;

      var desc = this._collection.trimDesc(service);

      var objConfig = (0, _util.isFunction)(config) ? config(this) : config;
      if (deps) return deps(this, objConfig, desc);
      return service.klass ? new Service(this, objConfig, desc) : (0, _util.isFunction)(Service) ? Service(this, objConfig, desc) : Service;
    }
  }]);

  return ServiceProvider;
}();

exports["default"] = ServiceProvider;