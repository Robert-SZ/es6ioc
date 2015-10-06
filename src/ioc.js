/**
 * Created by RobertSabiryanov on 11.09.15.
 */
'use strict';

let _map = new Map();
let _mapInjects = new Map();

function registerType(type, resolve) {
    let object = _map.get(type);
    if (object)
        throw new TypeError('Type already registred: ' + type);
    _map.set(type, resolve);
    if (resolve.$inject) {
        _mapInjects.set(type, resolve.$inject);
    }
    findCircularDependencies(type, []);
}

function testConfig() {
    _mapInjects.forEach((value, key)=> {
        value.forEach(val=> {
            let object = _map.get(val);
            if (!object)
                throw new ReferenceError('Dependency injected but not registred: ' + val);
        });
    })
}

function findCircularDependencies(type, depsArray) {
    if (depsArray.indexOf(type) > -1)
        throw  new TypeError('CircularDependencies in ' + depsArray.concat(type).join('->'));
    let inject = _mapInjects.get(type);
    if (inject) {
        depsArray.push(type);
        inject.forEach(dep=> {
            depsArray.concat(findCircularDependencies(dep, depsArray));
        });
    }
    return depsArray;
}


function getInject(object) {
    let inject;
    for (let prop in object) {
        if (prop == '$inject')
            return object[prop];
        if (typeof (object[prop]) == 'function') {
            inject = getInject(object[prop]);
            if (inject)
                return inject;
        }
    }
    return inject;
}

function resolve(type) {
    let object = _map.get(type);
    if (!object)
        throw new TypeError('Type not registred: ' + type);
    let injectProperty = getInject(object);
    if (injectProperty) {
        let objectDeps = injectProperty.map((dep)=> {
            let objectDep = resolve(dep);
            if (objectDep)
                return objectDep;
        });
        let instance = Object.create(object.prototype);
        object.apply(instance, objectDeps);
        return instance;
    }
    else {
        switch (typeof(object)) {
            case 'number':
            case 'string':
            case 'boolean':
                return object;
            case 'function':
                return new object();
            case 'object':
                if (object == null) {
                    throw new TypeError(type);
                }
                return object;
            default:
                throw new TypeError(type);
        }
    }
}

export default {
    registerType: registerType,
    resolve: resolve,
    testConfig: testConfig

}

