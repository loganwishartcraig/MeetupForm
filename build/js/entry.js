/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(9);
	__webpack_require__(12);
	__webpack_require__(15);
	__webpack_require__(5);
	__webpack_require__(10);
	__webpack_require__(13);
	__webpack_require__(3);
	__webpack_require__(6);
	__webpack_require__(4);
	__webpack_require__(8);
	__webpack_require__(16);
	__webpack_require__(7);
	__webpack_require__(11);
	__webpack_require__(14);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _PageView = __webpack_require__(2);

	var _UserService = __webpack_require__(3);

	var _FormModel = __webpack_require__(5);

	var _FormView = __webpack_require__(7);

	var _FormController = __webpack_require__(9);

	var _GuestListModel = __webpack_require__(10);

	var _GuestListView = __webpack_require__(11);

	var _GuestListController = __webpack_require__(12);

	var _MeetupListModel = __webpack_require__(13);

	var _MeetupListView = __webpack_require__(14);

	var _PasswordController = __webpack_require__(15);

	var _Validators = __webpack_require__(16);

	// Module for providing broken down password validation.
	// Parses html pw for requirements, holds the appropriate validators,
	// toggles classes based on validation status
	// ? question - seems like too much responsibility, how to better manage?


	// Meetup model and view. No controller, as there is no updating the model (currently).
	// Model will hold the events, and view Will display them.
	// updated by a 'formSubmitted' event callback on the event form.


	// Controller, view, and model for forms.
	// Model holds the data and performs validation. Notifies on changes
	// View displays data and validation status. Upates on changes
	// Controller handles input keypresses and form changes. Passes data to model on changes
	// ? question - should the controller be responsible for passing data to view?

	// page view is used to toggle registration state.
	// css displays relevant form based on the classes this alters


	document.addEventListener('DOMContentLoaded', function () {

	  // initiate page view and bind to body. 
	  var pageView = new _PageView.PageView('body');

	  // initiate user service and determine if user already exists
	  var userService = new _UserService.UserService(),
	      userIsCached = userService.hasUser();

	  // toggle form visibility based on user existing
	  pageView.toggleRegistration(userIsCached);

	  // ? question - would this be better handled with routes and server side auth?
	  if (!userIsCached) {

	    // instantiate the registration form
	    var regFormModel = new _FormModel.FormModel(_Validators.stdValidators),
	        regFormView = new _FormView.FormView(regFormModel, '#regForm'),
	        regFormController = new _FormController.FormController(regFormModel, regFormView);

	    // instantiate the password helper & bind to input/output nodes
	    var passwordController = new _PasswordController.PasswordController('#password', '.pw-requirements', _Validators.passwordValidators);

	    // on successful form submission, update the user service profile
	    // and re-check what form to display
	    // ? question - handled better by the controller? Where should ajax calls be made to the server?
	    regFormModel.formSubmitted.attach(function (user) {
	      console.log('submitted user data!', user);
	      userService.createUser(user);
	      pageView.toggleRegistration(userService.hasUser());
	    });
	  }

	  // instantiate the meetup form
	  var meetupFormModel = new _FormModel.FormModel(_Validators.stdValidators),
	      meetupFormView = new _FormView.FormView(meetupFormModel, '#meetupForm'),
	      meetupFormController = new _FormController.FormController(meetupFormModel, meetupFormView);

	  // instantiate the guest list component
	  var guestListModel = new _GuestListModel.GuestListModel(),
	      guestListView = new _GuestListView.GuestListView(guestListModel, '.event-invites'),
	      guestListController = new _GuestListController.GuestListController(guestListModel, guestListView);

	  // inject the 'eventGuestList' validation function.
	  // needed as validation for 'guestlist' requires querying it's model
	  meetupFormModel.setCustomValidator('eventGuestList', guestListModel.isValid.bind(guestListModel));

	  // custom date compare function to validate events end date
	  // pulled from view to allow for comparing partial (invalid) dates
	  meetupFormModel.setCustomValidator('eventEnd', function () {
	    var start = meetupFormView.getInput('eventStart'),
	        end = meetupFormView.getInput('eventEnd');
	    return _Validators.dateValidator.lessThan(start, end);
	  });

	  // on guestlist change, update the meetup form model and revalidate
	  guestListModel.guestListChanged.attach(function (guests) {
	    console.log('guest list chagned hanlder: ', guests);
	    meetupFormModel.setItem('eventGuestList', guests, 'eventGuestList');
	    console.log(meetupFormModel._store);
	    meetupFormController.checkFormValidity();
	  });

	  // instantiate the meetup list component. Load any pre-existing meetups
	  // to the meetup model
	  var meetupListModel = new _MeetupListModel.MeetupListModel(userService.getEvents()),
	      meetupListView = new _MeetupListView.MeetupListView(meetupListModel, '.meetup-list');

	  // on event form submission, add meetup item & reset form
	  meetupFormModel.formSubmitted.attach(function (event) {
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


	// validation maps containing functions for various input types.


	// Sub-component of the 'event' form. Similar data flow to the form mvc.
	// Model stores guestlist and validation. The data is injected into the 'event' form.
	// ? question - should this be integrated into an extended 'form' class?


	// user service is used to interface with the user object.
	// pulls, stores, and updates user data

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// class used to manage global page view.
	// Really only toggles 'registered' or 'unregistered' class on a container
	// based on a boolean value passed to 'toggleRegistration'

	var PageView = function () {
	  function PageView(container) {
	    _classCallCheck(this, PageView);

	    this.container = document.querySelector(container);
	  }

	  // expects boolean 'registered' indicating if the class should be 'registered' (if true) or 'unregistered' (if false)


	  _createClass(PageView, [{
	    key: 'toggleRegistration',
	    value: function toggleRegistration(registered) {
	      if (registered) {

	        if (!this.container.classList.contains('registered')) ;
	        this.container.classList.add('registered');

	        if (this.container.classList.contains('unregistered')) ;
	        this.container.classList.remove('unregistered');
	      } else {

	        if (!this.container.classList.contains('unregistered')) ;
	        this.container.classList.add('unregistered');

	        if (this.container.classList.contains('registered')) this.container.classList.remove('registered');
	      }
	    }
	  }]);

	  return PageView;
	}();

	exports.PageView = PageView;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UserService = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fakeAJAXCall = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defaultUser = {
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

	var UserService = function () {

	  // if no user is passed at initalization,
	  // query local storage for cached object
	  // complete user object would not be stored in production 'i.e. no "password" field.'

	  function UserService(user) {
	    _classCallCheck(this, UserService);

	    if (user === undefined) {
	      var cachedProfile = localStorage.getItem('userProfile');
	      if (cachedProfile !== null) {
	        this._user = JSON.parse(cachedProfile);
	      } else {
	        this._user = null;
	      }
	    }
	  }

	  // creates user profile, then posts to server


	  _createClass(UserService, [{
	    key: 'createUser',
	    value: function createUser(profile) {
	      this._user = Object.assign(defaultUser, profile);
	      (0, _fakeAJAXCall.fakeAJAXCall)(this._user).then(function (msg) {
	        this.updateCache(msg);
	      }.bind(this));
	    }
	  }, {
	    key: 'updateCache',
	    value: function updateCache() {
	      localStorage.setItem('userProfile', JSON.stringify(this._user));
	    }
	  }, {
	    key: 'clearUserProfile',
	    value: function clearUserProfile() {
	      this._user = Object.assign({}, defaultUser);
	      localStorage.removeItem('userProfile');
	    }
	  }, {
	    key: 'getProfile',
	    value: function getProfile() {
	      return this._user;
	    }
	  }, {
	    key: 'hasUser',
	    value: function hasUser() {
	      return this._user !== null;
	    }

	    // simulates POSTing an event via AJAX

	  }, {
	    key: 'addEvent',
	    value: function addEvent(event) {
	      (0, _fakeAJAXCall.fakeAJAXCall)(event).then(function (event) {
	        console.log('success: ', event);
	        this._user.events.push(event);
	        this.updateCache();
	      }.bind(this), function (msg) {
	        console.log('fail: ', msg);
	      });
	    }

	    // returns fake events for testing

	  }, {
	    key: 'getEvents',
	    value: function getEvents() {
	      var e1 = {
	        eventEnd: "2016-06-16",
	        eventHost: "Logan Wishart-Craig",
	        eventLocation: "af",
	        eventName: "Forts ;D",
	        eventStart: "2016-06-07",
	        eventType: "w"
	      };

	      var e2 = {
	        eventEnd: "2016-06-16",
	        eventHost: "George Furlong",
	        eventLocation: "af",
	        eventName: "Laser tag",
	        eventStart: "2016-06-07",
	        eventType: "w"
	      };

	      var e3 = {
	        eventEnd: "2016-06-16",
	        eventHost: "Marcus Piewton",
	        eventLocation: "af",
	        eventName: "Tea and shots",
	        eventStart: "2016-06-07",
	        eventType: "w"
	      };

	      var fakeEvents = [e1, e2, e3];

	      return fakeEvents;
	    }
	  }]);

	  return UserService;
	}();

	exports.UserService = UserService;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});


	// used to simulate AJAX calls via promises
	var fakeAJAXCall = function fakeAJAXCall(data) {
	    return new Promise(function (res, rej) {

	        res(data);
	    });
	};

	exports.fakeAJAXCall = fakeAJAXCall;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FormModel = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(6);

	var _fakeAJAXCall = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// The model used for forms. Will store form data, and notify
	// listeners of various events. Expects an object 'validationMap',
	// where keys are values defined in the form input 'data-validation' attributes
	// and values are corresponding validation methods.
	// Optional object 'store' defines pre-existing model key value pairs
	// Optional object 'required' defines a known required input map, where
	// keys are form input names and values are keys to 'validationMap'

	var FormModel = function () {
	  function FormModel() {
	    var validationMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var store = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var required = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, FormModel);

	    this._store = store;
	    this._valid = false;
	    this._required = required;

	    this._validationMap = validationMap;

	    // create all events
	    // ? question - should invalid & valid events be combined?
	    // this.itemSet = new Event(this);
	    this.itemValid = new _Event.Event(this);
	    this.itemInvalid = new _Event.Event(this);
	    // this.itemRemoved = new Event(this);
	    this.formValid = new _Event.Event(this);
	    this.formInvalid = new _Event.Event(this);
	    this.formSubmitted = new _Event.Event(this);
	  }

	  _createClass(FormModel, [{
	    key: 'getData',
	    value: function getData() {
	      return this._store;
	    }
	  }, {
	    key: 'getItem',
	    value: function getItem(item) {
	      return this._store[item];
	    }

	    // set's an item & will emmit corresponding validation event
	    // expects string 'key', the key to store for
	    // 'value', the value to store
	    // and string 'validationType', corresponding to the key for the validation function in '_validationMap'.
	    // ? quesiton - better to assume true so attribute 'data-validation' isn't required in all cases?

	  }, {
	    key: 'setItem',
	    value: function setItem(key, value, validationType) {

	      // if no validation map for validation type, notify item invalid,
	      // otherwise, validate.
	      if (this._validationMap[validationType] === undefined) {

	        console.warn('No validator for type ' + validationType + '. Assuming invalidity.');
	        this.itemInvalid.notify(key);
	      } else {

	        // if valid, notify so & store.
	        // otherwise notify invalid
	        if (this._validationMap[validationType](value)) {
	          this.itemValid.notify(key);
	          this._store[key] = value;
	        } else {
	          this.itemInvalid.notify(key);
	        }
	      }
	      console.log(this._store);
	      // this.itemSet.notify(this._store);
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(key) {

	      // if key exists, remove it
	      if (this._store[key] !== undefined) {

	        // 'delete' vs ' = undefined'?
	        delete this._store[key];
	      }
	    }

	    // Validates all required inputs and toggle
	    // model's valid state accordingly

	  }, {
	    key: 'validate',
	    value: function validate() {

	      // pull requirements to loop through
	      var requiredNames = Object.keys(this._required);

	      // go through each requirement
	      // for loop used to terminate function on first invalidity.
	      for (var i = 0; i < requiredNames.length; i++) {

	        // get info
	        var name = requiredNames[i],
	            test = this._validationMap[this._required[name]],
	            value = this._store[name];

	        // if any invalid conditions are met, set state & notify invalidity, return
	        if (value === undefined || test === undefined || test(value) === false) {
	          this._valid = false;
	          this.formInvalid.notify();
	          return;
	        }
	      }

	      // if not returned by for loop, form is valid.
	      this._valid = true;
	      this.formValid.notify();
	    }
	  }, {
	    key: 'isValid',
	    value: function isValid() {
	      return this._valid;
	    }

	    // function used to set required inputs. Expects a 'required' object with keys
	    // as input names, and values as strings correlating to a key in '_validationMap'.
	    // Avoided direct validation functions for memory?

	  }, {
	    key: 'setRequired',
	    value: function setRequired(required) {
	      this._required = required;
	    }

	    // submit form if valid. Would POST to server here, probably through
	    // 'user' or 'event' services.
	    // notify form was submitted

	  }, {
	    key: 'submit',
	    value: function submit() {
	      if (this.isValid()) {
	        console.log('submitting: ', this._store);
	        (0, _fakeAJAXCall.fakeAJAXCall)(this._store).then(function (msg) {
	          this.formSubmitted.notify(msg);
	        }.bind(this));
	      }
	    }

	    // used to set key value pairs in '_validationMap'.
	    // Expects a string 'type', indicating the validation type (correlates to 'data-validation')
	    // and function 'validator' that should expect one argument (string being validated), and return true or false.

	  }, {
	    key: 'setCustomValidator',
	    value: function setCustomValidator(type, validator) {
	      if (this._validationMap[type] !== undefined) console.warn('Validator already exists for type ' + type + '. Overwriting...');
	      this._validationMap[type] = validator;
	    }

	    // reset form model

	  }, {
	    key: 'clear',
	    value: function clear() {
	      this._store = {};
	      this._required = {};
	      this._valid = false;
	    }
	  }]);

	  return FormModel;
	}();

	exports.FormModel = FormModel;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// simple Event class (not to be confused to events in reference to meetup events)

	// allows a 'sender' to notify 'listeners'.
	// On notification, all listening functions are executed, and arguments
	// are passed into the callback

	var Event = function () {
	  function Event(sender) {
	    _classCallCheck(this, Event);

	    this._sender = sender;
	    this._listeners = [];
	  }

	  _createClass(Event, [{
	    key: "attach",
	    value: function attach(listener) {
	      this._listeners.push(listener);
	    }
	  }, {
	    key: "notify",
	    value: function notify(args) {
	      var _this = this;

	      this._listeners.forEach(function (listener) {
	        return listener(args, _this._sender);
	      });
	    }
	  }]);

	  return Event;
	}();

	exports.Event = Event;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FormView = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(6);

	var _forEachNode = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// class used to bind to forms.
	// pulls validation types & requirements, caches node references,
	// toggles 'valid'/'invalid' state on input & form,
	// notifies of input changes
	// 'root' node should have inputs and a button[type=submit] as children/grandchildren

	var FormView = function () {
	  function FormView(model, root) {
	    _classCallCheck(this, FormView);

	    this._model = model;

	    this._form = document.querySelector(root);

	    // key as input name, value as node reference
	    this._inputs = {};

	    //  key as input name, value as validation type
	    this._required = {};

	    // build '_inputs' & '_required'
	    // loop through each input node, push all to '_inputs',
	    // if 'data-required=required' attribute or 'required' attribute exist,
	    // push name & 'data-validation' value to '_required'
	    // 'data-validation' used when browser validation is not useful,
	    // but value still needs to be present (guestList).
	    (0, _forEachNode.forEachNode)(this._form.querySelectorAll(':scope input, :scope select, :scope textarea'), function (node) {

	      var name = node.getAttribute('name');

	      this._inputs[name] = node;

	      if (node.hasAttribute('required') || node.getAttribute('data-required') === 'required') {
	        this._required[name] = node.getAttribute('data-validation');
	      }
	    }.bind(this));

	    // cache submit button
	    this._submitBtn = this._form.querySelector(':scope button[type=submit]');

	    // create events
	    this.inputChanged = new _Event.Event(this);
	    this.formChanged = new _Event.Event(this);
	    this.formSubmitted = new _Event.Event(this);

	    // bind browser events
	    this._form.addEventListener('keyup', this.handleChange.bind(this));
	    this._form.addEventListener('change', this.handleChange.bind(this));
	    this._form.addEventListener('submit', this.handleSubmit.bind(this));

	    // bind model listeners
	    // ? question - should valid/invalid functions be combined into 'toggleValidity(node, validity)'?

	    this._model.itemValid.attach(function (key) {
	      this.markValid(this._inputs[key]);
	    }.bind(this));

	    this._model.itemInvalid.attach(function (key) {
	      this.markInvalid(this._inputs[key]);
	    }.bind(this));

	    this._model.formValid.attach(function () {
	      this.markFormValid();
	    }.bind(this));

	    this._model.formInvalid.attach(function () {
	      this.markFormInvalid(this._form);
	    }.bind(this));
	  }

	  // called on 'keypress' & 'change'. If target is input, pull data from
	  // node, notify listeners of an input change, passing input data.


	  _createClass(FormView, [{
	    key: "handleChange",
	    value: function handleChange(evt) {

	      if (evt.target.tagName === 'INPUT' || evt.target.tagName === 'SELECT' || evt.target.tagName === 'TEXTAREA') {

	        // used because form model would update on 'event guest list' input change
	        // and pass the value in the input as the 'eventGuestList' value instead of using
	        // the array that's managed by the 'GuestList' components.
	        // The fact this is here I believe indicates I've done something incorrect.
	        if (evt.target.hasAttribute('data-ignore')) return;

	        var inputData = {
	          name: evt.target.getAttribute('name'),
	          value: evt.target.value,
	          validationType: evt.target.getAttribute('data-validation')
	        };

	        this.inputChanged.notify(inputData);
	      }
	    }
	  }, {
	    key: "getInput",
	    value: function getInput(name) {
	      return this._inputs[name].value;
	    }

	    // supress browser form submission so model can properly validate & post.

	  }, {
	    key: "handleSubmit",
	    value: function handleSubmit(evt) {
	      evt.preventDefault();
	      this.formSubmitted.notify();
	    }
	  }, {
	    key: "markValid",
	    value: function markValid(node) {
	      node.removeAttribute('invalid');
	      node.setAttribute('valid', null);
	    }
	  }, {
	    key: "markInvalid",
	    value: function markInvalid(node) {
	      node.removeAttribute('valid');
	      node.setAttribute('invalid', null);
	    }
	  }, {
	    key: "markFormValid",
	    value: function markFormValid() {
	      this._form.classList.remove('invalid');
	      this._form.classList.add('valid');
	      this._submitBtn.removeAttribute('disabled');
	    }
	  }, {
	    key: "markFormInvalid",
	    value: function markFormInvalid() {
	      this._form.classList.remove('valid');
	      this._form.classList.add('invalid');
	      this._submitBtn.setAttribute('disabled', null);
	    }

	    // used by controller to pass required inputs & their validation names
	    // to the model.

	  }, {
	    key: "getRequired",
	    value: function getRequired() {
	      return this._required;
	    }

	    // clear the view. loop through each input, remove validity state,
	    // and reset value

	  }, {
	    key: "clear",
	    value: function clear() {
	      Object.keys(this._inputs).forEach(function (key) {

	        var input = this._inputs[key];

	        input.value = '';
	        input.removeAttribute('invalid');
	        input.removeAttribute('valid');
	      }.bind(this));
	    }
	  }]);

	  return FormView;
	}();

	exports.FormView = FormView;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// would be expanded to something like 'nodeOps.js'
	// that could include other common node functions

	// run a callback on each node in a list
	function forEachNode(nodeList, cb) {
	  for (var i = 0; i < nodeList.length; i++) {
	    cb(nodeList[i]);
	  }
	}

	exports.forEachNode = forEachNode;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Controller for forms will notify the model of any
	// updates to the view.
	// View will emmit input changes, controller passes data
	// to model & the model validates and stores. Model notifies if the data
	// is valid, and view will update 'valid'/'invalid' input node attribute accordingly
	// Controller also handles resets.

	var FormController = function () {
	  function FormController(model, view) {
	    _classCallCheck(this, FormController);

	    this._model = model;
	    this._view = view;

	    // Grab 'required' inputs from the view and set in the model
	    // for validation purposes
	    // For some reason, I want the 'required' flag to stay in the markup and not have to be pre-defined in the model? Should it be the other way around?
	    this._model.setRequired(this._view.getRequired());

	    // when inputs are changd, set the item in the model and
	    // revalidate the form
	    this._view.inputChanged.attach(function (inputData) {
	      this.setItem(inputData.name, inputData.value, inputData.validationType);
	      this.checkFormValidity();
	    }.bind(this));

	    // when form is submitted, check if its valid, submit and reset if so.
	    this._view.formSubmitted.attach(function () {
	      if (this._model.isValid()) {
	        this.submitForm();
	        this.reset();
	      } else {
	        console.log('tried to submit, but form was invalid');
	      }
	    }.bind(this));
	  }

	  // sets item in model.
	  // expects string "name" as key in model,
	  // value as value to store
	  // vtype as string indicating validation key in validation map
	  // triggers models change & item valididty events


	  _createClass(FormController, [{
	    key: 'setItem',
	    value: function setItem(name, value, vtype) {
	      this._model.setItem(name, value, vtype);
	    }

	    // validate current form model.
	    // triggers models form validity event

	  }, {
	    key: 'checkFormValidity',
	    value: function checkFormValidity() {
	      this._model.validate();
	    }

	    // triggers models submitted event

	  }, {
	    key: 'submitForm',
	    value: function submitForm() {
	      this._model.submit();
	    }

	    // clear model and view, reset required inputs

	  }, {
	    key: 'reset',
	    value: function reset() {
	      this._view.clear();
	      this._model.clear();
	      this._model.setRequired(this._view.getRequired());
	    }
	  }]);

	  return FormController;
	}();

	exports.FormController = FormController;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GuestListModel = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Model used to store the guest list when creating an event.
	// Data will be passed to the event form.
	// Notifies listeners of model events.
	// Can be passed 'guestList', an array of strings as a predefined guest list

	var GuestListModel = function () {
	  function GuestListModel() {
	    var guestList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    _classCallCheck(this, GuestListModel);

	    this._guestList = guestList;

	    // create events
	    this.guestAdded = new _Event.Event(this);
	    this.guestRemoved = new _Event.Event(this);
	    this.guestListChanged = new _Event.Event(this);
	  }

	  // add string 'name' to store, notify.


	  _createClass(GuestListModel, [{
	    key: 'addGuest',
	    value: function addGuest(name) {
	      console.log('adding ', name);
	      if (name === '') return;
	      this._guestList.push(name);
	      this.guestAdded.notify(name);
	      console.log('have list ', this._guestList);
	      this.guestListChanged.notify(this._guestList);
	    }

	    // remove based on int 'index', notify.

	  }, {
	    key: 'removeGuest',
	    value: function removeGuest(index) {
	      if (index < 0 || index > this._guestList.length) throw new Error('Trying to remove index ' + index + ' of guestList length ' + this._guestList.length + '.');
	      this._guestList.splice(index, 1);
	      this.guestRemoved.notify(index);
	      this.guestListChanged.notify(this._guestList);
	    }

	    // validation function. Used by form model via 'setCustomValidator'.

	  }, {
	    key: 'isValid',
	    value: function isValid() {
	      return this._guestList.length > 0;
	    }

	    // reset model

	  }, {
	    key: 'clear',
	    value: function clear() {
	      this._guestList = [];
	      this.guestListChanged.notify(this._guestList);
	    }
	  }]);

	  return GuestListModel;
	}();

	exports.GuestListModel = GuestListModel;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GuestListView = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Guest list view handles displaying, adding, and removing
	// guest list items in the 'event' form.
	// Will notify listeners of button clicks & pass input information
	// root node should have as children/grandchildren an input to pull names from,
	// a ul to output names to, and a button[type=button] to trigger event

	var GuestListView = function () {
	  function GuestListView(model, root) {
	    _classCallCheck(this, GuestListView);

	    this._model = model;

	    // grab nodes
	    this._container = document.querySelector(root);
	    this._output = this._container.querySelector(':scope ul');
	    this._input = this._container.querySelector(':scope input');
	    this._addBtn = this._container.querySelector(':scope button[type=button]');

	    // create events
	    this.addBtnClicked = new _Event.Event(this);
	    this.rmvBtnClicked = new _Event.Event(this);

	    // used bubbling for 'remove' buttons
	    this._output.addEventListener('click', this.handleRemove.bind(this));

	    this._addBtn.addEventListener('click', this.handleAdd.bind(this));
	    this._input.addEventListener('keypress', this.handleKeypress.bind(this));

	    // used so form view doesn't validate & store the text input;
	    this._input.addEventListener('change', function (evt) {
	      evt.stopPropagation();
	    });

	    // when model notifys guest was added, add to view
	    this._model.guestAdded.attach(function (name) {
	      this.addGuest(name);
	    }.bind(this));

	    // when model notifys guest was removed, remove from view
	    this._model.guestRemoved.attach(function (index) {
	      this.removeGuest(index);
	    }.bind(this));
	  }

	  // when add button clicked, notify & pass input value
	  // then reset input


	  _createClass(GuestListView, [{
	    key: 'handleAdd',
	    value: function handleAdd(evt) {
	      this.addBtnClicked.notify(this._input.value);
	      this._input.value = '';
	    }

	    // when 'enter' is hit on input, handle add.

	  }, {
	    key: 'handleKeypress',
	    value: function handleKeypress(evt) {
	      evt.stopPropagation();
	      if (evt.charCode === 13) {
	        evt.preventDefault();
	        this.handleAdd(evt);
	      }
	    }

	    // when remove output container clicked, check if
	    // srouce was a button, if so, get index to remove & notify listeners.
	    // expects butons parent element is the one to remove

	  }, {
	    key: 'handleRemove',
	    value: function handleRemove(evt) {
	      if (evt.target.tagName === 'BUTTON') {
	        var li = evt.target.parentElement;
	        var i = 0;
	        for (i; li = li.previousSibling; i++) {}
	        this.rmvBtnClicked.notify(i);
	      }
	    }

	    // could be better managed, but creates a guest node
	    // <li>{{name}}<button class="guest-remove">X</button></li>
	    // ? quesiton - clone a hidden node? use literal templates + .replace or ``?

	  }, {
	    key: 'buildGuestNode',
	    value: function buildGuestNode(name) {

	      var toAdd = document.createElement('li');
	      toAdd.innerText = name;

	      var button = document.createElement('button');
	      button.innerText = 'X';
	      button.classList.add('guest-remove');
	      button.setAttribute('type', 'button');

	      toAdd.appendChild(button);

	      return toAdd;
	    }

	    // expects a string 'name'
	    // will build a node & prepend it to the output

	  }, {
	    key: 'addGuest',
	    value: function addGuest(name) {
	      var node = this.buildGuestNode(name);
	      this._output.insertBefore(node, this._output.firstChild);
	    }

	    // expects an int 'index'
	    // will remove the li at that index

	  }, {
	    key: 'removeGuest',
	    value: function removeGuest(index) {
	      this._output.children[index].remove();
	    }

	    // clear output and input.

	  }, {
	    key: 'clear',
	    value: function clear() {
	      this._output.innerHTML = '';
	      this._input.value = '';
	    }
	  }]);

	  return GuestListView;
	}();

	exports.GuestListView = GuestListView;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Controller used to manage guest list view and model.
	// View will notify button presses and pass a guest name.
	// Controller passes data to model & model notifies of change.
	// Controller also handles resets.

	var GuestListController = function () {
	  function GuestListController(model, view) {
	    _classCallCheck(this, GuestListController);

	    this._model = model;
	    this._view = view;

	    // ? question - should 'name' be passed in the event or grabbed in the function body?
	    this._view.addBtnClicked.attach(function (name) {
	      this._model.addGuest(name);
	    }.bind(this));

	    this._view.rmvBtnClicked.attach(function (index) {
	      this._model.removeGuest(index);
	    }.bind(this));
	  }

	  _createClass(GuestListController, [{
	    key: "reset",
	    value: function reset() {
	      this._model.clear();
	      this._view.clear();
	    }
	  }]);

	  return GuestListController;
	}();

	exports.GuestListController = GuestListController;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MeetupListModel = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Model used to store and add meetup events
	// Can be passed 'store', an array of predefined meetup objects.

	var MeetupListModel = function () {
	  function MeetupListModel() {
	    var store = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    _classCallCheck(this, MeetupListModel);

	    this._store = store;
	    this.eventAdded = new _Event.Event(this);
	  }

	  // would POST data to server using user service


	  _createClass(MeetupListModel, [{
	    key: 'addEvent',
	    value: function addEvent(event) {

	      this._store.push(event);
	      this.eventAdded.notify(event);

	      // fakeAJAXCall(event).then(function(event) {
	      //   this.eventAdded.notify(event);
	      // }.bind(this));
	    }
	  }, {
	    key: 'getEvents',
	    value: function getEvents() {
	      return this._store;
	    }
	  }]);

	  return MeetupListModel;
	}();

	exports.MeetupListModel = MeetupListModel;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Used to display, and add meetup events.
	// Will also toggle the default 'no events' item.
	// Updated by listening for model changes.
	// Root should have an item with class 'default' as child/grandchild to toggle
	// and a ul to output items to.
	// removal of meetup items intentionally left out to limit scope of project.

	var MeetupListView = function () {
	  function MeetupListView(model, root) {
	    _classCallCheck(this, MeetupListView);

	    this._model = model;

	    // pull nodes
	    this._container = document.querySelector(root);
	    this._output = this._container.querySelector(':scope ul');
	    this._defaultItem = this._container.querySelector(':scope .default');

	    // used to avoid counting <li>'s
	    this._active = 0;

	    // add event to view when added to model
	    this._model.eventAdded.attach(function (event) {
	      this.addEvent(event);
	    }.bind(this));

	    // used to populate any existing model items
	    // ? question - does this belong here? would it be better in a controller?
	    this._model.getEvents().forEach(function (event) {
	      this.addEvent(event);
	    }.bind(this));
	  }

	  // toggles visability on the default item


	  _createClass(MeetupListView, [{
	    key: 'toggleDefault',
	    value: function toggleDefault() {
	      if (this._active > 0) {
	        if (this._defaultItem.classList.contains('hide')) return;
	        this._defaultItem.classList.add('hide');
	      } else {
	        if (!this._defaultItem.classList.contains('hide')) return;
	        this._defaultItem.classList.remove('hide');
	      }
	    }

	    // build the html

	  }, {
	    key: 'buildEventNode',
	    value: function buildEventNode(event) {
	      var node = document.createElement('li');
	      node.classList.add('event-item');

	      // needed for the way dates are stored in the model
	      var date = event.eventStart.split('T')[0];

	      node.innerHTML = date + ' - <b>' + event.eventName + '</b><br><i>Hosted By ' + event.eventHost + '</i>';

	      return node;
	    }

	    // inc. counter, toggle default item, prepend item

	  }, {
	    key: 'addEvent',
	    value: function addEvent(event) {
	      this._active++;
	      this.toggleDefault();
	      this._output.insertBefore(this.buildEventNode(event), this._output.firstChild);
	    }
	  }]);

	  return MeetupListView;
	}();

	exports.MeetupListView = MeetupListView;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PasswordController = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _forEachNode = __webpack_require__(8);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// A class used to determine the validity of a password input,
	// and toggle help text classes based on missing components.
	// Expects a string 'passwordInput', the node selector to pull the password from,
	// A string 'reqContainer' indicating the parent node selector of the help text
	// html list
	// An object 'validationMap', where keys are the values corresponding to the help text's 'data-requirement' attribute, and values are functions defining the validation method
	// Does not need to inject data into form model, as the individual validation tests here are performed in the form model as well.

	var PasswordController = function () {
	    function PasswordController(passwordInput, reqContainer) {
	        var validationMap = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	        _classCallCheck(this, PasswordController);

	        // grab input and listen for keyups
	        this._passwordInput = document.querySelector(passwordInput);
	        this._passwordInput.addEventListener('keyup', this.handleKeyup.bind(this));

	        // pull references to help text nodes and index by requirement
	        this._reqMap = {};
	        (0, _forEachNode.forEachNode)(document.querySelectorAll(reqContainer + ' li[data-requirement]'), function (node) {
	            var key = node.getAttribute('data-requirement');
	            this._reqMap[key] = node;
	        }.bind(this));

	        this._validationMap = validationMap;
	    }

	    // expects a string 'password' to be validated
	    // and a string 'requirement' to indicate the corresponding requirement


	    _createClass(PasswordController, [{
	        key: 'validate',
	        value: function validate(password, requirement) {

	            // store reference to relevant help text node
	            var messageToMark = this._reqMap[requirement];

	            // if no reference to node exists, warn and return
	            if (messageToMark === undefined) {
	                console.warn('Password requirement message map doesn\'t have an <li> for ' + requirement + '.');
	                return;
	            }

	            // if no validation method is defined for the requirement, warn, reutrn and
	            // mark help text node unmet.
	            // otherwise, mark help text node based on validation result
	            if (!this._validationMap[requirement]) {
	                console.warn('Password validation map doesn\'t have a test for \'' + requirement + '\'. Assuming invalid.');
	                return this.markUnmet(messageToMark);
	            }
	            if (this._validationMap[requirement](password)) this.markMet(messageToMark);else this.markUnmet(messageToMark);
	        }

	        // toggle a nodes state to met via classes

	    }, {
	        key: 'markMet',
	        value: function markMet(node) {
	            node.classList.remove('unmet');
	            if (!node.classList.contains('met')) node.classList.add('met');
	        }

	        // toggle a nodes state to unmet via classes

	    }, {
	        key: 'markUnmet',
	        value: function markUnmet(node) {
	            node.classList.remove('met');
	            if (!node.classList.contains('unmet')) node.classList.add('unmet');
	        }

	        // on input keyup, grab new value & validate against all requirements

	    }, {
	        key: 'handleKeyup',
	        value: function handleKeyup(evt) {
	            var _this = this;

	            var password = evt.target.value;

	            Object.keys(this._reqMap).forEach(function (req) {
	                _this.validate(password, req);
	            });
	        }
	    }]);

	    return PasswordController;
	}();

	exports.PasswordController = PasswordController;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// contains validators used to validate values.

	// 'stdValidators' is used as the starting '_validationMap' for the registration
	// and event forms. keys should correlate to an input nodes 'data-validation' attribute value.
	// all functions should return true or false based on validity
	var stdValidators = {
	  text: function text(_text) {
	    return _text.length !== 0;
	  },
	  email: function email(_email) {
	    if (_email.length === 0) return false;
	    return _email.match(/.+@.+/) !== null;
	  },
	  password: function password(_password) {
	    if (_password.length < 8) return false;
	    if (_password.match(/[a-z]/) === null) return false;
	    if (_password.match(/[A-Z]/) === null) return false;
	    if (_password.match(/\W|[0-9]/) === null) return false;
	    return true;
	  },
	  date: function date(bday) {
	    return bday.match(/^\d{4}-\d{2}-\d{2}/) !== null;
	  },
	  gender: function gender(_gender) {
	    if (_gender.length !== 1) return false;
	    return _gender.match(/^(M|F|O)/) !== null;
	  },
	  country: function country(_country) {
	    return _country.length === 2;
	  },
	  state: function state(_state) {
	    return _state.length === 2;
	  },
	  datetime: function datetime(_datetime) {
	    return _datetime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) !== null;
	  }
	};

	// 'passwordValidators' is used by 'passwordController'. Keys correlate to the help text nodes 'data-requirement' attribute value.
	// all tests are performed under one 'password' function in 'stdValidators' as well
	var passwordValidators = {
	  length: function length(password) {
	    return password.length >= 8;
	  },
	  upper: function upper(password) {
	    return password.match(/[A-Z]/) !== null;
	  },
	  special: function special(password) {
	    return password.match(/\W|[0-9]/) !== null;
	  },
	  lower: function lower(password) {
	    return password.match(/[a-z]/) !== null;
	  }
	};

	// 'dateValidator' is used to validate special circumstnaces with dates
	// 'lessThan' is used to determine 'eventEnd' validity in the event form.
	var dateValidator = {
	  lessThan: function lessThan(date1, date2) {

	    if (date1 === '' || date2 === '') return false;

	    if (date1.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) === null) return false;
	    if (date2.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) === null) return false;

	    var d1 = new Date(date1);
	    var d2 = new Date(date2);

	    return d1 < d2;
	  }
	};

	exports.stdValidators = stdValidators;
	exports.passwordValidators = passwordValidators;
	exports.dateValidator = dateValidator;

/***/ }
/******/ ]);