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
        if (obj == null) {
            throw new TypeError(type);
        }
        return obj;
    },
    'function': function (ctor, deps) {
        let instance = Object.create(ctor.prototype);
        ctor.apply(instance, deps);
        return instance;
    },
    '*'(){
        throw new TypeError(type)
    }
};

class Ioc {
    constructor() {
        this._map = new Map();
    }

    registerType(type, resolve) {
        let registeredType = this._map.get(type);
        if (registeredType)
            throw new TypeError('Type already registered: ' + type);

        this._map.set(type, resolve);
        this._findCircularDependencies(type);
    }

    resolve(type) {
        let registeredType = this._map.get(type);
        if (!registeredType)
            throw new TypeError('Type not registered: ' + type);

        const typeOfResolve = typeof(registeredType);
        let injectProperty = (this._getInject(registeredType) || []).map(this.resolve.bind(this));
        return (resolver[typeOfResolve] || resolver['*'])(registeredType, injectProperty);
    }

    testConfig() {
        this._map.forEach((resolve)=> {
            (resolve.$inject || []).forEach(type=> {
                if (!this._map.get(type))
                    throw new ReferenceError('Dependency injected but not registred: ' + val);
            });
        });
        return true;
    }


    _findCircularDependencies(type) {
        let path = [type];

        let loopInjects = (type) => {
            let inject = ((this._map.get(type) || {}).$inject || []).slice(0);
            let dep;
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

    _getInject(registeredType) {
        if (registeredType.$inject) {
            return registeredType.$inject;
        }
    }
}

export default Ioc;

