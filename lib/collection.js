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
  function ServiceCollection(container) {
    _classCallCheck(this, ServiceCollection);

    _defineProperty(this, "asyncs", []);

    _defineProperty(this, "services", []);

    _defineProperty(this, "names", {});

    _defineProperty(this, "strict", false);

    if (!container.parent) this.singleton(container, 'core');
    this.container = container;
  }

  _createClass(ServiceCollection, [{
    key: "_push",
    value: function _push(service, desc) {
      var _this = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (service.then) {
        service = service.then(function (asyncService) {
          _this._push(asyncService, desc, opt);

          return asyncService;
        });
        this.asyncs.push(service);
        return;
      }

      var name = desc.name = (desc.name || service.service || '').toLowerCase();
      if (!name) throw new Error('Service must have a name');
      var index = this.names[name];

      if (index > -1) {
        // Duplicate found, allow override of service if name starts with `@`
        if (name[0] !== '@') {
          // If not `@`, do something or throw error
          if (this.strict || opt.strict) throw new Error("Service \"".concat(name, "\" is already registered or reserved"));
          return;
        }

        this.services[index] = desc;
      } else {
        if (service.singleton && desc.type !== this.types.SINGLETON) throw new Error("Service \"".concat(name, "\" must be a singleton"));
        this.names[name] = this.services.length;
        this.services.push(desc);
      }

      desc.value = service; // desc.klass = isClass(service)

      desc.klass = (0, _util.isConstructor)(service);
      desc.enabled = true; // Run setup static method

      if ((0, _util.isFunction)(service.setup)) service.setup(this.container);
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

      if (!(0, _util.isFunction)(service) && !(service instanceof Promise)) {
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
    key: "get",
    value: function get(name) {
      var service = this.services[this.names[name]],
          parent = this.container.parent;
      if (!service && parent) service = parent.collection.get(name);
      return service;
    }
  }, {
    key: "getOwn",
    value: function getOwn(name) {
      var purpose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
      var index = this.names[(0, _util.isFunction)(name) ? name.service : name];
      if (index === undefined) throw new Error("Unable to ".concat(purpose, " unregistered service \"").concat(name, "\""));
      return this.services[index];
    }
  }, {
    key: "enable",
    value: function enable(name) {
      var yes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.getOwn(name, 'enable/disable').enabled = !!yes;
    }
  }, {
    key: "configure",
    value: function configure(name, config) {
      this.getOwn(name, 'configure').config = config;
    }
  }, {
    key: "merge",
    value: function merge(col) {
      for (var key in col.names) {
        if (col.names.hasOwnProperty(key)) {
          var service = col.services[col.names[key]];

          this._push(service.value, service);
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