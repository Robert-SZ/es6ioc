'use strict';
const resolver = {
    number(obj){
        return obj;
    },
    string(obj){
        return obj;
    },
    boolean(obj){
        return obj;
    },
    object(obj){
        return obj;
    },
    'function': function (ctor, deps) {
        let instance = Object.create(ctor.prototype);
        return ctor.apply(instance, deps) || instance;
    },
    '*'(){
        throw new TypeError('Resolving undefined type');
    }
};

function _assertIsDefined(obj, message) {
    if (obj === undefined) {
        throw new TypeError(message);
    }
}

function getError(error, type) {
    let message = typeof error == "string" ? error : error.message + ' -> ' + type;
    let stack = error.stack ? error.stack : null;
    message = message.replace('Type not registered: ->', 'Type not registered:');
    let newError = new TypeError(message);
    newError.stack = stack;
    throw newError;
}

class Ioc {
    constructor() {
        this._map = {
            get: (key)=> {
                return this._map[key];
            },
            set: (key, value)=> {
                this._map[key] = value;
            }
        };
    }

    registerType(key, value) {

        if (!key) {
            throw new TypeError(`Argument key '${key}' is undefined`);
        }

        _assertIsDefined(value, `Argument value of '${key}' is undefined`);

        let registeredType = this._map.get(key);
        if (registeredType) {
            if (registeredType !== value) {
                throw new TypeError('Type already registered: ' + key);
            }
        }

        this._map.set(key, value);
        this._findCircularDependencies(key);
        return this;
    }

    resolve(type) {
        try {
            let registeredType = this._map.get(type);
            _assertIsDefined(registeredType, `Type not registered:`);

            const typeOfResolve = typeof(registeredType);
            let injectProperty = (this._getInject(registeredType) || []).map((t)=> {
                return this.resolve(t)
            });
            return (resolver[typeOfResolve] || resolver['*'])(registeredType, injectProperty);
        }
        catch (error) {
            throw getError(error, type);
        }
    }

    testConfig() {
        for (let key in this._map) {
            (this._map.get(key).$inject || []).forEach(type=> {
                _assertIsDefined(this._map.get(type), `Dependency '${type}' injected to '${key}' but not registered`);
            });
        }
        return true;
    }

    _findCircularDependencies(type) {
        let path = [type];

        var loopInjects = (type) => {
            let inject = ((this._map.get(type) || {}).$inject || []).slice(0);
            let dep;
            while (inject.length) {
                dep = inject.shift();
                if (path.indexOf(dep) > -1) {
                    throw new TypeError(`CircularDependencies in ${path.concat(dep).join('->')}`);
                }
                path.push(dep);
                loopInjects(dep);
                path.pop();
            }
        };

        loopInjects(type);
    }

    _getInject(registeredType) {
        if (registeredType.$inject) {
            return registeredType.$inject;
        }
    }
}

export default Ioc;

