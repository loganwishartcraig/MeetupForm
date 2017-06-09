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
        console.warn(cachedProfile);

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
      console.warn('caching', this._user);
      localStorage.setItem('userProfile', JSON.stringify(this._user));
      console.warn(localStorage.getItem('userProfile'));
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
      return (this.hasUser()) ? this._user.events : [];
    }

  } 

export { UserService };