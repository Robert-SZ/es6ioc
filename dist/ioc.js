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
            return obj;
        },
        'function': function _function(ctor, deps) {
            var instance = Object.create(ctor.prototype);
            return ctor.apply(instance, deps) || instance;
        },
        '*': function _() {
            throw new TypeError('Resolving undefined type');
        }
    };

    function _assertIsDefined(obj, message) {
        if (obj === undefined) {
            throw new TypeError(message);
        }
    }

    function getError(error, type) {
        var message = typeof error == "string" ? error : error.message + ' -> ' + type;
        var stack = error.stack ? error.stack : null;
        message = message.replace('Type not registered: ->', 'Type not registered:');
        var newError = new TypeError(message);
        newError.stack = stack;
        throw newError;
    }

    var Ioc = (function () {
        function Ioc() {
            _classCallCheck(this, Ioc);

            this._map = new Map();
        }

        _createClass(Ioc, [{
            key: 'registerType',
            value: function registerType(key, value) {

                if (!key) {
                    throw new TypeError('Argument key \'' + key + '\' is undefined');
                }

                _assertIsDefined(value, 'Argument value of \'' + key + '\' is undefined');

                var registeredType = this._map.get(key);
                if (registeredType) {
                    if (registeredType !== value) {
                        throw new TypeError('Type already registered: ' + key);
                    }
                }

                this._map.set(key, value);
                this._findCircularDependencies(key);
                return this;
            }
        }, {
            key: 'resolve',
            value: function resolve(type) {
                var _this = this;

                try {
                    var registeredType = this._map.get(type);
                    _assertIsDefined(registeredType, 'Type not registered:');

                    var typeOfResolve = typeof registeredType;
                    var injectProperty = (this._getInject(registeredType) || []).map(function (t) {
                        return _this.resolve(t);
                    });
                    return (resolver[typeOfResolve] || resolver['*'])(registeredType, injectProperty);
                } catch (error) {
                    throw getError(error, type);
                }
            }
        }, {
            key: 'testConfig',
            value: function testConfig() {
                var _this2 = this;

                this._map.forEach(function (resolve, registeredType) {
                    (resolve.$inject || []).forEach(function (type) {
                        _assertIsDefined(_this2._map.get(type), 'Dependency \'' + type + '\' injected to \'' + registeredType + '\' but not registred');
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