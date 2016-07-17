import { Event } from "../Util/Event";
import { forEachNode } from "../Util/forEachNode";

// class used to bind to forms.
// pulls validation types & requirements, caches node references,
// toggles 'valid'/'invalid' state on input & form,
// notifies of input changes
// 'root' node should have inputs and a button[type=submit] as children/grandchildren

class FormView {

  constructor(model, root) {

    this._model = model;

    this._form = document.querySelector(root);

    // key as input name, value as node reference
    this._inputs = {};

    //  key as input name, value as validation type
    this._required = {};

    // build '_inputs' & '_required'
    // loop through each input node, push all to '_inputs',
    // if 'data-required=required' attribute or 'required' attribute exist,
    // push name & 'data-validation' value to '_required'
    // 'data-validation' used when browser validation is not useful,
    // but value still needs to be present (guestList).
    forEachNode(this._form.querySelectorAll(':scope input, :scope select, :scope textarea'), function(node) {

      let name = node.getAttribute('name');
      
      this._inputs[name] = node;
      
      if ((node.hasAttribute('required')) || (node.getAttribute('data-required') === 'required')) {
        this._required[name] = node.getAttribute('data-validation');
      }
    
    }.bind(this));

    // cache submit button
    this._submitBtn = this._form.querySelector(':scope button[type=submit]');

    // create events
    this.inputChanged = new Event(this);
    this.formChanged = new Event(this);
    this.formSubmitted = new Event(this);

    // bind browser events
    this._form.addEventListener('keyup', this.handleChange.bind(this));
    this._form.addEventListener('change', this.handleChange.bind(this));
    this._form.addEventListener('submit', this.handleSubmit.bind(this));

    // bind model listeners
    // ? question - should valid/invalid functions be combined into 'toggleValidity(node, validity)'?

    this._model.itemValid.attach(function(key) {
      this.markValid(this._inputs[key]);
    }.bind(this));

    this._model.itemInvalid.attach(function(key) {
      this.markInvalid(this._inputs[key]);
    }.bind(this));

    this._model.formValid.attach(function() {
      this.markFormValid();
    }.bind(this));

    this._model.formInvalid.attach(function() {
      this.markFormInvalid(this._form);
    }.bind(this));

  }


  // called on 'keypress' & 'change'. If target is input, pull data from 
  // node, notify listeners of an input change, passing input data.
  handleChange(evt) {

    if ((evt.target.tagName === 'INPUT') || (evt.target.tagName === 'SELECT') || (evt.target.tagName === 'TEXTAREA')) {


      // used because form model would update on 'event guest list' input change
      // and pass the value in the input as the 'eventGuestList' value instead of using
      // the array that's managed by the 'GuestList' components.
      // The fact this is here I believe indicates I've done something incorrect.
      if (evt.target.hasAttribute('data-ignore')) return;

      let inputData = {
        name: evt.target.getAttribute('name'),
        value: evt.target.value,
        validationType: evt.target.getAttribute('data-validation')
      };

      this.inputChanged.notify(inputData);
    }
  }


  getInput(name) {
    return this._inputs[name].value;
  }

  // supress browser form submission so model can properly validate & post.
  handleSubmit(evt) {
    evt.preventDefault();
    this.formSubmitted.notify();
  }

  markValid(node) {
    node.removeAttribute('invalid');
    node.setAttribute('valid', null);
  }

  markInvalid(node) {
    node.removeAttribute('valid');
    node.setAttribute('invalid', null);
  }

  markFormValid() {
    this._form.classList.remove('invalid');
    this._form.classList.add('valid');
    this._submitBtn.removeAttribute('disabled');
  }

  markFormInvalid() {
    this._form.classList.remove('valid');
    this._form.classList.add('invalid');
    this._submitBtn.setAttribute('disabled', null);
  }
 
  // used by controller to pass required inputs & their validation names
  // to the model.
  getRequired() {
    return this._required;
  }

  // clear the view. loop through each input, remove validity state,
  // and reset value
  clear() {
    Object.keys(this._inputs).forEach(function(key) {
      
      let input = this._inputs[key];

      input.value = '';
      input.removeAttribute('invalid');
      input.removeAttribute('valid');

    }.bind(this));
  }

}

export { FormView };
