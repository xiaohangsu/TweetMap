const router       = require('koa-router')();
let tweetsStream = require('../data/tweetsStream');
let tweetsQueue    = require('../data/tweetsQueue');


router.get('/tweet/:id', function*() {
    let id = parseInt(this.params.id);
    console.log(!tweetsQueue.hasNew(id));
    if (tweetsStream.isLostConnection() || !tweetsQueue.hasNew(id)) {
        tweetsStream.createTweetsStreamingReq();
    }
    if (isNaN(id)) {
        this.body = yield tweetsQueue.getTopk(100);
    } else {
        this.body = yield tweetsQueue.getNewTweetsDownToId(id);
    }


}).get('/tweetDetail/:id', function*() {
    let id = parseInt(this.params.id);
    if (!isNaN(id)) {
        this.body = yield tweetsQueue.getTweetDetail(this.params.id);
    } else {
        console.log('/TweetDetail/'+ id + ' NOT FOUND');
    }


}).get('/tweet/search/:text', function*() {
    this.body = yield tweetsQueue.search(this.params.text);

}).get('/tweet/search/:text/:scrollId', function*() {
    this.body = yield tweetsQueue.scroll(this.params.scrollId);

}).get('/tweet/searchGeo/:dis/:coord', function*() {
    this.body = yield tweetsQueue.searchGeo(this.params.dis, this.params.coord);
    
}).get('/tweet/searchGeo/:dis/:coord/:scrollId', function*() {
    this.body = yield tweetsQueue.scroll(this.params.scrollId);
});

module.exports = router;