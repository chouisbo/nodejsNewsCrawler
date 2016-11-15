# nodejsNewsCrawler
使用Ｎｏｄｅ.js编写的ＲＳＳ新闻采集器，目前可采集ＢＢＣ和ＴｈｅＥｃｏｎｏｍｉｓｔ网站上发布的ＲＳＳ新闻。

* 使用request-promise发送ＨＴＴＰ请求。
* 使用ｃｈｅｅｒｉｏ按照ｊｑｕｅｒｙ风格的选择器抽取新闻正文。
* 使用ｆｅｅｄｐａｒｓｅｒ解析ＲＳＳ文件。
* 使用ｉｃｏｎｖ，ｍｄ５，ｍｏｍｅｎｔ，ｒｅａｄｌｉｎｅ实现编码转化，ｕｒｌＭＤ５计算，时间解析，逐行读取文件。
* 使用ｌｅｖｅｌ实现基于ｕｒｌ的查重。
