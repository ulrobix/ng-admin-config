function isObject(value) {
    if (value === null) return false;
    if (typeof value !== 'object') return false;
    if (Array.isArray(value)) return false;
    if (Object.prototype.toString.call(value) === '[object Date]') return false;
    return true;
}

export function clone(object) {
    if (typeof object !== 'object') {
        throw new Error('Expecting an object parameter');
    }

    if (object == null) {
        return null;
    }

    var clone = Object.create(Object.getPrototypeOf(object));
    var keys = Object.getOwnPropertyNames(object);

    for (var i = 0; i < keys.length; i++) {
        clone[keys[i]] = object[keys[i]];
    }

    return clone;
}

/*
 * Flatten nested object into a single level object with 'foo.bar' property names
 *
 * The parameter object is left unchanged. All values in the returned object are scalar.
 *
 *     cloneAndFlatten({ a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } }, i: { j: 6 } }, ['i'])
 *     // { a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5, i: { j: 6 } } }
 *
 * @param {Object} object
 * @param {String[]} excludedProperties
 * @return {Object}
 */
export function cloneAndFlatten(object, excludedProperties = []) {
    if (typeof object !== 'object') {
        throw new Error('Expecting an object parameter');
    }
    return Object.keys(object).reduce((values, name) => {
        if (!object.hasOwnProperty(name)) return values;
        if (isObject(object[name])) {
            if (excludedProperties.indexOf(name) === -1) {
                let flatObject = cloneAndFlatten(object[name]);
                Object.keys(flatObject).forEach(flatObjectKey => {
                    if (!flatObject.hasOwnProperty(flatObjectKey)) return;
                    values[name + '.' + flatObjectKey] = flatObject[flatObjectKey];
                })
            } else {
                values[name] = clone(object[name]);
            }
        } else {
            values[name] = object[name];
        }
        return values;
    }, {});
};

/*
 * Clone flattened object into a nested object
 *
 * The parameter object is left unchanged.
 *
 *     cloneAndNest({ a: 1, 'b.c': 2, 'd.e': 3, 'd.f.g': 4, 'd.f.h': 5 } )
 *     // { a: 1, b: { c: 2 }, d: { e: 3, f: { g: 4, h: 5 } } }
 *
 * @param {Object} object
 * @return {Object}
 */
export function cloneAndNest(object) {
    if (typeof object !== 'object') {
        throw new Error('Expecting an object parameter');
    }
    return Object.keys(object).reduce((values, name) => {
        if (!object.hasOwnProperty(name)) return values;
        name.split('.').reduce((previous, current, index, list) => {
            if (previous != null) {
                if (typeof previous[current] === 'undefined') previous[current] = {};
                if (index < (list.length - 1)) {
                    return previous[current];
                };
                previous[current] = object[name];
            }
        }, values)
        return values;
    }, {})
}
