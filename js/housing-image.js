'use strict';

(function () {

  var HousingImage = function (img) {
    this._img = img;
    this._template = document.querySelector('.ad-form__photo');

    this.element = this._template.cloneNode(true);
  };

  HousingImage.prototype.render = function () {
    this.element.style.display = 'block';
    this.element.style.backgroundSize = 'cover';
    this.element.draggable = true;
    this.element.style.backgroundImage = 'url("' + this._img + '")';

    var context = this;
    this.element.addEventListener('dragstart', function () {
      context.element.style.opacity = 0.5;
    });

    this.element.addEventListener('dragend', function () {
      context.element.style.opacity = '';
      // context.element.parentNode.appendChild(context.element);
    });

    return this.element;
  };

  /* Exports */
  window.HousingImage = HousingImage;
})();
