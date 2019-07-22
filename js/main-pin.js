'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');

  var mapPinMain = mapPinsArea.querySelector('.map__pin--main');
  var mapPinMainStartX = mapPinMain.offsetLeft;
  var mapPinMainStartY = mapPinMain.offsetTop;
  var mapPinMainText = mapPinMain.querySelector('svg text');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  var getMapRightBoundaryX = function () {
    return mapPinsArea.offsetWidth - mapPinMain.offsetWidth;
  };

  var fillAddressWithCurrentCoordinates = function () {
    var pinMainCenterX = mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2);
    var pinMainBottomY = mapPinMain.offsetTop + mapPinMain.offsetHeight;
    var coordinatesString = pinMainCenterX + ', ' + pinMainBottomY;

    var adFormAddressInput = adForm.querySelector('input[name="address"]');
    adFormAddressInput.value = coordinatesString;
  };

  /* Блокировка главного пина до загрузки данных с сервера */

  window.initialMainPinText = mapPinMainText.innerHTML;
  mapPinMainText.innerHTML = '<textPath xlink:href="#tophalf" startOffset="0">Загрузка объявлений...</textPath>';

  mapPinMain.disabled = true;

  /* Drag-n-drop для пина */

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var cursorStartCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinStartCoordinates = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var cursorShift = {
        x: moveEvt.clientX - cursorStartCoordinates.x,
        y: moveEvt.clientY - cursorStartCoordinates.y
      };

      var shiftedPin = {
        x: pinStartCoordinates.x + cursorShift.x,
        y: pinStartCoordinates.y + cursorShift.y
      };

      var isInLeftBoundary = shiftedPin.x > 0 - (mapPinMain.offsetWidth / 2);
      var isInRightBoundary = shiftedPin.x < getMapRightBoundaryX() + mapPinMain.offsetWidth / 2;
      var isInTopBoundary = shiftedPin.y > window.util.MIN_AVAILABLE_Y - mapPinMain.offsetHeight;
      var isInBottomBoundary = shiftedPin.y < window.util.MAX_AVAILABLE_Y;

      if (isInLeftBoundary && isInRightBoundary) {
        mapPinMain.style.left = shiftedPin.x + 'px';
      }

      if (isInTopBoundary && isInBottomBoundary) {
        mapPinMain.style.top = shiftedPin.y + 'px';
      }

      fillAddressWithCurrentCoordinates();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (map.classList.contains('map--faded')) {
        window.loadAnnouncements();
      }
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      adFormFieldsets.forEach(function (fieldset) {
        if (fieldset.disabled) {
          fieldset.disabled = false;
        }
      });

      fillAddressWithCurrentCoordinates();

      if (mapPinMain.offsetLeft < 0) {
        mapPinMain.style.left = 0 + 'px';
      }

      if (mapPinMain.offsetLeft > getMapRightBoundaryX()) {
        mapPinMain.style.left = getMapRightBoundaryX() + 'px';
      }

      if (mapPinMain.offsetTop < window.util.MIN_AVAILABLE_Y - mapPinMain.offsetHeight) {
        mapPinMain.style.top = window.util.MIN_AVAILABLE_Y + 'px';
      }

      if (mapPinMain.offsetTop > window.util.MAX_AVAILABLE_Y) {
        mapPinMain.style.top = window.util.MAX_AVAILABLE_Y + 'px';
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onMapPinMouseUp = function () {
    window.announcement.drawFilteredAnnouncements();
  };

  mapPinMain.addEventListener('mouseup', onMapPinMouseUp);

  /* Exports */
  window.resetMainPinPosition = function () {
    mapPinMain.style.left = mapPinMainStartX + 'px';
    mapPinMain.style.top = mapPinMainStartY + 'px';
    fillAddressWithCurrentCoordinates();
  };
})();
