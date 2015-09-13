/**
 * Created by RobertSabiryanov on 11.09.15.
 */
'use strict';

let map = new Map();

function registerType(type, resolve) {
    map.set(type, resolve);
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
    let object = map.get(type);
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
    resolve: resolve
}

