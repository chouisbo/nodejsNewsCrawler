var fs = require('fs');

var lineReader = require('readline').createInterface({
    input: fs.createReadStream('data/AllNews.list')
});

lineReader.on('line', function(line) {
    var post = JSON.parse(line);
    console.log(post['content']);
});



