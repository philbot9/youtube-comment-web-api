var xhr = require('./xhr-helper.js');

/* 
 * IMPORTANT:
 * Youtube expects a session token AND a Cookie with each ajax request. The regular
 * XMLHttpRequest does not send cookies, so this uses the xmlhttprequest-cookie module.
 * The cookie is received when requesting the comment website (YT_COMMENTS_URL).
 */

module.exports = initializeSession;

var YT_COMMENTS_URL = "https://www.youtube.com/all_comments?v=";
var sessionToken;

function initializeSession(videoID, callback) {
  if(sessionToken)
    return callback(null, sessionToken);

  xhr.get(YT_COMMENTS_URL + videoID, function(res){
    if(res.status != 200) {
      var e = new Error("Unable to retrieve video page.");
      e.status = res.status;
      return callback(e);
    }
    
    var re = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/;
    var m = re.exec(res.responseText.toString());

    if(!m)
      return callback(new Error("Unable to find session token"));
    if(m.length <= 1)
      return callback(new Error("Unable to find session token"));
    if(xhr.CookieJar.cookieList.length === 0)
      return callback(new Error("No cookie received"));

    sessionToken = m[1],

    //set a timeout. The token or cookie will expire at some point
    setTimeout(function(){
      sessionToken = null;
    }, (1000 * 60 * 30));

    callback(null, sessionToken);
  });
}
