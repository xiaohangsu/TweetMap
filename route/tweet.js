const router       = require('koa-router')();
let tweetsStream   = require('../data/tweetsStream');
let tweetsQueue    = require('../data/tweetsQueue');

router.get('/tweet/:id', (ctx)=> {
    let id = parseInt(ctx.params.id);
    console.log(`/tweet/${id} | IP ${ctx.ip}`);

    if (isNaN(id)) {
        ctx.body = tweetsQueue.getTopk(100);
    } else {
        ctx.body = tweetsQueue.getNewTweetsDownToId(id);
    }


}).get('/tweetDetail/:id', (ctx)=> {
    let id = parseInt(ctx.params.id);
    console.log(`/tweetDetail/${id} | IP ${ctx.ip}`);
    if (!isNaN(id)) {
        ctx.body = tweetsQueue.getTweetDetail(ctx.params.id);
    } else {
        console.log('/TweetDetail/'+ id + ' NOT FOUND');
    }


}).get('/tweet/search/:text', (ctx)=> {
    ctx.body = tweetsQueue.search(ctx.params.text);

}).get('/tweet/search/:text/:scrollId', (ctx)=> {
    ctx.body = tweetsQueue.scroll(ctx.params.scrollId);

}).get('/tweet/searchGeo/:dis/:coord', (ctx)=> {
    ctx.body = tweetsQueue.searchGeo(ctx.params.dis, ctx.params.coord);

}).get('/tweet/searchGeo/:dis/:coord/:scrollId', (ctx)=> {
    ctx.body = tweetsQueue.scroll(ctx.params.scrollId);
});

module.exports = router;