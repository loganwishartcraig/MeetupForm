class GuestListView {
  constructor(node) {
    this.container = document.querySelector(node);
  }

  reset() {
    this.container.innerHTML = '';
  }

  addGuest(name) {
    if (name === '') return;
    let toAdd = document.createElement('li');
    toAdd.classList.add('guest');
    toAdd.innerText = name;
    this.container.appendChild(toAdd);
  }

  isEmpty() {
    return this.invited > 0;
  }

}

export { GuestListView };