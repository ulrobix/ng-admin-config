class Dashboard {
    constructor(name) {
        this._name = name;
        this._widgets = {};
        this._template = null;
        this._prepare = null;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    addCollection(collection) {
        return this.addWidget(collection);
    }

    collections(collections) {
        if (arguments.length) {
//            this._collections = collections;
            return this;
        }
        return this.widgets;
    }

    addWidget(widget) {
        this._widgets[widget.name()] = widget;
        return this;
    }

    get widgets() {
        return this._widgets;
    }

    hasCollections() {
        return Object.keys(this._widgets).length > 0;
    }

    hasWidgets() {
        return Object.keys(this._widgets).length > 0;
    }

    template(template) {
        if (arguments.length) {
            this._template = template;
            return this;
        }
        return this._template;        
    }

    prepare(prepare) {
        if (!arguments.length) return this._prepare;
        this._prepare = prepare;
        return this;
    }

    doPrepare() {
        return this._prepare.apply(this, arguments);
    }

}

export default Dashboard;
