var express = require('express');
var router = express.Router();

var CommentPager = require('../lib/comment-pager');
var getCommentPage;

/* GET comment Page. */
router.post('/', function(req, res, next) {
  if(!req.body) {
    return res.status(400);
  }
  if(!req.body.videoID) {
    return res.status(400).json({
      error: 'Missing field \'videoID\''
    });
  }

  if(!getCommentPage) {
    try {
      getCommentPage = CommentPager({videoID: req.body.videoID});
    } catch(err) {
      return res.status(400).json({
        error: 'Invalid Video ID'
      });
    }
  }

  getCommentPage(req.body.pageToken, function(error, page){
    if(error) {
      return res.status(400).json({
        error: 'Fetching comment page failed.'
      });
    }
      
    res.status(200).json({
      videoID: req.body.videoID,
      pageToken: req.body.pageToken,
      nextPageToken: page.nextPageToken,
      comments: page.comments
    });
  });
});

module.exports = router;
