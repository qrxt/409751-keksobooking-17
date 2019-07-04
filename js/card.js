'use strict';

/* Изолировать неиспользуемые извне свойства */

(function () {
  var Card = function (announcement) {
    this.template = document
      .querySelector('#card')
      .content
      .querySelector('.map__card');
    this.announcement = announcement;

    this.element = this.template.cloneNode(true);
    this.title = this.element.querySelector('.popup__title');
    this.address = this.element.querySelector('.popup__text--address');
    this.price = this.element.querySelector('.popup__text--price');
    this.type = this.element.querySelector('.popup__type');
    this.capacity = this.element.querySelector('.popup__text--capacity');
    this.time = this.element.querySelector('.popup__text--time');
    this.features = this.element.querySelector('.popup__features');
    this.description = this.element.querySelector('.popup__description');
    this.photos = this.element.querySelector('.popup__photos');
    this.avatar = this.element.querySelector('.popup__avatar');

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
      var photoElement = document.createElement('img');
      photoElement.src = photoSrc;
      photoElement.width = '45';
      photoElement.height = '40';

      return photoElement;
    };

    var photosList = document.createDocumentFragment();
    this.announcement.offer.photos.forEach(function (photo) {
      photosList.appendChild(constructPhotoElement(photo));
    });

    return photosList;
  };

  Card.prototype.render = function () {
    this.title.textContent = this.announcement.offer.title;
    this.address.textContent = this.announcement.offer.address;
    this.price.textContent = this.announcement.offer.price + '₽/ночь';
    this.type.textContent = this.announcementTypes[this.announcement.offer.type];
    this.capacity.textContent = this._constructCapacityString();
    this.time.textContent = this._constructTimeString();
    this.description.textContent = this.announcement.offer.description;
    this.avatar.src = this.announcement.author.avatar;
    var context = this;

    this.features.querySelectorAll('.popup__feature').forEach(function (feature) {
      context.features.removeChild(feature);
    });
    this.features.appendChild(this._constructFeaturesList());


    this.photos.querySelectorAll('.popup__photo').forEach(function (photo) {
      context.photos.removeChild(photo);
    });
    this.photos.appendChild(this._constructPhotosList());

    return this.element;
  };

  /* Exports */
  window.Card = Card;
})();
