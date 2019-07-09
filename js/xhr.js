'use strict';

(function () {
  var XHR_TIMEOUT_IN_MS = 10000;

  var XHR_STATUS_OK = 200;

  window.request = function (method, url, data) {
    return function (onSuccess, onError) {
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

      xhr.timeout = XHR_TIMEOUT_IN_MS;
      xhr.open(method, url);
      if (method === 'GET') {
        xhr.send();
      } else if (method === 'POST') {
        xhr.send(data);
      }
    };
  };
})();
