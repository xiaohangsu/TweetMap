const Router       = require('koa-router');
let tweetsQueue    = require('../data/tweetsQueue');
const kafkaStream  = require('../data/kafkaStream');
let router = new Router();

router.get('/tweet/:id', async (ctx, next)=> {
    let id = parseInt(ctx.params.id);
    // if (tweetsStream.isLostConnection() || !tweetsQueue.hasNew(id)) {
    //     tweetsStream.createTweetsStreamingReq();
    //     console.log('Create a new Tweet Stream in minutes...');
    // }

    if (isNaN(id)) {
        ctx.body = await tweetsQueue.getTopk(100);
    } else {
        ctx.body = await tweetsQueue.getNewTweetsDownToId(id);
    }


}).get('/tweetDetail/:id', async (ctx, next)=> {
    let id = parseInt(ctx.params.id);
    if (!isNaN(id)) {
        ctx.body = await tweetsQueue.getTweetDetail(ctx.params.id);
    } else {
        console.log('/TweetDetail/'+ id + ' NOT FOUND');
        ctx.body = {
            status: 400,
            message: 'ERROR'
        }
    }


}).get('/tweet/search/:text', async (ctx, next)=> {
    ctx.body = await tweetsQueue.search(ctx.params.text);

}).get('/tweet/search/:text/:scrollId', async (ctx, next)=> {
    ctx.body = await tweetsQueue.scroll(ctx.params.scrollId);

}).get('/tweet/searchGeo/:dis/:coord', async (ctx, next)=> {
    ctx.body = await tweetsQueue.searchGeo(ctx.params.dis, ctx.params.coord);

}).get('/tweet/searchGeo/:dis/:coord/:scrollId', async (ctx, next)=> {
    ctx.body = await tweetsQueue.scroll(ctx.params.scrollId);
});

module.exports = router;