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
      name = name.toLowerCase();
      var index = this._collection.names[name];
      if (index === undefined) throw new Error("Missing service \"".concat(name, "\""));
      return this._createService(index);
    }
  }, {
    key: "serviceOrNull",
    value: function serviceOrNull(name) {
      name = name.toLowerCase();
      var index = this._collection.names[name];
      if (index === undefined) return null;
      return this._createService(index);
    }
  }, {
    key: "_createService",
    value: function _createService(index) {
      var _this$_collection$typ = this._collection.types,
          SINGLETON = _this$_collection$typ.SINGLETON,
          SCOPED = _this$_collection$typ.SCOPED;
      var instance,
          service = this._collection.services[index],
          _service$desc = service.desc,
          name = _service$desc.name,
          type = _service$desc.type; // Validate resolution, singleton must not resolve scoped or transient.
      // If `this._parent` exists, means that, this provider is a scoped.
      // Otherwise, singleton.

      if (!this._parent && type > SINGLETON) throw new Error('Singletons should not get scoped or transient services');

      if (type <= SINGLETON) {
        if (this._parent) {
          // Use parent instead
          instance = this._parent._createService(index);
        } else {
          instance = this._instances[name];

          if (!instance) {
            instance = this._instantiate(service);
            this._instances[name] = instance;
          }
        }
      } else if (type === SCOPED) {
        instance = this._instances[name];

        if (!instance) {
          instance = this._instantiate(service);
          this._instances[name] = instance;
        }
      } else {
        instance = this._instantiate(service);
      }

      return instance;
    }
  }, {
    key: "_instantiate",
    value: function _instantiate(service) {
      var Service = service.value;
      var config = service.desc.config;
      if ((0, _util.isConstructor)(Service)) return new Service(this, (0, _util.isFunction)(config) ? config(this) : config);
      return Service();
    }
  }]);

  return ServiceProvider;
}();

exports["default"] = ServiceProvider;