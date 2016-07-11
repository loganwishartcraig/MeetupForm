import { fakeAJAXCall } from '../Util/fakeAJAXCall';

// Used to manage and access the user object.
// Would be used to interface with the user routes.
class UserService {

    // if no user is passed at initalization,
    // query local storage for cached object
    constructor(user) {
      if (user === undefined) {
        let cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile !== undefined) this._user = JSON.parse(cachedProfile);
      }
    }

    updateUserProfile(profile) {
      this._user = profile;
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }

    clearUserProfile() {
      this._user = undefined;
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
      fakeAJAXCall(event).then(function(msg) {
        console.log('success: ', msg);
      }, function() {
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