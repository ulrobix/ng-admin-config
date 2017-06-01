import Field from "ng-admin-config/src/Field/Field";

class SectionField extends Field {
    constructor(name) {
        super(name);
        this._type = "section";
    }
}

export default SectionField;