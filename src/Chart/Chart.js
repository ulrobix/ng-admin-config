import ListView from '../View/ListView';
import FieldCollection from '../Field/FieldCollection';

class Chart extends ListView {

    constructor(chartType) {
        super();

        this._title = false;
        this._description = '';
        this._chartType = chartType;
        this._labelField = null;
        this._labelOrder = null;
        this._datasetField = null;
        this._datasetOrder = null;
        this._valueField = null;
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

    datasetField(datasetField) {
        if (!arguments.length) {
            return this._datasetField;
        }

        this._datasetField = datasetField;
        return this;
    }

    valueField(valueField) {
        if (!arguments.length) {
            return this._valueField;
        }

        this._valueField = valueField;
        return this;
    }

    backgroundColor(backgroundColor) {
        if (!arguments.length) {
            return this._backgroundColor;
        }

        this._backgroundColor = backgroundColor;
        return this;
    }

    borderColor(borderColor) {
        if (!arguments.length) {
            return this._borderColor;
        }

        this._borderColor = borderColor;
        return this;
    }

    borderWidth(borderWidth) {
        if (!arguments.length) {
            return this._borderWidth;
        }

        this._borderWidth = borderWidth;
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
