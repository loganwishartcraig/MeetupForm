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
	__webpack_require__(3);
	__webpack_require__(6);
	__webpack_require__(5);
	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(7);
	__webpack_require__(11);
	__webpack_require__(9);
	__webpack_require__(8);
	module.exports = __webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _UserService = __webpack_require__(2);

	var _FormController = __webpack_require__(3);

	var _PasswordController = __webpack_require__(5);

	var _GuestController = __webpack_require__(6);

	var _Validators = __webpack_require__(7);

	var _PageView = __webpack_require__(8);

	var _MeetupListView = __webpack_require__(9);

	var _ProfileView = __webpack_require__(10);

	var _GuestListView = __webpack_require__(11);

	var _fakeAJAXCall = __webpack_require__(4);

	(function () {

	    // this should be managed better
	    document.addEventListener('DOMContentLoaded', function () {

	        var userService = new _UserService.UserService(),
	            userIsCached = userService.hasUser();

	        var pageView = new _PageView.PageView('body');

	        var regFormController = new _FormController.FormController('#regForm', _Validators.stdValidators),
	            eventFormController = new _FormController.FormController('#meetupForm', _Validators.stdValidators),
	            passwordController = new _PasswordController.PasswordController('#password', '.pw-requirements', _Validators.passwordValidators),
	            guestController = new _GuestController.GuestController('.guest-input'),
	            meetupListView = new _MeetupListView.MeetupListView('.meetup-list'),
	            guestListView = new _GuestListView.GuestListView('.invite-list');

	        var populateProfile = function populateProfile(user) {
	            userService.updateUserProfile(user);
	            pageView.toggleRegistration(userService.hasUser());
	        };

	        var addGuest = function addGuest() {
	            var guest = guestController.getInput();
	            guestListView.addGuest(guest);
	            var valid = eventFormController.validate(guestController.getInputNode());
	            if (valid) eventFormController.updateDataStore(guestController.getInputNode(), valid);

	            guestController.clearInput();
	            guestController.giveFocus();
	        };

	        var addEventItem = function addEventItem(event) {
	            meetupListView.addEvent(event);
	            guestController.reset();
	            guestListView.reset();
	            eventFormController.reset();
	        };

	        var loadEventApp = function loadEventApp() {
	            eventFormController.setValidator('eventGuestList', function () {
	                return guestController.isEmpty();
	            });
	            eventFormController.setDataPuller('eventGuestList', function () {
	                return guestController.getGuests();
	            });
	            guestController.setAction(addGuest);
	            eventFormController.setSubmitCallback(addEventItem);
	        };

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserService = function () {
	  function UserService(user) {
	    _classCallCheck(this, UserService);

	    if (user === undefined) {
	      var cachedProfile = localStorage.getItem('userProfile');
	      if (cachedProfile !== undefined) this.user = JSON.parse(cachedProfile);
	    }
	  }

	  _createClass(UserService, [{
	    key: 'updateUserProfile',
	    value: function updateUserProfile(profile) {
	      this.user = profile;
	      localStorage.setItem('userProfile', JSON.stringify(profile));
	    }
	  }, {
	    key: 'clearUserProfile',
	    value: function clearUserProfile() {
	      this.user = undefined;
	      localStorage.removeItem('userProfile');
	    }
	  }, {
	    key: 'getProfile',
	    value: function getProfile() {
	      return this.user;
	    }
	  }, {
	    key: 'hasUser',
	    value: function hasUser() {
	      return this.user !== null;
	    }
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FormController = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fakeAJAXCall = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FormController = function () {
	  function FormController(root) {
	    var validationMap = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var dataPullers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, FormController);

	    this.form = document.querySelector(root);

	    this.form.addEventListener('submit', this.handleSubmit.bind(this));
	    this.form.addEventListener('change', this.handleChange.bind(this));
	    this.form.addEventListener('keyup', this.handleChange.bind(this));

	    this.inputs = this.form.querySelectorAll(':scope input, :scope select, :scope textarea');
	    this.required = this.form.querySelectorAll(':scope input:required, :scope select:required, :scope textarea:required');
	    this.submit = this.form.querySelector(':scope button[type=submit]');

	    this.valid = false;
	    this.validationMap = validationMap;

	    this.dataStore = {};
	    this.dataPullers = dataPullers;
	  }

	  _createClass(FormController, [{
	    key: 'handleSubmit',
	    value: function handleSubmit(evt) {
	      evt.preventDefault();
	      if (this.validateForm()) {
	        console.log('would be submitting data...', this.dataStore);

	        (0, _fakeAJAXCall.fakeAJAXCall)(this.dataStore).then(function (user) {
	          if (this.submitCallback !== undefined) this.submitCallback(user);
	        }.bind(this), function () {
	          console.log('Error transmitting data');
	        });
	      } else {
	        console.log("form isn't valid yet.");
	      }
	    }
	  }, {
	    key: 'setSubmitCallback',
	    value: function setSubmitCallback(funct) {
	      this.submitCallback = funct;
	    }
	  }, {
	    key: 'getData',
	    value: function getData() {
	      return this.dataStore;
	    }

	    // called twice on keypress events...

	  }, {
	    key: 'handleChange',
	    value: function handleChange(evt) {

	      if (evt.target.tagName === 'INPUT' || evt.target.tagName === 'SELECT') {
	        var validity = this.validate(evt.target);
	        this.updateDataStore(evt.target, validity);
	        this.checkFormValidity();
	      }
	    }
	  }, {
	    key: 'checkFormValidity',
	    value: function checkFormValidity() {

	      // this should be better managed
	      var validRequired = this.form.querySelectorAll(':scope input:required[valid], :scope select:required[valid], :scope textarea:required[valid]').length;

	      var valid = validRequired === this.required.length;

	      return this.toggleValiditiy(this.submit, valid);
	    }
	  }, {
	    key: 'isValid',
	    value: function isValid() {
	      return this.valid;
	    }
	  }, {
	    key: 'toggleValiditiy',
	    value: function toggleValiditiy(node, valid) {
	      if (valid) {
	        this.enable(node);
	      } else {
	        this.disable(node);
	      }
	    }
	  }, {
	    key: 'enable',
	    value: function enable(node) {

	      this.valid = true;

	      if (this.form.classList.contains('invalid')) {
	        this.form.classList.remove('invalid');
	        this.form.classList.add('valid');
	      }

	      if (node.hasAttribute('disabled')) node.removeAttribute('disabled');
	    }
	  }, {
	    key: 'disable',
	    value: function disable(node) {

	      this.valid = false;

	      if (this.form.classList.contains('valid')) {
	        this.form.classList.remove('valid');
	        this.form.classList.add('invalid');
	      }

	      if (!node.hasAttribute('disabled')) node.setAttribute('disabled', 'disabled');
	    }
	  }, {
	    key: 'validate',
	    value: function validate(input) {
	      var validity = this.validateInput(input);
	      this.markValidity(input, validity);
	      return validity;
	    }
	  }, {
	    key: 'validateInput',
	    value: function validateInput(input) {

	      if (!input.hasAttribute('data-validation')) return true;

	      var validationType = input.getAttribute('data-validation');
	      var value = input.value;

	      if (this.validationMap[validationType] === undefined) {
	        console.warn('Validation map doesn\'t have validator for \'' + validationType + '\'.');
	        return true;
	      }

	      return this.validationMap[validationType](value);
	    }
	  }, {
	    key: 'markValidity',
	    value: function markValidity(node, valid) {
	      var attrToRemove = valid ? 'invalid' : 'valid';
	      var attrToAdd = valid ? 'valid' : 'invalid';
	      node.removeAttribute(attrToRemove);
	      node.setAttribute(attrToAdd, attrToAdd);
	    }
	  }, {
	    key: 'updateDataStore',
	    value: function updateDataStore(input, valid) {

	      var key = input.getAttribute('name');
	      var data = this.dataPullers[key] === undefined ? input.value : this.dataPullers[key]();

	      console.log(data, key);

	      if (valid) {
	        this.dataStore[key] = data;
	      } else {
	        if (this.dataStore[key] !== undefined) delete this.dataStore[key];
	      }
	    }
	  }, {
	    key: 'validateForm',
	    value: function validateForm() {

	      var formValidity = true;

	      for (var i = 0; i < this.inputs.length; i++) {
	        var input = this.inputs[i];
	        if (input.hasAttribute('required') || input.value.length > 0) {
	          var inputValidity = this.validate(input);
	          formValidity = formValidity === false ? false : inputValidity;
	        }
	      }

	      return formValidity;
	    }
	  }, {
	    key: 'setValidator',
	    value: function setValidator(type, validator) {
	      if (this.validationMap[type] !== undefined) console.warn('A validation method for ' + type + ' already exists. Overwriting...');

	      this.validationMap[type] = validator;
	    }
	  }, {
	    key: 'setDataPuller',
	    value: function setDataPuller(name, funct) {
	      if (this.dataPullers[name] !== undefined) console.warn('A data pull method for ' + name + ' already exists. Overwriting...');
	      this.dataPullers[name] = funct;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {

	      for (var i = 0; i < this.inputs.length; i++) {
	        var input = this.inputs[i];
	        input.removeAttribute('valid');
	        input.removeAttribute('invalid');
	        input.value = '';
	      }
	      this.dataStore = {};
	      this.valid = false;
	    }
	  }]);

	  return FormController;
	}();

	exports.FormController = FormController;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var fakeAJAXCall = function fakeAJAXCall(data) {
	    return new Promise(function (res, rej) {

	        res(data);
	    });
	};

	exports.fakeAJAXCall = fakeAJAXCall;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PasswordController = function () {
	    function PasswordController(passwordInput, reqContainer) {
	        var validationMap = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	        _classCallCheck(this, PasswordController);

	        this.passwordInput = document.querySelector(passwordInput);
	        this.passwordInput.addEventListener('keyup', this.handleKeyup.bind(this));

	        this.reqs = document.querySelectorAll(reqContainer + ' li[data-requirement]');
	        this.reqMap = this.buildRequirementMap(this.reqs);

	        this.validationMap = validationMap;
	    }

	    _createClass(PasswordController, [{
	        key: 'buildRequirementMap',
	        value: function buildRequirementMap(nodeList) {

	            var map = {};

	            for (var i = 0; i < nodeList.length; i++) {
	                var key = nodeList[i].getAttribute('data-requirement');
	                map[key] = nodeList[i];
	            }

	            return map;
	        }
	    }, {
	        key: 'validate',
	        value: function validate(password, requirement) {

	            var messageToMark = this.reqMap[requirement];

	            if (messageToMark === undefined) {
	                console.warn('Password requirement message map doesn\'t have an <li> for ' + requirement + '.');
	                return;
	            }

	            if (!this.validationMap[requirement]) {
	                console.warn('Password validation map doesn\'t have a test for \'' + requirement + '\'');
	                return this.markMet(messageToMark);
	            }
	            if (this.validationMap[requirement](password)) this.markMet(messageToMark);else this.markUnmet(messageToMark);
	        }
	    }, {
	        key: 'markMet',
	        value: function markMet(node) {
	            node.classList.remove('unmet');
	            if (!node.classList.contains('met')) node.classList.add('met');
	        }
	    }, {
	        key: 'markUnmet',
	        value: function markUnmet(node) {
	            node.classList.remove('met');
	            if (!node.classList.contains('unmet')) node.classList.add('unmet');
	        }
	    }, {
	        key: 'handleKeyup',
	        value: function handleKeyup(evt) {
	            var _this = this;

	            var password = evt.target.value;

	            Object.keys(this.reqMap).forEach(function (req) {
	                _this.validate(password, req);
	            });
	        }
	    }]);

	    return PasswordController;
	}();

	exports.PasswordController = PasswordController;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GuestController = function () {
	  function GuestController(node) {
	    _classCallCheck(this, GuestController);

	    this.container = document.querySelector(node);
	    this.guestInput = this.container.querySelector(':scope input');
	    this.addBtn = this.container.querySelector(':scope button');

	    this.guests = [];

	    this.addBtn.addEventListener('click', this.updateGuestStore.bind(this));
	  }

	  _createClass(GuestController, [{
	    key: 'updateGuestStore',
	    value: function updateGuestStore(evt) {
	      this.guests.push(this.guestInput.value);
	    }
	  }, {
	    key: 'setAction',
	    value: function setAction(funct) {
	      this.addBtn.addEventListener('click', funct);
	    }
	  }, {
	    key: 'getInput',
	    value: function getInput() {
	      return this.guestInput.value;
	    }
	  }, {
	    key: 'getInputNode',
	    value: function getInputNode() {
	      return this.guestInput;
	    }
	  }, {
	    key: 'clearInput',
	    value: function clearInput() {
	      this.guestInput.value = '';
	    }
	  }, {
	    key: 'giveFocus',
	    value: function giveFocus() {
	      this.guestInput.focus();
	    }
	  }, {
	    key: 'getGuests',
	    value: function getGuests() {
	      return this.guests;
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.guests.length > 0;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.clearInput();
	      this.guests = [];
	    }
	  }]);

	  return GuestController;
	}();

	exports.GuestController = GuestController;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var stdValidators = {
	  text: function text(_text) {
	    return _text.length !== 0;
	  },
	  email: function email(_email) {
	    if (_email.length === 0) return false;
	    return _email.match(/.+@.+/);
	  },
	  password: function password(_password) {
	    if (_password.length < 8) return false;
	    if (_password.match(/\s/)) return false;
	    if (!_password.match(/[A-Z]/)) return false;
	    if (!_password.match(/\W|[0-9]/)) return false;
	    return true;
	  },
	  date: function date(bday) {
	    return bday.match(/\d{4}-\d{2}-\d{2}/);
	  },
	  gender: function gender(_gender) {
	    if (_gender.length !== 1) return false;
	    return _gender.match(/^(M|F|O)/);
	  },
	  country: function country(_country) {
	    return _country.length === 2;
	  },
	  state: function state(_state) {
	    return _state.length === 2;
	  },
	  datetime: function datetime(_datetime) {
	    return _datetime.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
	  }
	};

	var passwordValidators = {
	  length: function length(password) {
	    return password.length >= 8;
	  },
	  upper: function upper(password) {
	    return password.match(/[A-Z]/);
	  },
	  special: function special(password) {
	    return password.match(/\W|[0-9]/);
	  },
	  lower: function lower(password) {
	    return password.match(/[a-z]/);
	  }
	};

	exports.stdValidators = stdValidators;
	exports.passwordValidators = passwordValidators;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PageView = function () {
	  function PageView(container) {
	    _classCallCheck(this, PageView);

	    this.container = document.querySelector(container);
	  }

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MeetupListView = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fakeAJAXCall = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MeetupListView = function () {
	  function MeetupListView(container) {
	    _classCallCheck(this, MeetupListView);

	    this.container = document.querySelector(container);
	    this.output = this.container.querySelector(':scope ul');
	    this.default = this.container.querySelector(':scope .default');

	    this.active = 0;
	  }

	  _createClass(MeetupListView, [{
	    key: 'addEvent',
	    value: function addEvent(data) {
	      (0, _fakeAJAXCall.fakeAJAXCall)(data).then(function (res) {
	        this.active++;
	        this.toggleDefault();
	        this.output.appendChild(this.buildEventNode(data));
	      }.bind(this));
	    }
	  }, {
	    key: 'toggleDefault',
	    value: function toggleDefault() {
	      if (this.active > 0) {
	        if (this.default.classList.contains('hide')) return;
	        this.default.classList.add('hide');
	      } else {
	        if (!this.default.classList.contains('hide')) return;
	        this.default.classList.remove('hide');
	      }
	    }
	  }, {
	    key: 'buildEventNode',
	    value: function buildEventNode(event) {

	      var node = document.createElement('li');
	      node.classList.add('event-item');
	      node.innerHTML = event.eventStart + ' - <b>' + event.eventName + '</b><br><i>Hosted By ' + event.eventHost + '</i>';

	      return node;
	    }
	  }]);

	  return MeetupListView;
	}();

	exports.MeetupListView = MeetupListView;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var profileView = function profileView(container, user) {
	  _classCallCheck(this, profileView);

	  this.container = document.querySelector(container);
	};

	exports.profileView = profileView;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GuestListView = function () {
	  function GuestListView(node) {
	    _classCallCheck(this, GuestListView);

	    this.container = document.querySelector(node);
	  }

	  _createClass(GuestListView, [{
	    key: 'reset',
	    value: function reset() {
	      this.container.innerHTML = '';
	    }
	  }, {
	    key: 'addGuest',
	    value: function addGuest(name) {
	      if (name === '') return;
	      var toAdd = document.createElement('li');
	      toAdd.classList.add('guest');
	      toAdd.innerText = name;
	      this.container.appendChild(toAdd);
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.invited > 0;
	    }
	  }]);

	  return GuestListView;
	}();

	exports.GuestListView = GuestListView;

/***/ }
/******/ ]);