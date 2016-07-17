import { fakeAJAXCall } from '../Util/fakeAJAXCall';

let defaultUser = {
            name: '',
            email: '',
            password: '',
            birthDate: '',
            country: '',
            state: '',
            sex: '',
            industry: '',
            employer: '',
            jobTitle: '',
            events: []
          };

// Used to manage and access the user object.
// Would be used to interface with the user routes.
class UserService {

    // if no user is passed at initalization,
    // query local storage for cached object
    // complete user object would not be stored in production 'i.e. no "password" field.'
    constructor(user) {
      if (user === undefined) {
        let cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile !== null) {
          this._user = JSON.parse(cachedProfile);
        } else {
          this._user = null;
        }
      }
    }


    // creates user profile, then posts to server
    createUser(profile) {
      this._user = Object.assign(defaultUser, profile);
      fakeAJAXCall(this._user).then(function(msg) {
        this.updateCache(msg);
      }.bind(this));
    }

    updateCache() {
      localStorage.setItem('userProfile', JSON.stringify(this._user));
    }

    clearUserProfile() {
      this._user = Object.assign({}, defaultUser);
      localStorage.removeItem('userProfile');
    }

    getProfile() {
      return this._user;
    }

    hasUser() {
      return this._user !== null;
    }

    // simulates POSTing an event via AJAX
    addEvent(event) {
      fakeAJAXCall(event).then(function(event) {
        console.log('success: ', event);
        this._user.events.push(event);
        this.updateCache();
      }.bind(this), function(msg) {
        console.log('fail: ', msg);
      }); 
    }
  
    // returns fake events for testing
    getEvents() {
      let e1 = {
        eventEnd: "2016-06-16",
        eventHost: "Logan Wishart-Craig",
        eventLocation: "af",
        eventName: "Forts ;D",
        eventStart: "2016-06-07",
        eventType: "w"
      };

      let e2 = {
        eventEnd: "2016-06-16",
        eventHost: "George Furlong",
        eventLocation: "af",
        eventName: "Laser tag",
        eventStart: "2016-06-07",
        eventType: "w"
      };

      let e3 = {
        eventEnd: "2016-06-16",
        eventHost: "Marcus Piewton",
        eventLocation: "af",
        eventName: "Tea and shots",
        eventStart: "2016-06-07",
        eventType: "w"
      }; 


      let fakeEvents = [e1, e2, e3];

      return fakeEvents;
    }

  } 

export { UserService };