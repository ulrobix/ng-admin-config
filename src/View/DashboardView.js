import ListView from './ListView';
import FieldCollection from '../Field/FieldCollection';

class DashboardView extends ListView {
    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name();
        }

        this._fieldCollection = new FieldCollection(entity.factory);

        return this;
    }
}

export default DashboardView;
