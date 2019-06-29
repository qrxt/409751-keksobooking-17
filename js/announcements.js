'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');

  var main = document.querySelector('main');
  var mapPinMain = mapPinsArea.querySelector('.map__pin--main');
  var mapPinMainText = mapPinMain.querySelector('svg text textpath');

  var housingTypeSelect = document.querySelector('select[name="housing-type"]');

  var pinTemplate = document
    .querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var errorTemplate = document
    .querySelector('#error')
    .content
    .querySelector('.error');

  var clearPinsArea = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins.forEach(function (pin) {
      mapPinsArea.removeChild(pin);
    });
  };

  var url = 'https://js.dump.academy/keksobooking/data';
  window.load(url, function (announcements) {
    var MAX_PINS_QUANTITY = 5;

    var renderPin = function (announcement) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinElementCover = pinTemplate.querySelector('img');

      pinElement.style.left = announcement.location.x + 'px';
      pinElement.style.top = announcement.location.y + 'px';
      pinElementCover.src = announcement.author.avatar;
      pinElementCover.alt = announcement.offer.title;

      return pinElement;
    };

    var getPinsFragment = function (filterFunc) {
      var fragment = document.createDocumentFragment();
      var filteredAnnouncements = filterFunc ? announcements.filter(filterFunc) : announcements;

      filteredAnnouncements
        .slice(0, MAX_PINS_QUANTITY)
        .forEach(function (announcement) {
          var renderedPin = renderPin(announcement);
          fragment.appendChild(renderedPin);
        });

      return fragment;
    };

    mapPinMainText.textContent = window.mainPinInitialText;
    mapPinMain.disabled = false;

    housingTypeSelect.addEventListener('change', function (evt) {
      var currentType = evt.target.value;
      var filteredPinsFragment = getPinsFragment(function (pin) {
        if (currentType === 'any') {
          return true;
        } else {
          return pin.offer.type === currentType;
        }
      });
      clearPinsArea();
      mapPinsArea.appendChild(filteredPinsFragment);
    });

    /* Exports */
    window.initialPinsFragment = getPinsFragment();
  }, function () {
    var errorFragment = document.createDocumentFragment();
    var errorElement = errorTemplate.cloneNode(true);

    errorFragment.appendChild(errorElement);
    main.appendChild(errorElement);
  });
})();
