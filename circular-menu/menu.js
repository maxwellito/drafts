function CircularMenu (menuId) {
  this.el = document.getElementById(menuId);
  this.position = 0;
}

CircularMenu.prototype.activate = function () {
  this.setPosition();
  this.el.classList.add('visible');
};

CircularMenu.prototype.setPosition = function (index) {
  if (this.position === index) {
    return;
  }
  this.swipeClass('selected', (!index ? 'center' : 'index-' + index));
  this.position = index || 0;
};

CircularMenu.prototype.close = function () {
  this.swipeClass('active', 'index-' + this.position);
  this.el.classList.remove('visible');
  return this.position;
}

CircularMenu.prototype.swipeClass = function (className, newElClass) {
  var selectedItem = this.el.querySelector('.' + className);
  if (selectedItem) {
    selectedItem.classList.remove(className);
  }

  var newEl = this.el.querySelector('.' + newElClass);
  if (newEl) {
    newEl.classList.add(className);
  }
}