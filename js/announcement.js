'use strict';

(function () {
  var LOW_PRICE_BOTTOM_LIMIT = 0;
  var LOW_PRICE_TOP_LIMIT = 9999;
  var MEDIUM_PRICE_BOTTOM_LIMIT = 10000;
  var MEDIUM_PRICE_TOP_LIMIT = 49999;
  var HIGH_PRICE_BOTTOM_LIMIT = 50000;
  var HIGH_PRICE_TOP_LIMIT = 1000000;

  var DEBOUNCE_INTERVAL = 500;
  var MAX_PINS_QUANTITY = 5;

  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');

  var main = document.querySelector('main');
  var mapPinMain = mapPinsArea.querySelector('.map__pin--main');
  var mapPinMainText = mapPinMain.querySelector('svg text');

  var filtersContainer = document.querySelector('.map__filters-container');

  var housingTypeSelect = filtersContainer.querySelector('select[name="housing-type"]');
  var housingRoomsSelect = filtersContainer.querySelector('select[name="housing-rooms"]');
  var housingPriceSelect = filtersContainer.querySelector('select[name="housing-price"]');
  var housingGuestsSelect = filtersContainer.querySelector('select[name="housing-guests"]');

  var housingFeatures = filtersContainer.querySelectorAll('.map__checkbox');

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

  var announcementsUrl = 'https://js.dump.academy/keksobooking/data';
  var load = window.request('GET', announcementsUrl);

  var loadAnnouncements = function () {
    load(function (announcements) {
      var getPinsFragment = function (currentAnnouncements) {
        var fragment = document.createDocumentFragment();
        currentAnnouncements
          .slice(0, MAX_PINS_QUANTITY)
          .forEach(function (announcement) {
            var pin = new window.Pin(announcement);
            var renderedPin = pin.render();
            renderedPin.addEventListener('click', function () {
              var card = new window.card.Card(announcement);

              window.card.clearCardsArea();
              mapPinsArea.appendChild(card.render());
            });
            fragment.appendChild(renderedPin);
          });

        return fragment;
      };

      /* Блокировка пина до загрузки данных с сервера */

      mapPinMainText.innerHTML = window.initialMainPinText;
      mapPinMain.disabled = false;

      /* Фильтрация пинов */

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

      var filterByPrice = function (data) {
        var currentControlValue = housingPriceSelect.value;
        var inPriceRangePredicates = {
          'low': window.util.isInRange(LOW_PRICE_BOTTOM_LIMIT, LOW_PRICE_TOP_LIMIT),
          'middle': window.util.isInRange(MEDIUM_PRICE_BOTTOM_LIMIT, MEDIUM_PRICE_TOP_LIMIT),
          'high': window.util.isInRange(HIGH_PRICE_BOTTOM_LIMIT, HIGH_PRICE_TOP_LIMIT),
        };
        if (currentControlValue === 'any') {
          return data;
        }
        return data.filter(function (announcement) {
          return inPriceRangePredicates[currentControlValue](announcement.offer.price);
        });
      };

      var filterByGuests = function (data) {
        var currentControlValue = housingGuestsSelect.value;
        if (currentControlValue === 'any') {
          return data;
        }
        return data.filter(function (announcement) {
          return announcement.offer.guests === Number(currentControlValue);
        });
      };

      var filterByFeatures = function (data) {
        var currentFeatures = Array
          .from(housingFeatures)
          .reduce(function (acc, feature) {
            if (feature.checked) {
              return acc.concat(feature.value);
            }
            return acc;
          }, []);

        return data.filter(function (announcement) {
          return window.util.includesArray(announcement.offer.features, currentFeatures);
        });
      };

      var applyAllFilters = window.util.pipe(filterByType, filterByRooms, filterByPrice, filterByGuests, filterByFeatures);

      var drawFilteredAnnouncements = function () {
        var filteredAnnouncements = applyAllFilters(announcements);

        clearPinsArea();
        window.card.clearCardsArea();
        mapPinsArea.appendChild(getPinsFragment(filteredAnnouncements));
      };

      var debouncedDrawFilteredAnnouncements = window.util.debounce(drawFilteredAnnouncements, DEBOUNCE_INTERVAL);
      var announcementsFilters = document.querySelectorAll('.map__filter, .map__checkbox');
      announcementsFilters.forEach(function (filter) {
        filter.addEventListener('change', function () {
          debouncedDrawFilteredAnnouncements();
        });
      });

      /* Export namespace */
      window.announcement = {
        clearPinsArea: clearPinsArea,
        drawFilteredAnnouncements: drawFilteredAnnouncements
      };
    }, function () {
      var errorElement = errorTemplate.cloneNode(true);

      var removeErrorElement = function () {
        var currentError = main.querySelector('.error');
        if (currentError) {
          main.removeChild(currentError);
        }
      };

      var onErrorClick = function () {
        removeErrorElement();
        loadAnnouncements();
      };

      var onErrorEscKeydown = function (keydownEvt) {
        if (keydownEvt.keyCode === window.util.KeyCodes.ESC) {
          removeErrorElement();
          loadAnnouncements();
        }
      };

      errorElement.addEventListener('click', onErrorClick);
      document.addEventListener('keydown', onErrorEscKeydown);

      main.appendChild(errorElement);
    });
  };

  loadAnnouncements();
})();
