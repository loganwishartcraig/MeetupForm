
// class used to manage global page view.
// Really only toggles 'registered' or 'unregistered' class on a container
// based on a boolean value passed to 'toggleRegistration'

 class PageView {
    constructor(container) {
      this.container = document.querySelector(container);
    }

    // expects boolean 'registered' indicating if the class should be 'registered' (if true) or 'unregistered' (if false)
    toggleRegistration(registered) {
      if (registered) {

        if (!this.container.classList.contains('registered'));
        this.container.classList.add('registered');

        if (this.container.classList.contains('unregistered'));
        this.container.classList.remove('unregistered');

      } else {

        if (!this.container.classList.contains('unregistered'));
        this.container.classList.add('unregistered');

        if (this.container.classList.contains('registered'))
          this.container.classList.remove('registered');

      }
    }
  }

  export { PageView };