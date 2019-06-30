"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isFunction(fn) {
  return typeof fn === 'function';
}

var ServiceCollection =
/*#__PURE__*/
function () {
  function ServiceCollection() {
    _classCallCheck(this, ServiceCollection);

    _defineProperty(this, "types", {
      CONCRETE: 0,
      SINGLETON: 1,
      SCOPED: 2,
      TRANSIENT: 3
    });

    _defineProperty(this, "services", []);

    _defineProperty(this, "names", {});
  }

  _createClass(ServiceCollection, [{
    key: "_push",
    value: function _push(service, name, config) {
      if (!name) throw new Error('Service must have a name');
      var index = this.names[name];

      if (index > -1) {
        // Allow override of service if name starts with `@`
        if (name[0] !== '@') throw new Error("Service \"".concat(name, "\" is already registered"));
        this.services[index] = service;
      } else {
        this.names[name] = this.services.length;
        this.services.push(service);
      }

      service.config = config;
    }
  }, {
    key: "configure",
    value: function configure(name, config) {
      var index = this.names[isFunction(name) ? name.service : name];
      if (index === undefined) throw new Error("Unable to configure unregistered service \"".concat(name, "\""));
      this.services[index].config = config;
    }
  }, {
    key: "singleton",
    value: function singleton(service, name, config) {
      if (!service) return;

      if (isFunction(name)) {
        config = name;
        name = null;
      }

      if (!isFunction(service)) {
        var Service = function Service() {
          return service;
        };

        this._push(Service, name);

        Service.type = this.types.CONCRETE;
        Service.service = name;
        return;
      }

      name = (name || service.service).toLowerCase();

      this._push(service, name, config);

      service.type = this.types.SINGLETON;
    }
  }, {
    key: "transient",
    value: function transient(service, name, config) {
      if (!isFunction(service)) return;

      if (isFunction(name)) {
        config = name;
        name = null;
      }

      name = (name || service.service).toLowerCase();

      this._push(service, name, config);

      service.type = this.types.TRANSIENT;
    }
  }, {
    key: "scoped",
    value: function scoped(service, name, config) {
      if (!isFunction(service)) return;

      if (isFunction(name)) {
        config = name;
        name = null;
      }

      name = (name || service.service).toLowerCase();

      this._push(service, name, config);

      service.type = this.types.SCOPED;
    }
  }]);

  return ServiceCollection;
}();

exports["default"] = ServiceCollection;