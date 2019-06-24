'use strict';

var map = document.querySelector('.map');
var mapPinsArea = map.querySelector('.map__pins');
var PinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');

/* Сгенерируем массив, состоящий из 8 объектов объявлений */

var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ANNOUNCEMENTS_TITLES = [
  'Первое', 'Второе', 'Третье', 'Четвертое',
  'Пятое', 'Шестое', 'Седьмое', 'Восьмое'
];
var MIN_AVAILABLE_Y = 130;
var MAX_AVAILABLE_Y = 630;

var makeAvatarPathString = function (index) {
  var expandedIndex = (index < 10) ? '0' + index : index;

  return 'img/avatars/user' + expandedIndex + '.png';
};

var generateAnnouncement = function (avatarIndex, type, announcementTitle, x, y) {
  return {
    'author': {
      'avatar': makeAvatarPathString(avatarIndex),
      'announcementTitle': announcementTitle
    },
    'offer': {
      'type': type
    },
    'location': {
      x: x + 'px',
      y: y + 'px'
    }
  };
};

var getRandomArrayItem = function (arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

function getRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

var fillAnnouncements = function () {
  return ANNOUNCEMENTS_TITLES.map(function (item, i) {
    var currentType = getRandomArrayItem(HOUSING_TYPES);
    var currentX = getRandomInteger(0, mapPinsArea.offsetWidth - PinSize.WIDTH);
    var currentY = getRandomInteger(MIN_AVAILABLE_Y, MAX_AVAILABLE_Y - PinSize.HEIGHT);
    var currentTitle = ANNOUNCEMENTS_TITLES[i];

    return generateAnnouncement(i + 1, currentType, currentTitle, currentX, currentY);
  });
};

/* Создадим DOM-элементы на основе сгенерированных данных */

var announcements = fillAnnouncements();
var fragment = document.createDocumentFragment();

var pinTemplate = document
  .querySelector('#pin')
  .content
  .querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementCover = pinElement.querySelector('img');

  pinElement.style.left = pin.location.x;
  pinElement.style.top = pin.location.y;
  pinElementCover.src = pin.author.avatar;
  pinElementCover.alt = pin.author.announcementTitle;

  return pinElement;
};

/* Деактивация инпутов форм по умолчанию */
var toggleBlocking = function (fieldset) {
  fieldset.disabled = !fieldset.disabled;
};

adFormFieldsets.forEach(toggleBlocking);

/* Активация страницы */
var mapPinMain = mapPinsArea.querySelector('.map__pin--main');

/* Заполнение формы */
var fillAddressWithCurrentCoords = function () {
  var pinMainCenterX = mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2);
  var pinMainBottomY = mapPinMain.offsetTop + mapPinMain.offsetHeight;
  var coordsString = pinMainCenterX + ', ' + pinMainBottomY;

  var adFormAddressInput = adForm.querySelector('input[name="address"]');
  adFormAddressInput.value = coordsString;
};
/* Валидация полей формы */

var adFormHousingTypeSelect = adForm.querySelector('select[name="type"]');
var adFormPriceInput = adForm.querySelector('[name="price"]');
var adFormTime = adForm.querySelector('.ad-form__element--time');
var adFormTimeIn = adForm.querySelector('[name="timein"]');
var adFormTimeOut = adForm.querySelector('[name="timeout"]');

var minPricesByHousingTypes = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

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

/* Drag-n-drop для маркера */

var rightBoundaryX = mapPinsArea.offsetWidth - mapPinMain.offsetWidth;

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
    var isInRightBoundary = shiftedPin.x < rightBoundaryX + mapPinMain.offsetWidth / 2;
    var isInTopBoundary = shiftedPin.y > MIN_AVAILABLE_Y - mapPinMain.offsetHeight;
    var isInBottomBoundary = shiftedPin.y < MAX_AVAILABLE_Y;

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
    adFormFieldsets.forEach(toggleBlocking);

    setTimeout(function () {
      announcements.forEach(function (item) {
        fragment.appendChild(renderPin(item));
      });
      mapPinsArea.appendChild(fragment);
    }, 100);

    fillAddressWithCurrentCoords();

    if (mapPinMain.offsetLeft < 0) {
      mapPinMain.style.left = 0 + 'px';
    }

    if (mapPinMain.offsetLeft > rightBoundaryX) {
      mapPinMain.style.left = rightBoundaryX + 'px';
    }

    if (mapPinMain.offsetTop < MIN_AVAILABLE_Y - mapPinMain.offsetHeight) {
      mapPinMain.style.top = MIN_AVAILABLE_Y + 'px';
    }

    if (mapPinMain.offsetTop > MAX_AVAILABLE_Y) {
      mapPinMain.style.top = MAX_AVAILABLE_Y + 'px';
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
