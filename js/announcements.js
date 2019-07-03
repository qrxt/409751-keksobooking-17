'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');

  var main = document.querySelector('main');
  var mapPinMain = mapPinsArea.querySelector('.map__pin--main');
  var mapPinMainText = mapPinMain.querySelector('svg text');

  var housingTypeSelect = document.querySelector('select[name="housing-type"]');
  var housingRoomsSelect = document.querySelector('select[name="housing-rooms"]');

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
      var pinElementCover = pinElement.querySelector('img');

      pinElement.style.left = announcement.location.x + 'px';
      pinElement.style.top = announcement.location.y + 'px';
      pinElementCover.src = announcement.author.avatar;
      pinElementCover.alt = announcement.offer.title;

      return pinElement;
    };

    var getPinsFragment = function (currentAnnouncements) {
      var fragment = document.createDocumentFragment();
      currentAnnouncements
        .slice(0, MAX_PINS_QUANTITY)
        .forEach(function (announcement) {
          var renderedPin = renderPin(announcement);
          fragment.appendChild(renderedPin);
        });

      return fragment;
    };

    mapPinMainText.innerHTML = window.initialMainPinText;
    mapPinMain.disabled = false;

    var filterControls = [
      housingTypeSelect,
      housingRoomsSelect
    ];

    var filterByType = function (data) {
      var currentControlValue = housingTypeSelect.value;
      if (currentControlValue === 'any') {
        return data;
      }
      return data.filter(function (announcement) {
        return announcement.offer.type === currentControlValue;
      });
    };

    var filterByRooms = function (data) {
      var currentControlValue = housingRoomsSelect.value;
      if (currentControlValue === 'any') {
        return data;
      }
      return data.filter(function (announcement) {
        return announcement.offer.rooms === Number(currentControlValue);
      });
    };

    var applyAllFilters = window.util.pipe(
        filterByType,
        filterByRooms
    );

    filterControls.forEach(function (control) {
      control.addEventListener('change', function () {
        var filteredAnnouncements = applyAllFilters(announcements);

        clearPinsArea();
        mapPinsArea.appendChild(getPinsFragment(filteredAnnouncements));
      });
    });

    /* Exports */
    window.initialPinsFragment = getPinsFragment(announcements);
  }, function () {
    var errorFragment = document.createDocumentFragment();
    var errorElement = errorTemplate.cloneNode(true);

    errorFragment.appendChild(errorElement);
    main.appendChild(errorElement);
  });
})();
