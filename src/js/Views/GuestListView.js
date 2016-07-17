import { Event } from '../Util/Event';

// Guest list view handles displaying, adding, and removing
// guest list items in the 'event' form.
// Will notify listeners of button clicks & pass input information 
// root node should have as children/grandchildren an input to pull names from,
// a ul to output names to, and a button[type=button] to trigger event

class GuestListView {
  constructor(model, root) {
    this._model = model;

    // grab nodes
    this._container = document.querySelector(root);
    this._output = this._container.querySelector(':scope ul');
    this._input = this._container.querySelector(':scope input');
    this._addBtn = this._container.querySelector(':scope button[type=button]');

    // create events
    this.addBtnClicked = new Event(this);
    this.rmvBtnClicked = new Event(this);

    // used bubbling for 'remove' buttons
    this._output.addEventListener('click', this.handleRemove.bind(this));

    this._addBtn.addEventListener('click', this.handleAdd.bind(this));
    this._input.addEventListener('keypress', this.handleKeypress.bind(this));

    // used so form view doesn't validate & store the text input;
    this._input.addEventListener('change', function(evt) {
      evt.stopPropagation();
    })

    // when model notifys guest was added, add to view
    this._model.guestAdded.attach(function(name) {
      this.addGuest(name);
    }.bind(this));

    // when model notifys guest was removed, remove from view
    this._model.guestRemoved.attach(function(index) {
      this.removeGuest(index);
    }.bind(this));


  }

  // when add button clicked, notify & pass input value
  // then reset input
  handleAdd(evt) {
    this.addBtnClicked.notify(this._input.value);
    this._input.value = '';
  }

  // when 'enter' is hit on input, handle add.
  handleKeypress(evt) {
    evt.stopPropagation();
    if (evt.charCode === 13) {
      evt.preventDefault();
      this.handleAdd(evt);
    }
  }

  // when remove output container clicked, check if
  // srouce was a button, if so, get index to remove & notify listeners.
  // expects butons parent element is the one to remove
  handleRemove(evt) {
    if (evt.target.tagName === 'BUTTON') {
        let li = evt.target.parentElement;
        let i = 0;
        for (i; (li = li.previousSibling); i++);
        this.rmvBtnClicked.notify(i);
      }
  }

  // could be better managed, but creates a guest node
  // <li>{{name}}<button class="guest-remove">X</button></li>
  // ? quesiton - clone a hidden node? use literal templates + .replace or ``?
  buildGuestNode(name) {

    let toAdd = document.createElement('li');
        toAdd.innerText = name;

    let button = document.createElement('button');
        button.innerText = 'X';
        button.classList.add('guest-remove');
        button.setAttribute('type', 'button');

    toAdd.appendChild(button);

    return toAdd;
  }


  // expects a string 'name'
  // will build a node & prepend it to the output
  addGuest(name) {
    let node = this.buildGuestNode(name);
    this._output.insertBefore(node, this._output.firstChild);
  }

  // expects an int 'index'
  // will remove the li at that index
  removeGuest(index) {
    this._output.children[index].remove();
  }

  // clear output and input.
  clear() {
    this._output.innerHTML = '';
    this._input.value = '';
  }
}

export { GuestListView };