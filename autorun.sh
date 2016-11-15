#!/bin/bash

node fetchNewsItemsFromBBCFeed.js
node fetchNewsFromBBCList.js

node fetchNewsItemsFromTheEconomistFeed.js
node fetchNewsFromTheEconomistList.js

cat data/BBCNews.list data/TheEconomistNews.list > data/AllNews.list
node genNormalNews.js > data/AllNormalNews.txt

# scp data/AllNormalNews.txt zhubolong@172.22.0.24:/home/zhubolong/en2chTranslate-deploy/data/text/

exit 0

