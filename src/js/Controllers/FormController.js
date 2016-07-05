import { fakeAJAXCall } from '../Util/fakeAJAXCall';


class FormController {

    constructor(root, validationMap = {}, dataPullers = {}) {

      this.form = document.querySelector(root);

      this.form.addEventListener('submit', this.handleSubmit.bind(this));
      this.form.addEventListener('change', this.handleChange.bind(this));
      this.form.addEventListener('keyup', this.handleChange.bind(this));

      this.inputs = this.form.querySelectorAll(':scope input, :scope select, :scope textarea');
      this.required = this.form.querySelectorAll(':scope input:required, :scope select:required, :scope textarea:required');
      this.submit = this.form.querySelector(':scope button[type=submit]');

      this.valid = false;
      this.validationMap = validationMap;

      this.dataStore = {};
      this.dataPullers = dataPullers;

    }

    handleSubmit(evt) {
      evt.preventDefault();
      if (this.validateForm()) {
        console.log('would be submitting data...', this.dataStore);



        fakeAJAXCall(this.dataStore).then(function(user) {
          if (this.submitCallback !== undefined) this.submitCallback(user);
        }.bind(this), () => {
          console.log('Error transmitting data');
        });
      } else {
        console.log("form isn't valid yet.");
      }
    }


    setSubmitCallback(funct) {
      this.submitCallback = funct;
    }

    getData() {
      return this.dataStore;
    }


    // called twice on keypress events...
    handleChange(evt) {

      if ((evt.target.tagName === 'INPUT') || (evt.target.tagName === 'SELECT')) {
        let validity = this.validate(evt.target);
        this.updateDataStore(evt.target, validity);
        this.checkFormValidity();
      }

    }



    checkFormValidity() {


      // this should be better managed
      let validRequired = this.form.querySelectorAll(':scope input:required[valid], :scope select:required[valid], :scope textarea:required[valid]').length;

      let valid = validRequired === this.required.length;


      return this.toggleValiditiy(this.submit, valid);
    }

    isValid() {
      return this.valid;
    }

    toggleValiditiy(node, valid) {
      if (valid) {
        this.enable(node);
      } else {
        this.disable(node);
      }
    }

    enable(node) {

      this.valid = true;

      if (this.form.classList.contains('invalid')) {
        this.form.classList.remove('invalid');
        this.form.classList.add('valid');
      }

      if (node.hasAttribute('disabled'))
        node.removeAttribute('disabled');
    }

    disable(node) {

      this.valid = false;

      if (this.form.classList.contains('valid')) {
        this.form.classList.remove('valid');
        this.form.classList.add('invalid');
      }


      if (!node.hasAttribute('disabled'))
        node.setAttribute('disabled', 'disabled');
    }

    validate(input) {
      let validity = this.validateInput(input);
      this.markValidity(input, validity);
      return validity;
    }

    validateInput(input) {

      if (!input.hasAttribute('data-validation')) return true;
      
      let validationType = input.getAttribute('data-validation');
      let value = input.value;

      if (this.validationMap[validationType] === undefined) {
        console.warn(`Validation map doesn't have validator for '${validationType}'.`);
        return true;
      }

      return this.validationMap[validationType](value);
    }

    markValidity(node, valid) {
      let attrToRemove = (valid) ? 'invalid' : 'valid';
      let attrToAdd = (valid) ? 'valid' : 'invalid';
      node.removeAttribute(attrToRemove);
      node.setAttribute(attrToAdd, attrToAdd);

    }

    updateDataStore(input, valid) {

      let key = input.getAttribute('name');
      let data = (this.dataPullers[key] === undefined) ? input.value : this.dataPullers[key]();

      console.log(data, key)

      if (valid) {
        this.dataStore[key] = data;
      } else {
        if (this.dataStore[key] !== undefined) delete this.dataStore[key];
      }
    }

    validateForm() {

      let formValidity = true;

      for (let i = 0; i < this.inputs.length; i++) {
        let input = this.inputs[i];
        if ((input.hasAttribute('required')) || (input.value.length > 0)) {
          let inputValidity = this.validate(input);
          formValidity = (formValidity === false) ? false : inputValidity;          
        }
      }

      return formValidity;
    }

    setValidator(type, validator) {
      if (this.validationMap[type] !== undefined) console.warn(`A validation method for ${type} already exists. Overwriting...`);

      this.validationMap[type] = validator;
    }

    setDataPuller(name, funct) {
      if (this.dataPullers[name] !== undefined) console.warn(`A data pull method for ${name} already exists. Overwriting...`);
      this.dataPullers[name] = funct;
    }

    reset() {

      for (let i = 0; i < this.inputs.length; i++) {
        let input = this.inputs[i];
        input.removeAttribute('valid');
        input.removeAttribute('invalid');
        input.value = '';
      }
      this.dataStore = {};
      this.valid = false;
    }

  }

  export { FormController };