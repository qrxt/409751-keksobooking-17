"use strict";

var map = document.querySelector(".map");
var mapPinsArea = map.querySelector(".map__pins");

/* У блока .map уберем класс faded для перехода в активный режим */

map.classList.remove("map--faded"); // временно

/* Сгенерируем массив, состоящий из 8 объектов объявлений */

var housingTypes = ["palace", "flat", "house", "bungalo"];
var announcements = [];

var makeAvatarPathString = function (index) {
  var expandedIndex = (index < 10) ? "0" + index : index;

  return "img/avatars/user" + expandedIndex + ".png";
};

var generateAnnouncement = function (avatarIndex, type, x, y) {
  return {
    "author": {
      "avatar": makeAvatarPathString(avatarIndex)
    },
    "offer": {
      type
    },
    "location": {
      x: x + "px",
      y: y + "px"
    }
  };
};

var getRandomArrayItem = function (arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

var randomInteger = function (from, to) {
  return Math.floor(Math.random() * to) + from;
};

for (var i = 1; i < 9; i++) {
  var currentType = getRandomArrayItem(housingTypes);
  var currentX = randomInteger(0, mapPinsArea.offsetWidth);
  var currentY = randomInteger(130, 630);

  var announcement = generateAnnouncement(i, currentType, currentX, currentY);
  announcements.push(announcement);
};

/* Создадим DOM-элементы на основе сгенерированных данных */

var pinTemplate = document
  .querySelector("#pin")
  .content
  .querySelector(".map__pin");

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementCover = pinElement.querySelector("img");

  pinElement.style.left = pin.location.x;
  pinElement.style.top = pin.location.y;
  pinElementCover.src = pin.author.avatar;
  pinElementCover.alt = "asd";

  return pinElement;
}

var fragment = document.createDocumentFragment();
for (var i = 0; i < announcements.length; i++) {
  fragment.appendChild(renderPin(announcements[i]));
}
mapPinsArea.appendChild(fragment);

/*

  Проверить все ли аватарки задействуются
  Проверить и дописать alt для пинов
  Пофиксить неверные рамки местоположений пинов

*/
