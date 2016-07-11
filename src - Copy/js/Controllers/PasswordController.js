class PasswordController {

    constructor(passwordInput, reqContainer, validationMap = {}) {

      this.passwordInput = document.querySelector(passwordInput);
      this.passwordInput.addEventListener('keyup', this.handleKeyup.bind(this));

      this.reqs = document.querySelectorAll(`${reqContainer} li[data-requirement]`);
      this.reqMap = this.buildRequirementMap(this.reqs);

      this.validationMap = validationMap;
    
    }

    buildRequirementMap(nodeList) {

      let map = {};

      for (let i = 0; i < nodeList.length; i++) {
        let key = nodeList[i].getAttribute('data-requirement');
        map[key] = nodeList[i];
      }

      return map;
    
    }

    validate(password, requirement) {

      let messageToMark = this.reqMap[requirement];

      if (messageToMark === undefined) {
        console.warn(`Password requirement message map doesn't have an <li> for ${requirement}.`);
        return;
      }

      if (!this.validationMap[requirement]) {
        console.warn(`Password validation map doesn't have a test for '${requirement}'`);
        return this.markMet(messageToMark);
      }
      if (this.validationMap[requirement](password)) this.markMet(messageToMark);
      else this.markUnmet(messageToMark);

    }

    markMet(node) {
      node.classList.remove('unmet');
      if (!node.classList.contains('met'))
        node.classList.add('met');
    }

    markUnmet(node) {
      node.classList.remove('met');
      if (!node.classList.contains('unmet'))
        node.classList.add('unmet');
    }

    handleKeyup(evt) {

      let password = evt.target.value;
      
      Object.keys(this.reqMap).forEach((req) => {
        this.validate(password, req);
      });

    }

  }

  export { PasswordController };