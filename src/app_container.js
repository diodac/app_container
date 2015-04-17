(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.app_container = factory();
  }
}(this, function () {
    'use strict';
    
    var registry = {};
    
    var Const = function(value) {
        this.getValue = function() {
            return value;
        }
    }
    
    var Lazy = function(name, fn) {
        this.getParams = function(container) {
            return [name, fn(container)];
        }
    }
 
    var Value = function(val) {
        this.getValue = function() {
            return val;
        }
    }
    
    function getLazy(container, name) {
        container.register.apply(container, registry[name].getParams(container));
        return container.get(name);
    }
    
    return {
        register: function(name, obj) {
            if (registry[name] && registry[name] instanceof Const) {
                throw 'You cannot override constant (' + name + ') value';
            } else if (obj !== undefined) {
                registry[name] = obj;
            }
        },
        set: function(name, obj) {
            this.register(name, new Value(obj));
        },
        define: function(name, obj) {
            this.register(name, new Const(obj));
        },
        defer: function(name, fn) {
            this.register(name, new Lazy(name, fn));
        },
        get: function(name) {
            if (registry[name] instanceof Const) {
                return registry[name].getValue();
            } else if (typeof registry[name] === 'function') {
                return registry[name](this);
            } else if (registry[name] instanceof Value) {
                return registry[name].getValue();
            } else if (registry[name] instanceof Lazy) {
                return getLazy(this, name);
            } else {
                return registry[name];
            }
        },
        run: function(name, args) {
            var fn = this.get(name);
            if (typeof fn !== 'function') {
                throw name + ' is not a function';
            }
            return fn.apply(null, args);
        },
        has: function(name) {
            return registry.hasOwnProperty(name);
        },
        defined: function(name) {
            return this.has(name) && registry[name] instanceof Const;
        },
        showRegistry: function() { //FIXME: remove in production
            return registry;
        },
        reset: function() { //FIXME: remove in production
            registry = {};
        }
    }
}));