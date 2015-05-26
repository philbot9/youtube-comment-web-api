var express = require('express');
var router = express.Router();

var getCommentPage = require('../lib/comment-pager');

// POST comment Page - returns a page of comments including replies
router.post('/', function(req, res, next) {
  if(!req.body) return res.status(400);
  
  var videoID = req.body.videoID || null;
  if(!videoID) {
   return res.status(400).json({
      error: 'Missing field \'videoID\''
    });
  }
  
  var pageToken = req.body.pageToken || null;
 
  getCommentPage(videoID, pageToken, function(error, page){
    if(error) {
      console.error(error);
      return res.status(400).json({
        error: 'Fetching comment page failed.'
      });
    }

    res.status(200).json({
      pageToken: req.body.pageToken,
      nextPageToken: page.nextPageToken,
      comments: page.comments
    });
  });
});

module.exports = router;
