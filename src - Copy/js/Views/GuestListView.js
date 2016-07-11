class GuestListView {
  constructor(node) {
    this.container = document.querySelector(node);
    this.container.addEventListener('click', this.handleContainerClick.bind(this));
  }

  reset() {
    this.container.innerHTML = '';
  }

  addGuest(name) {
    
    if (name === '') return;
    
    let toAdd = document.createElement('li');
    toAdd.classList.add('guest');
    toAdd.innerText = name;
    
    let removeBtn = document.createElement('button');
    removeBtn.setAttribute('type', 'button');
    removeBtn.innerText = 'X';
    removeBtn.classList.add('guest-remove');

    toAdd.appendChild(removeBtn);
    this.container.appendChild(toAdd);

  }

  removeGuest(guestNode) {
    guestNode.remove();
  }

  handleContainerClick(evt) {
    if (evt.target.tagName === 'BUTTON') this.removeGuest(evt.target.parentNode);
  }

  isEmpty() {
    return this.invited > 0;
  }

}

export { GuestListView };