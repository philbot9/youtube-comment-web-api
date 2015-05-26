var xhr = require('./xhr-helper');
var requestSessionToken = require('./youtube-session');

var YT_AJAX_URL = "https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter=";

module.exports = function(videoID, pageToken, callback) {
  if(!videoID) throw new Error("No video ID specified.");

  requestSessionToken(videoID, function(error, sessionToken) {
    if(error) return callback(error);

    var params = {
      'session_token': sessionToken
    };

    if(pageToken) {
      params['page_token'] = pageToken; // get a specific comment page
    } else {
      params['video_id'] = videoID; // get the first comment page
    }
      
    xhr.post(YT_AJAX_URL + videoID, params, function(res) {
      if(!res) return callback(new Error("Requesting comments utterly failed."));
      if(res.status != 200) {
        var e = new Error("Requesting replies failed.");
        e.status = res.status;
        return callback(e);
      }

      var commentsPage = {};
      try {
        var commentPageStr = res.responseText.toString().trim();
        commentsPage = JSON.parse(fixEscapeSequences(commentPageStr));
      } catch(e) {
        return callback(new Error("Error parsing Server response: " + e));
      }

      callback(null, {
        html: commentsPage.html,
        nextPageToken: commentsPage['page_token']
      });
    });
  });
};

// clear any invalid escape sequences in a JSON string
var fixEscapeSequences = function(str) {
  /* 
   * Sometimes Youtube uses '\U' which should be '\u'. So try to replace any invalid 
   * escape sequences with their lowercase versions first.
   */
  var re = /[^\\](\\[^"\/\\bfnrtu])/g;
  return str.replace(re, function(m) {
    if(!re.test(m.toLowerCase()))
      return (m[0] + m.substring(1).toLowerCase());
    else
      return (m[0] + "");
  });
};
