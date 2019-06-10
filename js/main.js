'use strict';

var map = document.querySelector('.map');
var mapPinsArea = map.querySelector('.map__pins');
var PinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

/* У блока .map уберем класс faded для перехода в активный режим */

map.classList.remove('map--faded'); // временно

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
  var announcements = [];
  for (var i = 1; i < ANNOUNCEMENTS_TITLES.length + 1; i++) {
    var currentType = getRandomArrayItem(HOUSING_TYPES);
    var currentX = getRandomInteger(0, mapPinsArea.offsetWidth - PinSize.WIDTH);
    var currentY = getRandomInteger(MIN_AVAILABLE_Y, MAX_AVAILABLE_Y - PinSize.HEIGHT);
    var currentTitle = ANNOUNCEMENTS_TITLES[i - 1];

    var announcement = generateAnnouncement(i, currentType, currentTitle, currentX, currentY);
    announcements.push(announcement);
  }

  return announcements;
};

/* Создадим DOM-элементы на основе сгенерированных данных */

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

var announcements = fillAnnouncements();
var fragment = document.createDocumentFragment();

for (var i = 0; i < announcements.length; i++) {
  fragment.appendChild(renderPin(announcements[i]));
}

mapPinsArea.appendChild(fragment);
