var map = document.querySelector(".map");

/* У блока .map уберем класс faded для перехода в активный режим */

map.classList.remove("map--faded");

/* Сгенерируем массив, состоящий из 8 объектов объявлений */

var housingTypes = ["palace", "flat", "house", "bungalo"];
var announcements = [];

var generateAnnouncement = function (avatarIndex, type, x, y) {
  return {
    "author": {
      "avatar": (avatarIndex < 10) ? "0" + avatarIndex : avatarIndex
    },
    "offer": {
      type
    },
    "location": {
      x, y
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
  var currentX = 0;
  var currentY = 0;
};
