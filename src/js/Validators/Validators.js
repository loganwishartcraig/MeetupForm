// contains validators used to validate values.

// 'stdValidators' is used as the starting '_validationMap' for the registration
// and event forms. keys should correlate to an input nodes 'data-validation' attribute value.
// all functions should return true or false based on validity
var stdValidators = {
  text: (text) => (text.length !== 0),
  email: (email) => {
    if (email.length === 0) return false;
    return email.match(/.+@.+/) !== null;
  },
  password: (password) => {
    if (password.length < 8) return false;
    if (password.match(/[a-z]/) === null) return false;
    if (password.match(/[A-Z]/) === null) return false;
    if (password.match(/\W|[0-9]/) === null) return false;
    return true;
  },
  date: (bday) => {
    return bday.match(/^\d{4}-\d{2}-\d{2}/) !== null;
  },
  gender: (gender) => {
    if (gender.length !== 1) return false;
    return gender.match(/^(M|F|O)/) !== null;
  },
  country: (country) => {
    return (country.length === 2);
  },
  state: (state) => {
    return (state.length === 2);
  },
  datetime: (datetime) => {
    return datetime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) !== null;
  }
};

// 'passwordValidators' is used by 'passwordController'. Keys correlate to the help text nodes 'data-requirement' attribute value.
// all tests are performed under one 'password' function in 'stdValidators' as well
var passwordValidators = {
  length: (password) => password.length >= 8,
  upper: (password) => password.match(/[A-Z]/) !== null,
  special: (password) => password.match(/\W|[0-9]/) !== null,
  lower: (password) => password.match(/[a-z]/) !== null
};


// 'dateValidator' is used to validate special circumstnaces with dates
// 'lessThan' is used to determine 'eventEnd' validity in the event form.
var dateValidator = {
  lessThan: (date1, date2) => {

    if ((date1 === '') || (date2 === '')) return false;

    if (date1.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) === null) return false;
    if (date2.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/) === null) return false;

    let d1 = new Date(date1);
    let d2 = new Date(date2);

    return d1 < d2;
  }
};

export { stdValidators, passwordValidators, dateValidator };

