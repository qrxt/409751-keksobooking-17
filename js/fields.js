'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  adFormFieldsets.forEach(window.util.toggleBlocking);

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
})();
