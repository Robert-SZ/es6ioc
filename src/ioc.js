'use strict';
const resolver = {
    number(ioc, obj){
        return obj;
    },
    string(ioc, obj){
        return obj;
    },
    boolean(ioc, obj){
        return obj;
    },
    object(ioc, obj){
        if (obj == null) {
            throw new TypeError(type);
        }
        return obj;
    },
    'function': function (ioc, ctor, deps) {
        return ioc._createInstanceOfType(ctor, deps);
    },
    '*'(){
        throw new TypeError(type)
    }
}

class Ioc {
    constructor() {
        this._map = new Map();
    }

    registerType(type, resolve) {
        let object = this._map.get(type);
        if (object)
            throw new TypeError('Type already registred: ' + type);

        this._map.set(type, resolve);
        this._findCircularDependencies(type);
    }

    resolve(type) {
        let resolve = this._map.get(type);
        if (!resolve)
            throw new TypeError('Type not registred: ' + type);

        const typeOfResolve = typeof(resolve);
        let injectProperty = (this._getInject(resolve) || []).map(this.resolve.bind(this));
        return (resolver[typeOfResolve] || resolver['*'])(this, resolve, injectProperty);
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

    _createInstanceOfType(ctor, deps) {
        let instance = Object.create(ctor.prototype);
        ctor.apply(instance, deps);
        return instance;
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
        }

        loopInjects(type);
    }

    _getInject(resolve) {
        let inject;
        if (resolve.$inject) {
            return resolve.$inject;
        }

        //TODO непонятно зачем (
        for (let prop in resolve) {
            if (typeof (resolve[prop]) == 'function') {
                inject = this.getInject(resolve[prop]);
                if (inject)
                    return inject;
            }
        }
        return inject;
    }
}

export default Ioc;

