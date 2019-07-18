'use strict';

(function () {
  var NOT_FOR_GUESTS = 0;

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

  var adFormAvatarImage = adForm.querySelector('.ad-form-header__preview img');

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

  var onSelectChange = function () {
    validateRoomsQuantityToCapacity();
  };

  [adFormRoomsSelect, adFormCapacitySelect].forEach(function (select) {
    select.addEventListener('change', onSelectChange);
  });
  validateRoomsQuantityToCapacity();

  /* Отправка данных из формы на сервер */

  var resetInputsState = function () {
    adFormAvatarImage.src = 'img/muffin-grey.svg';
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
          var successMessage = main.querySelector('.success');
          if (successMessage) {
            main.removeChild(successMessage);
          }
        };

        var onSuccessClick = function () {
          removeSuccessMessage();
          success.removeEventListener('click', onSuccessClick);
        };

        var onSuccessEscKeydown = function (keydownEvt) {
          if (keydownEvt.keyCode === window.util.KeyCodes.ESC) {
            removeSuccessMessage();
            document.removeEventListener('keydown', onSuccessEscKeydown);
          }
        };

        resetPageState();

        success.addEventListener('click', onSuccessClick);
        document.addEventListener('keydown', onSuccessEscKeydown);
        main.appendChild(success);
      }, function () {
        var error = errorTemplate.cloneNode(true);
        var removeErrorMessage = function () {
          var errorMessage = main.querySelector('.error');
          if (errorMessage) {
            main.removeChild(error);
          }
        };
        var onErrorClick = function () {
          removeErrorMessage();
          document.removeEventListener('keydown', onErrorClick);
        };
        var onErrorEscKeydown = function (keydownEvt) {
          if (keydownEvt.keyCode === window.util.KeyCodes.ESC) {
            removeErrorMessage();
            document.removeEventListener('keydown', onErrorEscKeydown);
          }
        };

        error.addEventListener('click', onErrorClick);
        document.addEventListener('keydown', onErrorEscKeydown);
        main.appendChild(error);
      });
    } else {
      adForm.reportValidity();
    }
  });

  /* Мануальный сброс состояния страницы */

  var onResetBtnClick = function () {
    resetPageState();
  };

  resetBtn.addEventListener('click', onResetBtnClick);

  /* Подсветка для областей загрузки файлов при drag-n-drop */

  var dropZonesLabels = adForm.querySelectorAll('.ad-form-header__drop-zone, .ad-form__drop-zone');

  dropZonesLabels.forEach(function (zone) {
    window.util.preventDragNDropDefaults(zone);

    zone.addEventListener('dragenter', function () {
      zone.style.color = '#ff5635';
    });

    ['dragleave', 'drop'].forEach(function (dragEvt) {
      zone.addEventListener(dragEvt, function () {
        zone.style.color = '';
      });
    });
  });

  /* Установка поведения Drag-n-drop для изображений жилища */

  var resetImageBacklight = function (image) {
    image.style.boxShadow = '';
  };

  var initHousingImagesDragNDropBehavior = function (renderedHousingImage) {
    window.util.preventDragNDropDefaults(renderedHousingImage);
    renderedHousingImage.addEventListener('dragstart', function (evt) {
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('text/plain', null);
      current = renderedHousingImage;
    });

    renderedHousingImage.addEventListener('dragover', function (evt) {
      if (evt.target !== current) {
        if (evt.offsetX > Math.floor(evt.target.offsetWidth / 2)) {
          evt.target.style.boxShadow = '3px 0px 0px 0px #ff5635';
        } else {
          evt.target.style.boxShadow = '-3px 0px 0px 0px #ff5635';
        }
      }
    });

    renderedHousingImage.addEventListener('dragleave', function (evt) {
      resetImageBacklight(evt.target);
    });

    renderedHousingImage.addEventListener('drop', function (evt) {
      resetImageBacklight(evt.target);
      if (evt.offsetX > Math.floor(evt.target.offsetWidth / 2)) {
        if (evt.target.nextElementSibling) {
          window.util.insertAfter(current, evt.target);
        } else {
          evt.target.parentNode.appendChild(current);
        }
      } else {
        evt.target.parentNode.insertBefore(current, evt.target);
      }
    });
  };

  /* fileChooser Загрузка аватара */

  var avatarFileChooser = adForm.querySelector('.ad-form-header__input');

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];

    window.util.uploadFile(file, function (evt) {
      adFormAvatarImage.src = evt.target.result;
    });
  });

  /* Drag-n-drop загрузка аватарки */

  var avatarDropArea = document.querySelector('.ad-form-header__drop-zone');

  window.util.preventDragNDropDefaults(avatarDropArea);
  avatarDropArea.addEventListener('drop', function (evt) {
    var file = evt.dataTransfer.files[0];

    window.util.uploadFile(file, function (loadEvt) {
      adFormAvatarImage.src = loadEvt.target.result;
    });
  });

  /* fileChooser загрузка изображений жилища */

  var adFormHousingImagesContainer = document.querySelector('.ad-form__photo-container');

  var housingImagesFileChooser = adForm.querySelector('.ad-form__input');

  var current;

  housingImagesFileChooser.addEventListener('change', function () {
    var file = housingImagesFileChooser.files[0];

    window.util.uploadFile(file, function (loadEvt) {
      var housingImage = new window.HousingImage(loadEvt.target.result);

      var rendered = housingImage.render();

      initHousingImagesDragNDropBehavior(rendered);

      document.querySelectorAll('.ad-form__photo')[0].style.display = 'none';
      adFormHousingImagesContainer.appendChild(rendered);
    });
  });

  /* Drag-n-drop загрузка изображения жилища */

  var adFormHousingImagesDropArea = adForm.querySelector('.ad-form__drop-zone');

  window.util.preventDragNDropDefaults(adFormHousingImagesDropArea);
  adFormHousingImagesDropArea.addEventListener('drop', function (evt) {
    var files = evt.dataTransfer.files;

    Array.from(files).forEach(function (file) {
      window.util.uploadFile(file, function (loadEvt) {
        var housingImage = new window.HousingImage(loadEvt.target.result);

        var rendered = housingImage.render();

        initHousingImagesDragNDropBehavior(rendered);
        adFormHousingImagesContainer.appendChild(rendered);
      });
    });

    document.querySelectorAll('.ad-form__photo')[0].style.display = 'none';
  });
})();
