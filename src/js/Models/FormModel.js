import { Event } from '../Util/Event';
import { fakeAJAXCall } from '../Util/fakeAJAXCall';

// The model used for forms. Will store form data, and notify
// listeners of various events. Expects an object 'validationMap',
// where keys are values defined in the form input 'data-validation' attributes
// and values are corresponding validation methods.
// Optional object 'store' defines pre-existing model key value pairs 
// Optional object 'required' defines a known required input map, where
// keys are form input names and values are keys to 'validationMap'

class FormModel {

  constructor(validationMap = {}, store = {}, required = {}) {
    this._store = store;
    this._valid = false;
    this._required = required;

    this._validationMap = validationMap;

    // create all events
    // ? question - should invalid & valid events be combined?
    // this.itemSet = new Event(this);
    this.itemValid = new Event(this);
    this.itemInvalid = new Event(this);
    // this.itemRemoved = new Event(this);
    this.formValid = new Event(this);
    this.formInvalid = new Event(this);
    this.formSubmitted = new Event(this);

  }

  getData() {
    return this._store;
  }

  getItem(item) {
    return this._store[item];
  }


  // set's an item & will emmit corresponding validation event
  // expects string 'key', the key to store for
  // 'value', the value to store
  // and string 'validationType', corresponding to the key for the validation function in '_validationMap'.
  // ? quesiton - better to assume true so attribute 'data-validation' isn't required in all cases?
  setItem(key, value, validationType) {

    // if no validation map for validation type, notify item invalid,
    // otherwise, validate.
    if (this._validationMap[validationType] === undefined) {

      console.warn(`No validator for type ${validationType}. Assuming invalidity.`);
      this.itemInvalid.notify(key);
    
    } else {
      
      // if valid, notify so & store.
      // otherwise notify invalid
      if (this._validationMap[validationType](value)) {
        this.itemValid.notify(key);
        this._store[key] = value;
      } else {
        this.itemInvalid.notify(key);
      }
    
    }
    console.log(this._store);
    // this.itemSet.notify(this._store);
  }

  removeItem(key) {

    // if key exists, remove it
    if (this._store[key] !== undefined) {

      // 'delete' vs ' = undefined'?
      delete this._store[key];

    }
    
  }

  // Validates all required inputs and toggle
  // model's valid state accordingly
  validate() {

    // pull requirements to loop through
    let requiredNames = Object.keys(this._required);

    // go through each requirement
    // for loop used to terminate function on first invalidity.
    for (let i = 0; i < requiredNames.length; i++) {
     
      // get info
      let name = requiredNames[i],
          test = this._validationMap[this._required[name]],
          value = this._store[name];

      // if any invalid conditions are met, set state & notify invalidity, return
      if ((value === undefined) || (test === undefined) || (test(value) === false)) {
        this._valid = false;
        this.formInvalid.notify();
        return;
      }
    }

    // if not returned by for loop, form is valid.
    this._valid = true;
    this.formValid.notify();

  }

  isValid() {
    return this._valid;
  }


  // function used to set required inputs. Expects a 'required' object with keys
  // as input names, and values as strings correlating to a key in '_validationMap'.
  // Avoided direct validation functions for memory?
  setRequired(required) {
    this._required = required;
  }

  // submit form if valid. Would POST to server here, probably through
  // 'user' or 'event' services.
  // notify form was submitted
  submit() {
    if (this.isValid()) {
      console.log('submitting: ', this._store);
      fakeAJAXCall(this._store).then(function(msg) {
        this.formSubmitted.notify(msg);
      }.bind(this));
    }
  }

  // used to set key value pairs in '_validationMap'.
  // Expects a string 'type', indicating the validation type (correlates to 'data-validation')
  // and function 'validator' that should expect one argument (string being validated), and return true or false.
  setCustomValidator(type, validator) {
    if (this._validationMap[type] !== undefined) console.warn(`Validator already exists for type ${type}. Overwriting...`);
    this._validationMap[type] = validator;
  }


  // reset form model
  clear() {
    this._store = {};
    this._required = {};
    this._valid = false;
  }

}

export { FormModel };
