'use strict';

(function () {

  var Pin = function (announcement) {
    this._announcement = announcement;
    this._template = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

    this._parent = document.querySelector('.map__pins');
    this.element = this._template.cloneNode(true);
  };

  Pin.prototype.render = function () {
    var pinElementCover = this.element.querySelector('img');

    this.element.style.left = this._announcement.location.x + 'px';
    this.element.style.top = this._announcement.location.y + 'px';
    pinElementCover.src = this._announcement.author.avatar;
    pinElementCover.alt = this._announcement.offer.title;

    return this.element;
  };

  /* Exports */
  window.Pin = Pin;
})();
