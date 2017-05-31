import Entry from '../Entry';
import ReferenceExtractor from '../Utils/ReferenceExtractor';
import FieldCollection from '../Field/FieldCollection';

class View {
    constructor(name) {
        this.entity = null;
        this._actions = null;
        this._title = false;
        this._description = '';
        this._template = null;

        this._enabled = null;
        this._type = null;
        this._name = name;
        this._order = 0;
        this._errorMessage = null;
        this._url = null;
        this._prepare = null;

        this._fieldCollection = null;
    }

    get enabled() {
        return this._enabled === null ? !!this._fieldCollection.length : this._enabled;
    }

    title(title) {
        if (!arguments.length) return this._title;
        this._title = title;
        return this;
    }

    description() {
        if (arguments.length) {
            this._description = arguments[0];
            return this;
        }

        return this._description;
    }

    name(name) {
        if (!arguments.length) {
            return this._name || this.entity.name() + '_' + this._type;
        }

        this._name = name;
        return this;
    }

    disable() {
        this._enabled = false;

        return this;
    }

    enable() {
        this._enabled = true;

        return this;
    }

    /**
     * @deprecated Use getter "enabled" instead
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * @deprecated Use getter "entity" instead
     */
    getEntity() {
        return this.entity;
    }

    /**
     * @deprecated Specify entity at view creation or use "entity" setter instead
     */
    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name() + '_' + this._type;
        }

        this._fieldCollection = new FieldCollection(entity.factory);

        return this;
    }

    /*
     * Supports various syntax
     * fields([ Field1, Field2 ])
     * fields(Field1, Field2)
     * fields([Field1, {Field2, Field3}])
     * fields(Field1, {Field2, Field3})
     * fields({Field2, Field3})
     */
    fields() {
        if (!arguments.length) return this._fieldCollection.fields();

        this._fieldCollection.fields.apply(this._fieldCollection, arguments);

        return this;
    }

    hasFields() {
        return !this._fieldCollection.isEmpty();
    }

    removeFields() {
        this._fieldCollection.clear();
        return this;
    }

    getFields() {
        return this._fieldCollection.fields();
    }

    getField(fieldName) {
        return this._fieldCollection.getField(fieldName);
    }

    getFieldsOfType(type) {
        return this._fieldCollection.getFieldsOfType(type);
    }

    addField(field) {
        this._fieldCollection.addField(field);

        return this;
    }

    get type() {
        return this._type;
    }

    order(order) {
        if (!arguments.length) return this._order;
        this._order = order;
        return this;
    }

    getReferences(withRemoteComplete) {
        return ReferenceExtractor.getReferences(this._fieldCollection.fields(), withRemoteComplete);
    }

    getNonOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getNonOptimizedReferences(this._fieldCollection.fields(), withRemoteComplete);
    }

    getOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getOptimizedReferences(this._fieldCollection.fields(), withRemoteComplete);
    }

    getReferencedLists() {
        return ReferenceExtractor.getReferencedLists(this._fieldCollection.fields());
    }

    template(template) {
        if (!arguments.length) {
            return this._template;
        }

        this._template = template;

        return this;
    }

    identifier() {
        return this.entity.identifier();
    }

    actions(actions) {
        if (!arguments.length) return this._actions;
        this._actions = actions;
        return this;
    }

    getErrorMessage(response) {
        if (typeof(this._errorMessage) === 'function') {
            return this._errorMessage(response);
        }

        return this._errorMessage;
    }

    errorMessage(errorMessage) {
        if (!arguments.length) return this._errorMessage;
        this._errorMessage = errorMessage;
        return this;
    }

    url(url) {
        if (!arguments.length) return this._url;
        this._url = url;
        return this;
    }

    getUrl(identifierValue) {
        if (typeof(this._url) === 'function') {
            return this._url(identifierValue);
        }

        return this._url;
    }

    validate(entry) {
        this._fieldCollection.fields().map(function (field) {
            let validation = field.validation();

            if (typeof validation.validator === 'function') {
                validation.validator(entry.values[field.name()], entry.values);
            }
        });
    }

    /**
     * Map a JS object from the REST API Response to an Entry
     */
    mapEntry(restEntry) {
        return Entry.createFromRest(restEntry, this._fieldCollection.fields(), this.entity.name(), this.entity.identifier().name());
    }

    mapEntries(restEntries) {
        return Entry.createArrayFromRest(restEntries, this._fieldCollection.fields(), this.entity.name(), this.entity.identifier().name());
    }

    /**
     * Transform an Entry to a JS object for the REST API Request
     */
    transformEntry(entry) {
        return entry.transformToRest(this._fieldCollection.fields());
    }

    /**
     * Add a function to be executed before the view renders
     *
     * This is the ideal place to prefetch related entities and manipulate
     * the dataStore.
     *
     * The syntax depends on the framework calling the function.
     *
     * With ng-admin, the function can be an angular injectable, listing
     * required dependencies in an array. Among other, the function can receive
     * the following services:
     *  - query: the query object (an object representation of the main request
     *    query string)
     *  - datastore: where the Entries are stored. The dataStore is accessible
     *    during rendering
     *  - view: the current View object
     *  - entry: the current Entry instance (except in listView)
     *  - Entry: the Entry constructor (required to transform an object from
     *    the REST response to an Entry)
     *  - window: the window object. If you need to fetch anything other than an
     *    entry and pass it to the view layer, it's the only way.
     *
     * The function can be asynchronous, in which case it should return
     * a Promise.
     *
     * @example
     *
     *     post.listView().prepare(['datastore', 'view', 'Entry', function(datastore, view, Entry) {
     *       const posts = datastore.getEntries(view.getEntity().uniqueId);
     *       const authorIds = posts.map(post => post.values.authorId).join(',');
     *       return fetch('http://myapi.com/authors?id[]=' + authorIds)
     *          .then(response => response.json())
     *          .then(authors => Entry.createArrayFromRest(
     *              authors,
     *              [new Field('first_name'), new Field('last_name')],
     *              'author'
     *          ))
     *          .then(authorEntries => datastore.setEntries('authors', authorEntries));
     *     }]);
     */
    prepare(prepare) {
        if (!arguments.length) return this._prepare;
        this._prepare = prepare;
        return this;
    }

    doPrepare() {
        return this._prepare.apply(this, arguments);
    }
}

export default View;
