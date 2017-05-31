import ListView from './View/ListView';
import FieldCollection from './Field/FieldCollection';

class Collection extends ListView {

    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name();
        }

        this._fieldCollection = new FieldCollection(entity.factory);

        return this;
    }
}

export default Collection;
