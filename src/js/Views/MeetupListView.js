

// Used to display, and add meetup events.
// Will also toggle the default 'no events' item.
// Updated by listening for model changes.
// Root should have an item with class 'default' as child/grandchild to toggle
// and a ul to output items to.
// removal of meetup items intentionally left out to limit scope of project.

class MeetupListView {
  constructor(model, root) {

    this._model = model;

    // pull nodes
    this._container = document.querySelector(root);
    this._output = this._container.querySelector(':scope ul');
    this._defaultItem = this._container.querySelector(':scope .default');

    // used to avoid counting <li>'s
    this._active = 0;

    // add event to view when added to model
    this._model.eventAdded.attach(function(event) {
      this.addEvent(event);
    }.bind(this));

    // used to populate any existing model items
    // ? question - does this belong here? would it be better in a controller?
    this._model.getEvents().forEach(function(event) {
      this.addEvent(event);
    }.bind(this));

  }

  // toggles visability on the default item
  toggleDefault() {
    if (this._active > 0) {
      if (this._defaultItem.classList.contains('hide')) return;
      this._defaultItem.classList.add('hide');
    } else {
      if (!this._defaultItem.classList.contains('hide')) return;
      this._defaultItem.classList.remove('hide');
    }
  }

  // build the html
  buildEventNode(event) {
    let node = document.createElement('li');
        node.classList.add('event-item');

    // needed for the way dates are stored in the model
    let date = event.eventStart.split('T')[0];
    
    node.innerHTML = `${date} - <b>${event.eventName}</b><br><i>Hosted By ${event.eventHost}</i>`;

    return node; 
  }

  // inc. counter, toggle default item, prepend item
  addEvent(event) {
    this._active++;
    this.toggleDefault();
    this._output.insertBefore(this.buildEventNode(event), this._output.firstChild);
  }
}

export { MeetupListView };