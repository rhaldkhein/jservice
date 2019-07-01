"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ServiceProvider =
/*#__PURE__*/
function () {
  function ServiceProvider(collection, parentProvider) {
    _classCallCheck(this, ServiceProvider);

    _defineProperty(this, "_types", null);

    _defineProperty(this, "_collection", null);

    _defineProperty(this, "_instances", {});

    _defineProperty(this, "_parent", null);

    this._collection = collection;
    this._types = collection.types;
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
          name = Service.service; // Validate resolution, singleton should not resolve scoped or transient.
      // If `this._parent` exists, that means that this provider is a scoped.
      // Otherwise, singleton.

      if (!this._parent && Service.type > this._types.SINGLETON) throw new Error('Singletons should not get scoped or transient services');

      if (Service.type <= this._types.SINGLETON) {
        if (this._parent) {
          // Use parent instead
          instance = this._parent.createService(index);
        } else {
          instance = this._instances[name];

          if (!instance) {
            instance = Service.type === this._types.CONCRETE ? Service() : new Service(this, Service.config && Service.config(this));
            this._instances[name] = instance;
          }
        }
      } else if (Service.type === this._types.SCOPED) {
        instance = this._instances[name];

        if (!instance) {
          instance = new Service(this, Service.config && Service.config(this));
          this._instances[name] = instance;
        }
      } else {
        instance = new Service(this, Service.config && Service.config(this));
      }

      return instance;
    }
  }]);

  return ServiceProvider;
}();

exports["default"] = ServiceProvider;