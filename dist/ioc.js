(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.ioc = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var resolver = {
        number: function number(obj) {
            return obj;
        },
        string: function string(obj) {
            return obj;
        },
        boolean: function boolean(obj) {
            return obj;
        },
        object: function object(obj) {
            if (obj == null) {
                throw new TypeError(type);
            }
            return obj;
        },
        'function': function _function(ctor, deps) {
            var instance = Object.create(ctor.prototype);
            ctor.apply(instance, deps);
            return instance;
        },
        '*': function _() {
            throw new TypeError(type);
        }
    };

    var Ioc = (function () {
        function Ioc() {
            _classCallCheck(this, Ioc);

            this._map = new Map();
        }

        _createClass(Ioc, [{
            key: 'registerType',
            value: function registerType(type, resolve) {
                var registeredType = this._map.get(type);
                if (registeredType) throw new TypeError('Type already registered: ' + type);

                this._map.set(type, resolve);
                this._findCircularDependencies(type);
            }
        }, {
            key: 'resolve',
            value: function resolve(type) {
                var _this = this;

                var registeredType = this._map.get(type);
                if (!registeredType) throw new TypeError('Type not registered: ' + type);

                var typeOfResolve = typeof registeredType;
                var injectProperty = (this._getInject(registeredType) || []).map(function (t) {
                    return _this.resolve(t);
                });
                return (resolver[typeOfResolve] || resolver['*'])(registeredType, injectProperty);
            }
        }, {
            key: 'testConfig',
            value: function testConfig() {
                var _this2 = this;

                this._map.forEach(function (resolve) {
                    (resolve.$inject || []).forEach(function (type) {
                        if (!_this2._map.get(type)) throw new ReferenceError('Dependency injected but not registred: ' + val);
                    });
                });
                return true;
            }
        }, {
            key: '_findCircularDependencies',
            value: function _findCircularDependencies(type) {
                var _this3 = this;

                var path = [type];

                var loopInjects = function loopInjects(type) {
                    var inject = ((_this3._map.get(type) || {}).$inject || []).slice(0);
                    var dep = undefined;
                    while (inject.length) {
                        dep = inject.shift();
                        if (path.indexOf(dep) > -1) {
                            throw new TypeError('CircularDependencies in ' + path.concat(dep).join('->'));
                        }
                        path.push(dep);
                        loopInjects(dep);
                        path.pop();
                    }
                };

                loopInjects(type);
            }
        }, {
            key: '_getInject',
            value: function _getInject(registeredType) {
                if (registeredType.$inject) {
                    return registeredType.$inject;
                }
            }
        }]);

        return Ioc;
    })();

    module.exports = Ioc;
});