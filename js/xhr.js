'use strict';

(function () {
  var XHR_STATUS_OK = 200;

  window.load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === XHR_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError({
          status: xhr.status,
          message: xhr.statusText
        });
      }
    });

    xhr.addEventListener('error', function () {
      onError({
        status: xhr.status,
        message: xhr.statusText
      });
    });

    xhr.addEventListener('timeout', function () {
      onError({
        status: xhr.status,
        message: xhr.statusText
      });
    });

    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();
  };
})();
