import { Event } from '../Util/Event';

// Model used to store the guest list when creating an event.
// Data will be passed to the event form.
// Notifies listeners of model events. 
// Can be passed 'guestList', an array of strings as a predefined guest list
class GuestListModel {
  constructor (guestList = []) {
    this._guestList = guestList;

    // create events
    this.guestAdded = new Event(this);
    this.guestRemoved = new Event(this);
    this.guestListChanged = new Event(this);
  }

  // add string 'name' to store, notify.
  addGuest(name) {
    if (name === '') return;
    this._guestList.push(name);
    this.guestAdded.notify(name);
    this.guestListChanged.notify(this._guestList);
  }

  // remove based on int 'index', notify.
  removeGuest(index) {
    if ((index < 0) || (index > this._guestList.length)) throw new Error(`Trying to remove index ${index} of guestList length ${this._guestList.length}.`);
    this._guestList.splice(index, 1);
    this.guestRemoved.notify(index);
    this.guestListChanged.notify(this._guestList);
  }

  // validation function. Used by form model via 'setCustomValidator'.
  isValid() {
    return this._guestList.length > 0;
  }

  // reset model
  clear() {
    this._guestList = [];
    this.guestListChanged.notify(this._guestList);
  }

}

export { GuestListModel };