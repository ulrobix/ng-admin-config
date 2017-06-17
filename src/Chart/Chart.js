import ListView from '../View/ListView';
import FieldCollection from '../Field/FieldCollection';

class Chart extends ListView {

    constructor(chartType) {
        super();

        this._title = false;
        this._description = '';
        this._chartType = chartType;
        this._labelField = null;
        this._dataField = null;
        this._options = null;
        this._fieldCollection = null;
    }

    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name();
        }

        this._fieldCollection = new FieldCollection(entity.factory);

        return this;
    }

    get chartType() {
        return this._chartType;
    }

    labelField(labelField) {
        if (!arguments.length) {
            return this._labelField;
        }

        this._labelField = labelField;
        return this;
    }

    dataField(dataField) {
        if (!arguments.length) {
            return this._dataField;
        }

        this._dataField = dataField;
        return this;
    }

    options(options) {
        if (!arguments.length) {
            return this._options;
        }

        this._options = options;
        return this;
    }
}

export default Chart;
