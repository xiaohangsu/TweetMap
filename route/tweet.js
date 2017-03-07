const router       = require('koa-router')();
let tweetsStream = require('../data/tweetsStream');
let tweetsQueue    = require('../data/tweetsQueue');


router.get('/tweet/:id', function*() {
    let id = parseInt(this.params.id);

    if (tweetsStream.isLostConnection() || !tweetsQueue.hasNew()) {
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
});


module.exports = router;