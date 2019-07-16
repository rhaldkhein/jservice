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

var ServiceCollection =
/*#__PURE__*/
function () {
  function ServiceCollection(core) {
    _classCallCheck(this, ServiceCollection);

    _defineProperty(this, "types", {
      CONCRETE: 0,
      SINGLETON: 1,
      SCOPED: 2,
      TRANSIENT: 3
    });

    _defineProperty(this, "services", []);

    _defineProperty(this, "names", {});

    this.singleton(core, '__core__');
  }

  _createClass(ServiceCollection, [{
    key: "_push",
    value: function _push(service, name, config, skip) {
      if (!name) throw new Error('Service must have a name');
      var index = this.names[name];

      if (index > -1) {
        if (skip) return; // Allow override of service if name starts with `@`

        if (name[0] !== '@') throw new Error("Service \"".concat(name, "\" is already registered"));
        this.services[index] = service;
      } else {
        if (service.singleton && service.type !== this.types.SINGLETON) throw new Error("Service \"".concat(name, "\" must be a singleton"));
        this.names[name] = this.services.length;
        this.services.push(service);
      }

      if (config) service.config = config; // Run setup static method

      if ((0, _util.isFunction)(service.setup)) {
        service.setup(this.services[0]().provider);
      }
    }
  }, {
    key: "configure",
    value: function configure(name, config) {
      var index = this.names[(0, _util.isFunction)(name) ? name.service : name];
      if (index === undefined) throw new Error("Unable to configure unregistered service \"".concat(name, "\""));
      this.services[index].config = config;
    }
  }, {
    key: "add",
    value: function add(service, name, config) {
      this.singleton(service, name, config);
    }
  }, {
    key: "singleton",
    value: function singleton(service, name, config) {
      if (!service) return;

      if (!(0, _util.isString)(name)) {
        config = name;
        name = null;
      }

      if (!(0, _util.isFunction)(service)) {
        var Service = function Service() {
          return service;
        };

        Service.type = this.types.CONCRETE;

        this._push(Service, name);

        Service.service = name;
        return;
      }

      name = (name || service.service || '').toLowerCase();
      service.type = this.types.SINGLETON;

      this._push(service, name, config);
    }
  }, {
    key: "transient",
    value: function transient(service, name, config) {
      if (!(0, _util.isFunction)(service)) return;

      if (!(0, _util.isString)(name)) {
        config = name;
        name = null;
      }

      name = (name || service.service || '').toLowerCase();
      service.type = this.types.TRANSIENT;

      this._push(service, name, config);
    }
  }, {
    key: "scoped",
    value: function scoped(service, name, config) {
      if (!(0, _util.isFunction)(service)) return;

      if (!(0, _util.isString)(name)) {
        config = name;
        name = null;
      }

      name = (name || service.service || '').toLowerCase();
      service.type = this.types.SCOPED;

      this._push(service, name, config);
    }
  }, {
    key: "merge",
    value: function merge(col) {
      for (var key in col.names) {
        if (col.names.hasOwnProperty(key)) {
          var index = col.names[key];

          this._push(col.services[index], key, null, true);
        }
      }
    }
  }]);

  return ServiceCollection;
}();

exports["default"] = ServiceCollection;