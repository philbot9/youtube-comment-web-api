var async = require('async');
var getCommentsPage = require('./comment-api.js');
var getCommentReplies = require('./replies-api.js');
var parseComments = require('./comment-parser.js');

var REQUEST_RETRIES = 3;

module.exports = function(videoID, pageToken, cb) {
  if(!videoID) throw new Error('No video ID specified.');
  var commentsRetries = REQUEST_RETRIES;

  var commentsPageCB = function(error, response) {
    if(error) {
      if(commentsRetries-- > 0) {
        console.error("Error retrieving comments page: [STATUS " + error.status + "]. Retrying...");
        return getCommentsPage(videoID, pageToken, commentsPageCB);
      } else {
        return cb(error);
      }
    }
    commentsRetries = REQUEST_RETRIES;
    
    var page = {
      comments: parseComments(response.html).comments,
      nextPageToken: response.nextPageToken
    };

    var asyncIterator = function(comment, callback) {
      if(!comment.hasReplies) return callback(null, comment);
      
      var repliesRetries = REQUEST_RETRIES;

      var commentRepliesCB = function(error, response) {
        if(error) {
          if(repliesRetries-- > 0) {
            console.error("Error retrieving replies [STATUS " + error.status + "]. Retrying...");
            return getCommentReplies(videoID, comment.id, commentRepliesCB);
          } else {
            return callback(error);
          }
        }
        repliesRetries = REQUEST_RETRIES;
        comment.replies = parseComments(response.html, {includeReplies: true}).comments;
        callback(null, comment);
      };
      getCommentReplies(videoID, comment.id, commentRepliesCB);
    };

    var asyncCallback = function(error, commentsAndReplies) {
      if(error) return cb(error);
      page.comments = commentsAndReplies;
      cb(null, page);
    };

    async.map(page.comments,
      asyncIterator.bind(this),
      asyncCallback.bind(this));
  };
  
  getCommentsPage(videoID, pageToken, commentsPageCB);
};
