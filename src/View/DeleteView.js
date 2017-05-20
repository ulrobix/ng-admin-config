import View from './View';

class DeleteView extends View {
    constructor(name) {
        super(name);
        this._type = 'DeleteView';
        this._enabled = true;
    }

    onSubmitSuccess(onSubmitSuccess) {
        if (!arguments.length) return this._onSubmitSuccess;
        this._onSubmitSuccess = onSubmitSuccess;
        return this;
    }

    onSubmitError(onSubmitError) {
        if (!arguments.length) return this._onSubmitError;
        this._onSubmitError = onSubmitError;
        return this;
    }
}

export default DeleteView;
