 class PageView {
    constructor(container) {
      this.container = document.querySelector(container);
    }

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