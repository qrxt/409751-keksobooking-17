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

  var RIGHT_BOUNDARY_X = mapPinsArea.offsetWidth - mapPinMain.offsetWidth;

  var fillAddressWithCurrentCoords = function () {
    var pinMainCenterX = mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2);
    var pinMainBottomY = mapPinMain.offsetTop + mapPinMain.offsetHeight;
    var coordsString = pinMainCenterX + ', ' + pinMainBottomY;

    var adFormAddressInput = adForm.querySelector('input[name="address"]');
    adFormAddressInput.value = coordsString;
  };

  /* Блокировка главного пина до загрузки данных с сервера */

  window.initialMainPinText = mapPinMainText.innerHTML;
  mapPinMainText.innerHTML = '<textPath xlink:href="#tophalf" startOffset="0">Загрузка объявлений...</textPath>';

  mapPinMain.disabled = true;

  /* Drag-n-drop для пина */

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var cursorStartCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinStartCoords = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var cursorShift = {
        x: moveEvt.clientX - cursorStartCoords.x,
        y: moveEvt.clientY - cursorStartCoords.y
      };

      var shiftedPin = {
        x: pinStartCoords.x + cursorShift.x,
        y: pinStartCoords.y + cursorShift.y
      };

      var isInLeftBoundary = shiftedPin.x > 0 - (mapPinMain.offsetWidth / 2);
      var isInRightBoundary = shiftedPin.x < RIGHT_BOUNDARY_X + mapPinMain.offsetWidth / 2;
      var isInTopBoundary = shiftedPin.y > window.util.MIN_AVAILABLE_Y - mapPinMain.offsetHeight;
      var isInBottomBoundary = shiftedPin.y < window.util.MAX_AVAILABLE_Y;

      if (isInLeftBoundary && isInRightBoundary) {
        mapPinMain.style.left = shiftedPin.x + 'px';
      }

      if (isInTopBoundary && isInBottomBoundary) {
        mapPinMain.style.top = shiftedPin.y + 'px';
      }

      fillAddressWithCurrentCoords();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      adFormFieldsets.forEach(function (fieldset) {
        if (fieldset.disabled) {
          fieldset.disabled = false;
        }
      });

      fillAddressWithCurrentCoords();

      if (mapPinMain.offsetLeft < 0) {
        mapPinMain.style.left = 0 + 'px';
      }

      if (mapPinMain.offsetLeft > RIGHT_BOUNDARY_X) {
        mapPinMain.style.left = RIGHT_BOUNDARY_X + 'px';
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

    var drawPins = function () {
      window.drawFilteredAnnouncements();
      mapPinMain.removeEventListener('mouseup', drawPins);
    };

    mapPinMain.addEventListener('mouseup', drawPins);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  /* Exports */
  window.resetMainPinPosition = function () {
    mapPinMain.style.left = mapPinMainStartX + 'px';
    mapPinMain.style.top = mapPinMainStartY + 'px';
    fillAddressWithCurrentCoords();
  };
})();
