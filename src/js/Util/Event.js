// simple Event class (not to be confused to events in reference to meetup events)

// allows a 'sender' to notify 'listeners'. 
// On notification, all listening functions are executed, and arguments
// are passed into the callback
class Event {
  constructor(sender) {
    this._sender = sender;
    this._listeners = [];
  }

  attach(listener) {
    this._listeners.push(listener);
  }

  notify(args) {
    this._listeners.forEach((listener) => listener(args, this._sender));
  }
}

export { Event };