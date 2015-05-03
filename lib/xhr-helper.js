var xhrc = require('xmlhttprequest-cookie');
var XMLHttpRequest = xhrc.XMLHttpRequest;
var CookieJar = xhrc.CookieJar;
var querystring = require('querystring');

module.exports = {
  "get": xhrGet,
  "post": xhrPost,
  "CookieJar": CookieJar
};

// XMLHttpRequest - GET
function xhrGet(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.debug = false;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr);
    }
  };
  xhr.open("GET", url);
  xhr.send();
}

// XMLHttpRequest - POST
function xhrPost(url, params, callback) {
  var xhr = new XMLHttpRequest();
  xhr.debug = false;

  xhr.open("POST", url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr);
    }
  };

  var requestBody;
  if (params) {
    requestBody = querystring.stringify(params, null, null,
        { encodeURIComponent: true });
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }

  xhr.send(requestBody);
}
