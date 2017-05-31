import ReferenceField from "./ReferenceField";
import ReferenceExtractor from '../Utils/ReferenceExtractor';

class ReferencedListField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'referenced_list';
        this._targetReferenceField = null;
        this._targetFields = [];
        this._detailLink = false;
        this._listActions = [];
        this._entryCssClasses = null;
    }

    targetReferenceField(value) {
        if (!arguments.length) return this._targetReferenceField;
        this._targetReferenceField = value;
        return this;
    }

    targetFields(value) {
        if (!arguments.length) return this._targetFields;
        this._targetFields = value;

        return this;
    }

    getGridColumns() {
        let columns = [];
        for (let i = 0, l = this._targetFields.length ; i < l ; i++) {
            let field = this._targetFields[i];
            columns.push({
                field: field,
                label: field.label()
            });
        }

        return columns;
    }

    getSortFieldName() {
        if (!this.sortField()) {
            return null;
        }

        return this._targetEntity.name() + '_ListView.' + this.sortField();
    }

    actions(actions) {
        if (!arguments.length) {
            return this._actions;
        }

        this._actions = actions;

        return this;
    }

    listActions(actions) {
        if (!arguments.length) {
            return this._listActions;
        }

        this._listActions = actions;

        return this;
    }

    entryCssClasses(classes) {
        if (!arguments.length) {
            return this._entryCssClasses;
        }

        this._entryCssClasses = classes;

        return this;
    }

    getReferences(withRemoteComplete) {
        return ReferenceExtractor.getReferences(this._targetFields, withRemoteComplete);
    }

    getNonOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getNonOptimizedReferences(this._targetFields, withRemoteComplete);
    }

    getOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getOptimizedReferences(this._targetFields, withRemoteComplete);
    }

/*
    clone() {
        var clone = objectProperties.clone(this);
        clone._maps = this._maps.slice();
        clone._transforms = this._transforms.slice();
        clone._attributes = objectProperties.clone(this._attributes);
        clone._validation = objectProperties.clone(this._validation);
        return clone;
    }
*/
}

export default ReferencedListField;
