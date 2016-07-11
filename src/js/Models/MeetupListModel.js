
import { Event } from '../Util/Event';

// Model used to store and add meetup events
// Can be passed 'store', an array of predefined meetup objects.


class MeetupListModel {
  constructor(store = []) {
    this._store = store;
    this.eventAdded = new Event(this);

  }

  // would POST data to server using user service
  addEvent(event) {

    this._store.push(event);
    this.eventAdded.notify(event);

    // fakeAJAXCall(event).then(function(event) {
    //   this.eventAdded.notify(event);
    // }.bind(this));

  }

  getEvents() {
    return this._store;
  }

}

export { MeetupListModel };