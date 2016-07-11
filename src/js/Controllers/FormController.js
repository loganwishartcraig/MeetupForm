// Controller for forms will notify the model of any 
// updates to the view.
// View will emmit input changes, controller passes data
// to model & the model validates and stores. Model notifies if the data
// is valid, and view will update 'valid'/'invalid' input node attribute accordingly
// Controller also handles resets.

class FormController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    // Grab 'required' inputs from the view and set in the model
    // for validation purposes 
    // For some reason, I want the 'required' flag to stay in the markup and not have to be pre-defined in the model? Should it be the other way around?
    this._model.setRequired(this._view.getRequired());

    // when inputs are changd, set the item in the model and
    // revalidate the form
    this._view.inputChanged.attach(function(inputData) {
      this.setItem(inputData.name, inputData.value, inputData.validationType);
      this.checkFormValidity();
    }.bind(this));

    // when form is submitted, check if its valid, submit and reset if so.
    this._view.formSubmitted.attach(function() {
      if (this._model.isValid()) {
        this.submitForm();
        this.reset();
      } else {
        console.log('tried to submit, but form was invalid');
      }
    }.bind(this));

  }

  // sets item in model.
  // expects string "name" as key in model,
  // value as value to store
  // vtype as string indicating validation key in validation map
  // triggers models change & item valididty events
  setItem(name, value, vtype) {
    this._model.setItem(name, value, vtype);
  }

  // validate current form model.
  // triggers models form validity event
  checkFormValidity() {
    this._model.validate();
  }

  // triggers models submitted event
  submitForm() {
    this._model.submit();
  }

  // clear model and view, reset required inputs
  reset() {
    this._view.clear();
    this._model.clear();
    this._model.setRequired(this._view.getRequired());
  }

}

export { FormController };