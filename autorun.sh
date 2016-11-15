#!/bin/bash

node fetchNewsItemsFromBBCFeed.js > data/BBCNewsItems.list
node fetchNewsItemsFromTheEconomistFeed.js > data/TheEconomistNewsItems.list

node fetchNewsFromBBCList.js >> data/BBCNews.list
node fetchNewsFromTheEconomistList.js >> data/TheEconomistNews.list

cat data/BBCNews.list data/TheEconomistNews.list > data/AllNews.list
node genNormalNews.js > data/AllNormalNews.txt

exit 0

