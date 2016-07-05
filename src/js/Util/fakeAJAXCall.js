const fakeAJAXCall = (data) => {
    return new Promise(function(res, rej) {

      res(data);

    });
  };

  export { fakeAJAXCall };