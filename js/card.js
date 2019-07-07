'use strict';

/* Изолировать неиспользуемые извне свойства */

(function () {
  var Card = function (announcement) {
    this.announcement = announcement;
    this._template = document
      .querySelector('#card')
      .content
      .querySelector('.map__card');

    this._parent = document.querySelector('.map__pins');
    this.element = this._template.cloneNode(true);
    this._title = this.element.querySelector('.popup__title');
    this._address = this.element.querySelector('.popup__text--address');
    this._price = this.element.querySelector('.popup__text--price');
    this._type = this.element.querySelector('.popup__type');
    this._capacity = this.element.querySelector('.popup__text--capacity');
    this._time = this.element.querySelector('.popup__text--time');
    this._features = this.element.querySelector('.popup__features');
    this._description = this.element.querySelector('.popup__description');
    this._photos = this.element.querySelector('.popup__photos');
    this._avatar = this.element.querySelector('.popup__avatar');

    this.announcementTypes = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец',
    };
  };

  Card.prototype._constructCapacityString = function () {
    var roomsString = this.announcement.offer.rooms + ' комнаты';
    var guestsString = this.announcement.offer.guests + ' гостей';

    return roomsString + ' для ' + guestsString;
  };

  Card.prototype._constructTimeString = function () {
    var checkInString = 'Заезд после ' + this.announcement.offer.checkin;
    var checkOutString = 'выезд после ' + this.announcement.offer.checkout;

    return checkInString + ', ' + checkOutString;
  };

  Card.prototype._constructFeaturesList = function () {
    var constructFeatureElement = function (feature) {
      var featureClass = 'popup__feature--' + feature;
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add(featureClass);

      return featureElement;
    };

    var featuresList = document.createDocumentFragment();
    this.announcement.offer.features.forEach(function (feature) {
      featuresList.appendChild(constructFeatureElement(feature));
    });

    return featuresList;
  };

  Card.prototype._constructPhotosList = function () {
    var constructPhotoElement = function (photoSrc) {
      var PHOTO_PREVIEW_WIDTH = '45';
      var PHOTO_PREVIEW_HEIGHT = '40';
      var photoElement = document.createElement('img');
      photoElement.src = photoSrc;
      photoElement.width = PHOTO_PREVIEW_WIDTH;
      photoElement.height = PHOTO_PREVIEW_HEIGHT;

      return photoElement;
    };

    var photosList = document.createDocumentFragment();
    this.announcement.offer.photos.forEach(function (photo) {
      photosList.appendChild(constructPhotoElement(photo));
    });

    return photosList;
  };

  Card.prototype.render = function () {
    this._title.textContent = this.announcement.offer.title;
    this._address.textContent = this.announcement.offer.address;
    this._price.textContent = this.announcement.offer.price + '₽/ночь';
    this._type.textContent = this.announcementTypes[this.announcement.offer.type];
    this._capacity.textContent = this._constructCapacityString();
    this._time.textContent = this._constructTimeString();
    this._description.textContent = this.announcement.offer.description;
    this._avatar.src = this.announcement.author.avatar;
    var context = this;

    this._features
      .querySelectorAll('.popup__feature')
      .forEach(function (feature) {
        context._features.removeChild(feature);
      });
    this._features.appendChild(this._constructFeaturesList());


    this._photos
      .querySelectorAll('.popup__photo')
      .forEach(function (photo) {
        context._photos.removeChild(photo);
      });
    this._photos.appendChild(this._constructPhotosList());

    var closeBtn = this.element.querySelector('.popup__close');
    var onClickClose = function () {
      context._parent.removeChild(context.element);
      closeBtn.removeEventListener('click', onClickClose);
    };
    var onEscClose = function (evt) {
      if (evt.keyCode === window.util.KeyCodes.ESC) {
        var cards = context._parent.querySelectorAll('.map__card');
        cards.forEach(function (card) {
          context._parent.removeChild(card);
        });
        document.removeEventListener('keydown', onEscClose);
      }
    };

    closeBtn.addEventListener('click', onClickClose);
    document.addEventListener('keydown', onEscClose);

    return this.element;
  };

  /* Exports */
  window.Card = Card;
})();
