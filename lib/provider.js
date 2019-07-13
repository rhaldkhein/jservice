"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isConstructor = function isConstructor(fn) {
  return typeof fn === 'function' && fn.hasOwnProperty('prototype');
};

var ServiceProvider =
/*#__PURE__*/
function () {
  function ServiceProvider(collection, parentProvider) {
    _classCallCheck(this, ServiceProvider);

    _defineProperty(this, "_collection", null);

    _defineProperty(this, "_instances", {});

    _defineProperty(this, "_parent", null);

    this._collection = collection;
    this._parent = parentProvider;
  }

  _createClass(ServiceProvider, [{
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
      var index = this._collection.names[name.toLowerCase()];

      if (index === undefined) throw new Error("Missing service \"".concat(name, "\""));
      return this.createService(index);
    }
  }, {
    key: "serviceOrNull",
    value: function serviceOrNull(name) {
      var index = this._collection.names[name.toLowerCase()];

      if (index === undefined) return null;
      return this.createService(index);
    }
  }, {
    key: "createService",
    value: function createService(index) {
      var Service = this._collection.services[index];
      var instance,
          name = Service.service;
      var _this$_collection$typ = this._collection.types,
          SINGLETON = _this$_collection$typ.SINGLETON,
          SCOPED = _this$_collection$typ.SCOPED; // Validate resolution, singleton must not resolve scoped or transient.
      // If `this._parent` exists, means that, this provider is a scoped.
      // Otherwise, singleton.

      if (!this._parent && Service.type > SINGLETON) throw new Error('Singletons should not get scoped or transient services');

      if (Service.type <= SINGLETON) {
        if (this._parent) {
          // Use parent instead
          instance = this._parent.createService(index);
        } else {
          instance = this._instances[name];

          if (!instance) {
            instance = this._instantiate(Service);
            this._instances[name] = instance;
          }
        }
      } else if (Service.type === SCOPED) {
        instance = this._instances[name];

        if (!instance) {
          instance = this._instantiate(Service);
          this._instances[name] = instance;
        }
      } else {
        instance = this._instantiate(Service);
      }

      return instance;
    }
  }, {
    key: "_instantiate",
    value: function _instantiate(Service) {
      return isConstructor(Service) ? new Service(this, Service.config && Service.config(this)) : Service();
    }
  }]);

  return ServiceProvider;
}();

exports["default"] = ServiceProvider;