"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ServiceCollection =
/*#__PURE__*/
function () {
  // container = null
  function ServiceCollection(container) {
    _classCallCheck(this, ServiceCollection);

    _defineProperty(this, "services", []);

    _defineProperty(this, "names", {});

    if (!container.parent) this.singleton(container, 'core');
    this.container = container;
  }

  _createClass(ServiceCollection, [{
    key: "_push",
    value: function _push(service, desc, skipIfExist) {
      var name = desc.name = (desc.name || service.service || '').toLowerCase();
      if (!name) throw new Error('Service must have a name');
      var index = this.names[name];
      desc.value = service;

      if (index > -1) {
        if (skipIfExist) return; // Allow override of service if name starts with `@`

        if (name[0] !== '@') throw new Error("Service \"".concat(name, "\" is already registered or reserved"));
        this.services[index] = desc;
      } else {
        if (service.singleton && desc.type !== this.types.SINGLETON) throw new Error("Service \"".concat(name, "\" must be a singleton"));
        this.names[name] = this.services.length;
        this.services.push(desc);
      } // Run setup static method


      if ((0, _util.isFunction)(service.setup)) {
        service.setup(this.container.provider, this);
      }
    }
  }, {
    key: "get",
    value: function get(name) {
      var service = this.services[this.names[name]],
          parent = this.container.parent;
      if (!service && parent) service = parent.collection.get(name);
      return service;
    }
  }, {
    key: "configure",
    value: function configure(name, config) {
      var index = this.names[(0, _util.isConstructor)(name) ? name.service : name];
      if (index === undefined) throw new Error("Unable to configure unregistered service \"".concat(name, "\""));
      this.services[index].config = config;
    }
  }, {
    key: "add",
    value: function add(service, name, deps) {
      this.singleton(service, name, deps);
    }
  }, {
    key: "singleton",
    value: function singleton(service, name, deps) {
      if (!service) return;

      if (!(0, _util.isString)(name)) {
        deps = name;
        name = null;
      }

      var desc = {
        name: name,
        deps: deps
      };

      if (!(0, _util.isConstructor)(service)) {
        var Service = function Service() {
          return service;
        };

        desc.type = this.types.CONCRETE;
        desc["typeof"] = _typeof(service);

        this._push(Service, desc);

        return;
      }

      desc.type = this.types.SINGLETON;

      this._push(service, desc);
    }
  }, {
    key: "transient",
    value: function transient(service, name, deps) {
      if (!(0, _util.isConstructor)(service)) return;

      if (!(0, _util.isString)(name)) {
        deps = name;
        name = null;
      }

      var desc = {
        name: name,
        deps: deps,
        type: this.types.TRANSIENT
      };

      this._push(service, desc);
    }
  }, {
    key: "scoped",
    value: function scoped(service, name, deps) {
      if (!(0, _util.isConstructor)(service)) return;

      if (!(0, _util.isString)(name)) {
        deps = name;
        name = null;
      }

      var desc = {
        name: name,
        deps: deps,
        type: this.types.SCOPED
      };

      this._push(service, desc);
    }
  }, {
    key: "merge",
    value: function merge(col) {
      for (var key in col.names) {
        if (col.names.hasOwnProperty(key)) {
          var service = col.services[col.names[key]];

          this._push(service.value, service, true);
        }
      }
    }
  }]);

  return ServiceCollection;
}();

exports["default"] = ServiceCollection;
ServiceCollection.prototype.types = {
  CONCRETE: 0,
  SINGLETON: 1,
  SCOPED: 2,
  TRANSIENT: 3
};