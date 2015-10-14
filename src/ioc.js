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

class Ioc {
    constructor() {
        this._map = new Map();
    }

    registerType(key, value) {
        if(value===null || value===undefined){
            throw new ReferenceError('Value must be defined')
        }
        if (!key) {
            throw new TypeError('Argument `type` is undefined');
        }

        _assertIsDefined(value, 'Argument `resolve` is undefined');

        let registeredType = this._map.get(key);
        if (registeredType) {
            if (registeredType !== value)
                throw new TypeError('Type already registered: ' + key);
        }

        this._map.set(key, value);
        this._findCircularDependencies(key);
    }

    resolve(type) {
        let registeredType = this._map.get(type);
        _assertIsDefined(registeredType, `Type not registered: ${type}`);

        const typeOfResolve = typeof(registeredType);
        let injectProperty = (this._getInject(registeredType) || []).map((t)=> {
            return this.resolve(t)
        });
        return (resolver[typeOfResolve] || resolver['*'])(registeredType, injectProperty);
    }

    testConfig() {
        this._map.forEach((resolve, registeredType)=> {
            (resolve.$inject || []).forEach(type=> {
                _assertIsDefined(this._map.get(type), `Dependency '${type}' injected to '${registeredType}' but not registred`);
            });
        });
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

