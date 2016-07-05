
import { UserService } from './Services/UserService';

import { FormController } from './Controllers/FormController';
import { PasswordController } from './Controllers/PasswordController';
import { GuestController } from './Controllers/GuestController';
import { stdValidators, passwordValidators } from './Validators/Validators';

import { PageView } from './Views/PageView';
import { MeetupListView } from './Views/MeetupListView';
import { ProfileView } from './Views/ProfileView';
import { GuestListView } from './Views/GuestListView';

import { fakeAJAXCall } from './Util/fakeAJAXCall';

(() => { 


  // this should be managed better
  document.addEventListener('DOMContentLoaded', () => {

    var userService = new UserService(),
        userIsCached = userService.hasUser();

    var pageView = new PageView('body');

    var regFormController = new FormController('#regForm', stdValidators),
        eventFormController = new FormController('#meetupForm', stdValidators),
        passwordController = new PasswordController('#password', '.pw-requirements', passwordValidators),
        guestController = new GuestController('.guest-input'),
        meetupListView = new MeetupListView('.meetup-list'),
        guestListView = new GuestListView('.invite-list');

    var populateProfile = (user) => {
      userService.updateUserProfile(user);
      pageView.toggleRegistration(userService.hasUser());
    };

    var addGuest = () => {
      let guest = guestController.getInput();
      guestListView.addGuest(guest);
      let valid = eventFormController.validate(guestController.getInputNode());
      if (valid) eventFormController.updateDataStore(guestController.getInputNode(), valid);

      guestController.clearInput();
      guestController.giveFocus();
    };

    var addEventItem = (event) => {
      meetupListView.addEvent(event);
      guestController.reset();
      guestListView.reset();
      eventFormController.reset();
    };

    var loadEventApp = () => {
      eventFormController.setValidator('eventGuestList', () => guestController.isEmpty());
      eventFormController.setDataPuller('eventGuestList', () => guestController.getGuests());
      guestController.setAction(addGuest);
      eventFormController.setSubmitCallback(addEventItem);
    }

    pageView.toggleRegistration(userIsCached);

    if (userIsCached) {

      userService.getEvents().forEach(addEventItem);
      loadEventApp();

    } else {
      
      regFormController.setSubmitCallback(populateProfile);
      loadEventApp();

    }

    

  });

})();
