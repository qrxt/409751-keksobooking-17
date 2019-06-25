'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsArea = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  var fragment = document.createDocumentFragment();
  var pinTemplate = document
    .querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var url = 'https://js.dump.academy/keksobooking/data';
  window.load(url, function (response) {
    response.forEach(function (announcement) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinElementCover = pinTemplate.querySelector('img');

      pinElement.style.left = announcement.location.x + 'px';
      pinElement.style.top = announcement.location.y + 'px';
      pinElementCover.src = announcement.author.avatar;
      pinElementCover.alt = announcement.offer.title;

      fragment.appendChild(pinElement);
    });

    var showElements = function () {
      setTimeout(function () {
        mapPinsArea.appendChild(fragment);
      }, 100);
      mapPinMain.removeEventListener('mouseup', showElements);
    };
    mapPinMain.addEventListener('mouseup', showElements);
  }, function () {
    /* Функциональность при ошибке */
  });
})();
