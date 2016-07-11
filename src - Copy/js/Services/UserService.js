class UserService {
    constructor(user) {
      if (user === undefined) {
        let cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile !== undefined) this.user = JSON.parse(cachedProfile);
      }
    }

    updateUserProfile(profile) {
      this.user = profile;
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }

    clearUserProfile() {
      this.user = undefined;
      localStorage.removeItem('userProfile');
    }

    getProfile() {
      return this.user;
    }

    hasUser() {
      return this.user !== null;
    }
  
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