import * as objectProperties from "../Utils/objectProperties";

class FieldCollection {

    constructor(factory) {
        this._factory = factory;
        this._fields = [];
        this._fieldMap = {};
    }

    isEmpty() {
        return this._fields.length == 0;
    }

    get length() {
        return this._fields.length;
    }

    clear() {
        this._fields = [];
        this._fieldMap = {};

        return this;
    }

    getField(name) {
        return this._fieldMap[name];
    }

    getFieldsOfType(type) {
        return this._fields.filter(f => f.type() === type);
    }

    fields() {
        if (!arguments.length) return this._fields;

        if (arguments.length == 1 && typeof arguments[0] == 'function') {
            var self = this;

            function fieldFn(name, type) {
                var field = self._fieldMap[name];
                if(field) {
                    var originalType = field.type();
                    if (type && type != originalType || !type && originalType != 'string') {
                        throw new Error(`Inconsistent field type request for an existing field: ${self._name}.${name}:${originalType}.`);
                    }
                } else {
                    // adding new field
                    field = self._factory.field(name, type);
                    self.addField(field);
                }
                return field;
            }

            arguments[0](fieldFn);
        } else {
            [].slice.call(arguments).map(function(argument) {
                FieldCollection.flatten(argument).map(arg => this.addField(arg));
            }, this);
        }

        return this;
    }

    addField(field) {
        if (field.order() === null) {
            field.order(this._fields.length, true);
        }
        this._fields.push(field);
        this._fields = this._fields.sort((a, b) => (a.order() - b.order()));

        this._fieldMap[field.name()] = field;

        return this;
    }

    static flatten(arg) {
        if (arg.constructor.name === 'Object') {
            console.warn('Passing literal of Field to fields method is deprecated use array instead');
            let result = [];
            for (let fieldName in arg) {
                result = result.concat(FieldCollection.flatten(arg[fieldName]));
            }
            return result;
        }
        if (Array.isArray(arg)) {
            return arg.reduce(function(previous, current) {
                return previous.concat(FieldCollection.flatten(current))
            }, []);
        }
        // arg is a scalar
        return [arg];
    }

    clone() {
        var clone = objectProperties.clone(this);
        clone._fields = [];
        clone._fieldMap = {};
        for (var i = 0; i < this._fields.length; i++) {
            var fieldClone = clone._fields[i] = this._fields[i].clone();
            clone._fields.push(fieldClone);
            clone._fieldMap[fieldClone.name()] = fieldClone;
        }
        return clone;
    }

}

export default FieldCollection;
