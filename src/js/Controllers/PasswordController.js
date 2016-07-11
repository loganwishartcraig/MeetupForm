import { forEachNode } from '../Util/forEachNode';

// A class used to determine the validity of a password input,
// and toggle help text classes based on missing components.
// Expects a string 'passwordInput', the node selector to pull the password from,
// A string 'reqContainer' indicating the parent node selector of the help text
// html list
// An object 'validationMap', where keys are the values corresponding to the help text's 'data-requirement' attribute, and values are functions defining the validation method
// Does not need to inject data into form model, as the individual validation tests here are performed in the form model as well.


class PasswordController {

    constructor(passwordInput, reqContainer, validationMap = {}) {

      // grab input and listen for keyups
      this._passwordInput = document.querySelector(passwordInput);
      this._passwordInput.addEventListener('keyup', this.handleKeyup.bind(this));

      // pull references to help text nodes and index by requirement
      this._reqMap = {};
      forEachNode(document.querySelectorAll(`${reqContainer} li[data-requirement]`), function(node) {
        let key = node.getAttribute('data-requirement');
        this._reqMap[key] = node;
      }.bind(this));

      this._validationMap = validationMap;
    
    }

    // expects a string 'password' to be validated
    // and a string 'requirement' to indicate the corresponding requirement
    validate(password, requirement) {

      // store reference to relevant help text node
      let messageToMark = this._reqMap[requirement];

      // if no reference to node exists, warn and return
      if (messageToMark === undefined) {
        console.warn(`Password requirement message map doesn't have an <li> for ${requirement}.`);
        return;
      }

      // if no validation method is defined for the requirement, warn, reutrn and
      // mark help text node unmet.
      // otherwise, mark help text node based on validation result
      if (!this._validationMap[requirement]) {
        console.warn(`Password validation map doesn't have a test for '${requirement}'. Assuming invalid.`);
        return this.markUnmet(messageToMark);
      }
      if (this._validationMap[requirement](password)) this.markMet(messageToMark);
      else this.markUnmet(messageToMark);

    }

    // toggle a nodes state to met via classes
    markMet(node) {
      node.classList.remove('unmet');
      if (!node.classList.contains('met'))
        node.classList.add('met');
    }

    // toggle a nodes state to unmet via classes
    markUnmet(node) {
      node.classList.remove('met');
      if (!node.classList.contains('unmet'))
        node.classList.add('unmet');
    }

    // on input keyup, grab new value & validate against all requirements
    handleKeyup(evt) {

      let password = evt.target.value;
      
      Object.keys(this._reqMap).forEach((req) => {
        this.validate(password, req);
      });

    }

  }

  export { PasswordController };