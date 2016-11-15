
var md5 = require('md5');
var moment = require('moment');

var Post = function(siteId, boardId, title, link, pubDate, description) {
    this.siteId = siteId;
    this.boardId = boardId;
    this.title = title;
    this.link = link;
    this.umd5 = md5(link);
    this.pubDateString = pubDate;
    this.pubDate = moment.utc(pubDate).unix();
    this.description = description;
}

module.exports=Post;
