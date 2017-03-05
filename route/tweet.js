const router       = require('koa-router')();
let tweetsStream = require('../data/tweetsStream');
let tweetsQueue    = require('../data/tweetsQueue');


router.get('/tweet/:id', function*() {
    let id = parseInt(this.params.id);

    if (tweetsStream.isLostConnection() || !tweetsQueue.hasNew(id)) {
        tweetsStream.createTweetsStreamingReq();
    }
    console.log(tweetsQueue.getCount(), tweetsQueue.hasNew(id));
    if (isNaN(id)) {
        this.body = tweetsQueue.getTopk(100);
    } else {
        this.body = tweetsQueue.getNewTweetsDownToId(id);
    }
}).get('/tweetDetail/:id', function*() {
    let id = parseInt(this.params.id);
    if (!isNaN(id)) {
        this.body = tweetsQueue.getTweetDetail(this.params.id);
    } else {
        console.log('/TweetDetail/'+ id + ' NOT FOUND');
    }
});


module.exports = router;