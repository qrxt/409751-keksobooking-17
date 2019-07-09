'use strict';

(function () {
  var main = document.querySelector('main');
  var map = document.querySelector('.map');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  var adFormTitleInput = adForm.querySelector('input[name="title"]');
  var adFormHousingTypeSelect = adForm.querySelector('select[name="type"]');
  var adFormPriceInput = adForm.querySelector('[name="price"]');
  var adFormTime = adForm.querySelector('.ad-form__element--time');
  var adFormTimeIn = adForm.querySelector('[name="timein"]');
  var adFormTimeOut = adForm.querySelector('[name="timeout"]');
  var adFormDescriptionTextarea = adForm.querySelector('#description');

  var adFormRoomsSelect = adForm.querySelector('select[name="rooms"]');
  var adFormCapacitySelect = adForm.querySelector('select[name="capacity"]');

  var adFormSubmitBtn = adForm.querySelector('.ad-form__submit');

  var resetBtn = document.querySelector('.ad-form__reset');

  var errorTemplate = document
    .querySelector('#error')
    .content
    .querySelector('.error');

  var successTemplate = document
  .querySelector('#success')
  .content
  .querySelector('.success');

  var minPricesByHousingTypes = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  adFormFieldsets.forEach(window.util.toggleBlocking);

  adFormHousingTypeSelect.addEventListener('change', function () {
    var fittingMinPrice = minPricesByHousingTypes[adFormHousingTypeSelect.value];

    adFormPriceInput.min = fittingMinPrice;
    adFormPriceInput.placeholder = fittingMinPrice;
  });

  adFormTime.addEventListener('change', function (evt) {
    if (evt.target === adFormTimeIn) {
      adFormTimeOut.selectedIndex = adFormTimeIn.selectedIndex;
    } else {
      adFormTimeIn.selectedIndex = adFormTimeOut.selectedIndex;
    }
  });

  /* Валидация соотношения количества мест и гостей */
  var validateRoomsQuantityToCapacity = function () {
    var NOT_FOR_GUESTS = 0;
    var roomsQuantityToCapacityRatios = {
      1: [1],
      2: [1, 2],
      3: [1, 2, 3],
      100: [NOT_FOR_GUESTS]
    };

    var currentCapacity = roomsQuantityToCapacityRatios[adFormRoomsSelect.value];
    var currentMaxCapacity = Math.max.apply(null, currentCapacity);
    var currentRoomsQuantity = Number(adFormCapacitySelect.value);


    var getFittingErrorString = function () {
      var validationErrorString = 'В указанное количество комнат поместится максимум ';
      var notForGuestsErrorString = 'Для выбранного количества комнат подойдет только категория "Не для гостей"';

      if (currentMaxCapacity === NOT_FOR_GUESTS) {
        return notForGuestsErrorString;
      } else {
        return validationErrorString + currentMaxCapacity + ' гостей.';
      }
    };

    if (currentCapacity.includes(currentRoomsQuantity)) {
      adFormRoomsSelect.setCustomValidity('');
    } else {
      adFormRoomsSelect.setCustomValidity(getFittingErrorString());
    }
  };

  [adFormRoomsSelect, adFormCapacitySelect].forEach(function (select) {
    select.addEventListener('change', validateRoomsQuantityToCapacity);
  });
  validateRoomsQuantityToCapacity();

  /* Отправка данных из формы на сервер */

  var resetInputsState = function () {
    adFormTitleInput.value = '';
    adFormPriceInput.value = '';
    adFormDescriptionTextarea.value = '';
  };

  var disableFieldsets = function () {
    adFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = true;
    });

    adForm.classList.add('ad-form--disabled');
  };

  var resetPageState = function () {
    map.classList.add('map--faded');
    window.clearPinsArea();
    window.clearCardsArea();
    window.resetMainPinPosition();

    resetInputsState();
    disableFieldsets();
  };

  adFormSubmitBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (adForm.checkValidity()) {
      var data = new FormData(document.querySelector('.ad-form'));
      data.append('address', document.querySelector('.ad-form #address').value);

      var url = 'https://js.dump.academy/keksobooking';
      var send = window.request('POST', url, data);

      send(function () {
        var success = successTemplate.cloneNode(true);
        var removeSuccessMessage = function () {
          main.removeChild(success);
          success.removeEventListener('click', removeSuccessMessage);
        };
        var removeSuccessMessageByKeyboard = function (keydownEvt) {
          if (keydownEvt.keyCode === window.util.KeyCodes.ESC) {
            main.removeChild(success);
            document.removeEventListener('keydown', removeSuccessMessageByKeyboard);
          }
        };

        resetPageState();

        success.addEventListener('click', removeSuccessMessage);
        document.addEventListener('keydown', removeSuccessMessageByKeyboard);
        main.appendChild(success);
      }, function () {
        var error = errorTemplate.cloneNode(true);
        var removeErrorMessage = function () {
          main.removeChild(error);
          error.removeEventListener('click', removeErrorMessage);
        };
        var removeErrorMessageByKeyboard = function (keydownEvt) {
          if (keydownEvt.keyCode === window.util.KeyCodes.ESC) {
            main.removeChild(error);
            document.removeEventListener('keydown', removeErrorMessageByKeyboard);
          }
        };

        error.addEventListener('click', removeErrorMessage);
        document.addEventListener('keydown', removeErrorMessageByKeyboard);
        main.appendChild(error);
      });
    } else {
      adForm.reportValidity();
    }
  });

  /* Мануальный сброс состояния страницы */

  resetBtn.addEventListener('click', resetPageState);
})();
