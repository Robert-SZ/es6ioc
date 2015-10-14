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

    registerType(type, resolve) {
        if (!type) {
            throw new TypeError('Argument `type` is undefined');
        }

        _assertIsDefined(resolve, 'Argument `resolve` is undefined');

        let registeredType = this._map.get(type);
        if (registeredType)
            throw new TypeError('Type already registered: ' + type);

        this._map.set(type, resolve);
        this._findCircularDependencies(type);
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

