'use strict';

(function () {
  window.util = {
    MIN_AVAILABLE_Y: 130,
    MAX_AVAILABLE_Y: 630,
    KeyCodes: {
      ESC: 27,
      SPACE: 32
    },
    PinSize: {
      WIDTH: 50,
      HEIGHT: 70
    },
    FILE_TYPES: ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png'],

    getRandomArrayItem: function (array) {
      return array[Math.round(Math.random() * (array.length - 1))];
    },
    getRandomInteger: function (min, max) {
      var random = min + Math.random() * (max + 1 - min);
      return Math.floor(random);
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
    isInRange: function (low, high) {
      return function (value) {
        return value >= low && value <= high;
      };
    },
    includesArray: function (haystack, needle) {
      return needle.every(function (item) {
        return haystack.indexOf(item) > -1;
      });
    },
    debounce: function (func, time) {
      var lastTimeout;

      return function () {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = setTimeout(func, time);
      };
    },
    preventDragNDropDefaults: function (dropArea) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evtName) {
        dropArea.addEventListener(evtName, function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
        });
      });
    },
    uploadFile: function (file, toDoCallback) {
      if (file && window.util.FILE_TYPES.includes(file.type)) {
        var fileReader = new FileReader();

        fileReader.addEventListener('load', function (evt) {
          toDoCallback(evt);
        });

        fileReader.readAsDataURL(file);
      }
    },
    insertAfter: function (elem, refElem) {
      var parent = refElem.parentNode;
      var next = refElem.nextSibling;
      if (next) {
        return parent.insertBefore(elem, next);
      } else {
        return parent.appendChild(elem);
      }
    }

  };
})();
