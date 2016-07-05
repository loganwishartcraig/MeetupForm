class GuestController {
  constructor(node) {
    this.container = document.querySelector(node);
    this.guestInput = this.container.querySelector(':scope input');
    this.addBtn = this.container.querySelector(':scope button');

    this.guests = [];
  
    this.addBtn.addEventListener('click', this.updateGuestStore.bind(this));

  }


  updateGuestStore(evt) {
    this.guests.push(this.guestInput.value);
  }

  setAction(funct) {
    this.addBtn.addEventListener('click', funct);
  }

  getInput() {
    return this.guestInput.value;
  }  

  getInputNode(){
    return this.guestInput;
  }

  clearInput() {
    this.guestInput.value = '';
  }

  giveFocus() {
    this.guestInput.focus();
  }

  getGuests() {
    return this.guests;
  }

  isEmpty() {
    return this.guests.length > 0;
  }

  reset() {
    this.clearInput();
    this.guests = [];
  }
}

export { GuestController };