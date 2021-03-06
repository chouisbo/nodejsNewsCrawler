
var request = require('request'),
    FeedParser = require('feedparser'),
    Iconv = require('iconv').Iconv;

function fetch(feed, proxyUrl, feedHandler) {
    // Define our streams
    var req = request(feed, {
        proxy: proxyUrl,
        timeout: 10000,
        pool: false
    });
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    // Define our handlers
    req.on('error', done);
    req.on('response', function(res) {
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
        var charset = getParams(res.headers['content-type'] || '').charset;
        res = maybeTranslate(res, charset);
        // And boom goes the dynamite
        res.pipe(feedparser);
    });

    feedparser.on('error', done);
    feedparser.on('end', done);
    feedparser.on('readable', feedHandler);
}

function maybeTranslate(res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch (err) {
            res.emit('error', err);
        }
    }
    return res;
}

function getParams(str) {
    var params = str.split(';').reduce(function(params, param) {
        var parts = param.split('=').map(function(part) {
            return part.trim();
        });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

function done(err) {
    if (err) {
        console.log(err, err.stack);
        return process.exit(1);
    }
    process.exit();
}

// ##################################################################

var fs = require('fs');
var level = require('level');
var Post = require('./Post.js');

var printFeedHandler = function(siteId, boardId) {
    return function() {
        var item;
        while (item = this.read()) {
            var post = new Post(siteId, boardId, 
                                item.title, item.link,
                                item.pubDate, item.description);
            fs.appendFileSync("data/TheEconomistNewsItems.list", JSON.stringify(post) + "\n");
        }
    }
}

var TheEconomistFeeds = JSON.parse(fs.readFileSync('./config/feed/TheEconomistRSSFeed.json'));
TheEconomistFeeds.forEach(function (element) {
    fetch(element.url, 'http://127.0.0.1:8123', printFeedHandler(element.siteId, element.boardId));
});

