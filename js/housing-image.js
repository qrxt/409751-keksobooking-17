'use strict';

(function () {

  var HousingImage = function (img) {
    this._img = img;
    this._template = document.querySelector('.ad-form__photo');

    this.element = this._template.cloneNode(true);
  };

  HousingImage.prototype.render = function () {
    this.element.style.backgroundSize = 'cover';
    this.element.style.backgroundImage = 'url("' + this._img + '")';

    return this.element;
  };

  /* Exports */
  window.HousingImage = HousingImage;
})();
