'use strict';

(function () {
  window.util = {
    map: document.querySelector('.map'),
    mapPinsArea: document.querySelector('.map__pins'),

    MIN_AVAILABLE_Y: 130,
    MAX_AVAILABLE_Y: 630,
    KeyCodes: {
      'ESC': 27
    },
    PinSize: {
      WIDTH: 50,
      HEIGHT: 70
    },

    getRandomArrayItem: function (arr) {
      return arr[Math.round(Math.random() * (arr.length - 1))];
    },
    getRandomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },
    makeAvatarPathString: function (index) {
      var expandedIndex = (index < 10) ? '0' + index : index;
      return 'img/avatars/user' + expandedIndex + '.png';
    },
    toggleBlocking: function (fieldset) {
      fieldset.disabled = !fieldset.disabled;
    },
    pipe: function () {
      var innerArgs = arguments;
      return function (data) {
        return Array
          .from(innerArgs)
          .reduce(function (acc, currentFunc) {
            return currentFunc(acc);
          }, data);
      };
    },
    inRange: function (low, high) {
      return function (value) {
        return value >= low && value <= high;
      };
    },
    includesArr: function (haystack, needle) {
      return needle.every(function (item) {
        return haystack.indexOf(item) > -1;
      });
    }
  };
})();
