
// page view is used to toggle registration state.
// css displays relevant form based on the classes this alters
import { PageView } from './Views/PageView';

// user service is used to interface with the user object.
// pulls, stores, and updates user data
import { UserService } from './Services/UserService';

// Controller, view, and model for forms. 
// Model holds the data and performs validation. Notifies on changes
// View displays data and validation status. Upates on changes
// Controller handles input keypresses and form changes. Passes data to model on changes
// ? question - should the controller be responsible for passing data to view?
import { FormModel } from './Models/FormModel';
import { FormView } from './Views/FormView';
import { FormController } from './Controllers/FormController';

// Sub-component of the 'event' form. Similar data flow to the form mvc.
// Model stores guestlist and validation. The data is injected into the 'event' form.
// ? question - should this be integrated into an extended 'form' class? 
import { GuestListModel } from './Models/GuestListModel';
import { GuestListView } from './Views/GuestListView';
import { GuestListController } from './Controllers/GuestListController';

// Meetup model and view. No controller, as there is no updating the model (currently).
// Model will hold the events, and view Will display them.
// updated by a 'formSubmitted' event callback on the event form.
import { MeetupListModel } from './Models/MeetupListModel';
import { MeetupListView } from './Views/MeetupListView';

// Module for providing broken down password validation.
// Parses html pw for requirements, holds the appropriate validators,
// toggles classes based on validation status
// ? question - seems like too much responsibility, how to better manage?
import { PasswordController } from './Controllers/PasswordController';

// validation maps containing functions for various input types.
import { stdValidators, passwordValidators, dateValidator } from './Validators/Validators';

document.addEventListener('DOMContentLoaded', () => {

  // initiate page view and bind to body.  
  var pageView = new PageView('body');

  // initiate user service and determine if user already exists
  var userService = new UserService(),
      userIsCached = userService.hasUser();

      // toggle form visibility based on user existing 
      pageView.toggleRegistration(userIsCached);

  // ? question - would this be better handled with routes and server side auth?
  if (!userIsCached) {

    // instantiate the registration form
    var regFormModel = new FormModel(stdValidators),
        regFormView = new FormView(regFormModel, '#regForm'),
        regFormController = new FormController(regFormModel, regFormView);

    // instantiate the password helper & bind to input/output nodes
    var passwordController = new PasswordController('#password', '.pw-requirements', passwordValidators);

        // on successful form submission, update the user service profile
        // and re-check what form to display
        // ? question - handled better by the controller? Where should ajax calls be made to the server?
        regFormModel.formSubmitted.attach((user) => {
          console.log('submitted user data!', user);
          userService.updateUserProfile(user);
          pageView.toggleRegistration(userService.hasUser());
        });

  }

  // instantiate the meetup form
  var meetupFormModel = new FormModel(stdValidators),
      meetupFormView = new FormView(meetupFormModel, '#meetupForm'),
      meetupFormController = new FormController(meetupFormModel, meetupFormView);

  // instantiate the guest list component
  var guestListModel = new GuestListModel(),
      guestListView = new GuestListView(guestListModel, '.event-invites'),
      guestListController = new GuestListController(guestListModel, guestListView);

      // inject the 'eventGuestList' validation function.
      // needed as validation for 'guestlist' requires querying it's model
      meetupFormModel.setCustomValidator('eventGuestList', guestListModel.isValid.bind(guestListModel));

      // custom date compare function to validate events end date
      // pulled from view to allow for comparing partial (invalid) dates
      meetupFormModel.setCustomValidator('eventEnd', function() {
        let start = meetupFormView.getInput('eventStart'),
            end = meetupFormView.getInput('eventEnd');
        return dateValidator.lessThan(start, end);
      });

      // on guestlist change, update the meetup form model and revalidate
      guestListModel.guestListChanged.attach(function(guests) {
        meetupFormModel.setItem('eventGuestList', guests, 'eventGuestList');
        meetupFormController.checkFormValidity();
      });


  // instantiate the meetup list component. Load any pre-existing meetups
  // to the meetup model
  var meetupListModel = new MeetupListModel(userService.getEvents()),
      meetupListView = new MeetupListView(meetupListModel, '.meetup-list');

      // on event form submission, add meetup item & reset form
      meetupFormModel.formSubmitted.attach((event) => {
        console.log('submitted event data!', event);
        meetupListModel.addEvent(event);
        userService.addEvent(event);
        // ? question - should this be one reset?
        guestListController.reset();
        meetupFormController.reset();
      });


});


// ? question - should the user be stored here? In the controller? 
// nowhere & just handled in an event callback in 'entry.js'?
// should user service listen for 'eventAdded'?