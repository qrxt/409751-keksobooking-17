'use strict';

(function () {
  var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var ANNOUNCEMENTS_TITLES = [
    'Первое', 'Второе', 'Третье', 'Четвертое',
    'Пятое', 'Шестое', 'Седьмое', 'Восьмое'
  ];

  var generateAnnouncement = function (avatarIndex, type, announcementTitle, x, y) {
    return {
      'author': {
        'avatar': window.util.makeAvatarPathString(avatarIndex),
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

  var fillAnnouncements = function () {
    return ANNOUNCEMENTS_TITLES.map(function (item, i) {
      var currentType = window.util.getRandomArrayItem(HOUSING_TYPES);
      var currentX = window.util.getRandomInteger(0, window.util.mapPinsArea.offsetWidth - window.util.PinSize.WIDTH);
      var currentY = window.util.getRandomInteger(window.util.MIN_AVAILABLE_Y, window.util.MAX_AVAILABLE_Y - window.util.PinSize.HEIGHT);
      var currentTitle = ANNOUNCEMENTS_TITLES[i];

      return generateAnnouncement(i + 1, currentType, currentTitle, currentX, currentY);
    });
  };

  /* Создание DOM-элементов */

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

  /* Exports */
  window.util.drawAnnouncements = function () {
    announcements.forEach(function (item) {
      fragment.appendChild(renderPin(item));
    });
    window.util.mapPinsArea.appendChild(fragment);
  };
})();
