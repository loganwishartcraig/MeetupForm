// Controller used to manage guest list view and model.
// View will notify button presses and pass a guest name. 
// Controller passes data to model & model notifies of change.
// Controller also handles resets.

class GuestListController {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  
    // ? question - should 'name' be passed in the event or grabbed in the function body?
    this._view.addBtnClicked.attach(function(name) {
      this._model.addGuest(name);
    }.bind(this));

    this._view.rmvBtnClicked.attach(function(index) {
      this._model.removeGuest(index);
    }.bind(this));
  }

  reset() {
    this._model.clear();
    this._view.clear();
  }


}

export { GuestListController };