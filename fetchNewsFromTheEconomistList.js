var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var levelup = require('level');

var lineReader = require('readline').createInterface({
    input: fs.createReadStream('data/TheEconomistNewsItems.list')
});

var db = levelup('data/dedup.db');

lineReader.on('line', function(line) {
    try {
        var post = JSON.parse(line);
        db.get(post['umd5'], function (err, value) {
            if (err) { // likely the key was not found
                rp({uri: post['link'],
                    timeout: 15000,
                    proxy: 'http://127.0.0.1:8123',
                    transform: function(body) {
                        return cheerio.load(body);
                    }}).then(function($) {
                        var content = $('#column-content > article > div.main-content > p').text();
                        if (content.length > 0) {
                            db.put(post['umd5'], post['link'], function (err) {
                                post['content'] = content;
                                fs.appendFileSync("data/TheEconomistNews.list", JSON.stringify(post) + "\n");
                            });
                        }
                    }).catch(function(err) {

                    });
            }
        });
    } catch(e) {
    }
});



