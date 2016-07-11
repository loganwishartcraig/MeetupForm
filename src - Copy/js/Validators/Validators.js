var stdValidators = {
  text: (text) => (text.length !== 0),
  email: (email) => {
    if (email.length === 0) return false;
    return email.match(/.+@.+/);
  },
  password: (password) => {
    if (password.length < 8) return false;
    if (password.match(/\s/)) return false;
    if (!password.match(/[A-Z]/)) return false;
    if (!password.match(/\W|[0-9]/)) return false;
    return true;
  },
  date: (bday) => {
    return bday.match(/\d{4}-\d{2}-\d{2}/);
  },
  gender: (gender) => {
    if (gender.length !== 1) return false;
    return gender.match(/^(M|F|O)/);
  },
  country: (country) => {
    return (country.length === 2);
  },
  state: (state) => {
    return (state.length === 2);
  },
  datetime: (datetime) => {
    return datetime.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
  }
};


var passwordValidators = {
  length: (password) => password.length >= 8,
  upper: (password) => password.match(/[A-Z]/),
  special: (password) => password.match(/\W|[0-9]/),
  lower: (password) => password.match(/[a-z]/)
};

export { stdValidators, passwordValidators };

