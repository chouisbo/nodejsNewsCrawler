var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var levelup = require('level');

var lineReader = require('readline').createInterface({
    input: fs.createReadStream('data/TheEconomistNewsItems.list')
});

var db = levelup('data/dedup.db');

lineReader.on('line', function(line) {
    var post = JSON.parse(line);
    rp({uri: post['link'],
        proxy: 'http://127.0.0.1:8123',
        transform: function(body) {
            return cheerio.load(body);
        }}).then(function($) {
            var content = $('#column-content > article > div.main-content > p').text();
            if (content.length > 0) {
                db.get(post['umd5'], function (err, value) {
                    if (err) { // likely the key was not found
                        db.put(post['umd5'], post['link'], function (err) {
                            post['content'] = content;
                            console.log(JSON.stringify(post));
                        });
                    }
                });
            }
        }).catch(function(err) {

        });
});
