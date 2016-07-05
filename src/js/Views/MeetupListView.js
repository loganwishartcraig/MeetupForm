import { fakeAJAXCall } from '../Util/fakeAJAXCall';

class MeetupListView {
    constructor(container) {
      this.container = document.querySelector(container);
      this.output = this.container.querySelector(':scope ul');
      this.default = this.container.querySelector(':scope .default');

      this.active = 0;

    }

    addEvent(data) {
      fakeAJAXCall(data).then(function(res) {
        this.active++;
        this.toggleDefault();
        this.output.appendChild(this.buildEventNode(data));
      }.bind(this));
    }

    toggleDefault() {
      if (this.active > 0) {
        if (this.default.classList.contains('hide')) return;
        this.default.classList.add('hide');
      } else {
        if (!this.default.classList.contains('hide')) return;
        this.default.classList.remove('hide');
      }
    }

    buildEventNode(event) {

      let node = document.createElement('li');
      node.classList.add('event-item');
      node.innerHTML = `${event.eventStart} - <b>${event.eventName}</b><br><i>Hosted By ${event.eventHost}</i>`;

      return node;
    }
  }

  export { MeetupListView };