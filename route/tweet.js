const router      = require('koa-router')();
const OAuth       = require('oauth-1.0a');
const crypto      = require('crypto');
const stream      = require('stream');
const request     = require('request');
const tweetOauth  = require('../config').tweetOauth;
let tweetsQueue = require('../data/tweetsQueue');
let oauth = OAuth({
    consumer: {
        key: tweetOauth.key,
        secret: tweetOauth.secret,
    },
    signature_method: tweetOauth['signature_method'],
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});
let request_data = {
    url: 'https://stream.twitter.com/1.1/statuses/filter.json?locations=-180.0,-90.0,180.0,90.0',
    method: 'POST',
    headers: {
    }
};

let token = {
    key: tweetOauth.token.key,
    secret: tweetOauth.token.secret
};


const tweetStream = stream.Writable();


let lastString = '';
tweetStream._write = function(chunk, enc, cb) {
    let buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
    let json = isJSON(lastString + buffer.toString('utf-8').substring(-1));
    if (typeof json == String) {
        lastString += json;
    } else {

        if (json['coordinates'] != null || json['coordinates'] != undefined) {
            tweetsQueue.addTweet(json);
        }
        lastString = '';
    }
    cb();
};

tweetStream.on('drain', ()=>{
    console.log('Drain');
});
tweetStream.on('pipe', ()=>{
    console.log('Pipe');
});
tweetStream.on('error', ()=>{
    console.log('ERROR');
});
tweetStream.on('finish', ()=>{
    tweetsStreamingReq = null;
    console.log('tweetStream Finish');
});
tweetStream.on('unpipe', (obj)=>{
    console.log('unpipe', obj);
})

tweetStream.on('close', ()=>{
    tweetsStreamingReq = null;
    console.log('tweetStream Close');
});

let isJSON = (str)=> {
    try {
        return JSON.parse(str);
    } catch(err) {
        return str;
    }
};

var createTweetsStreamingReq = ()=> {
    return request({
        url: request_data.url,
        method: request_data.method,
        form: request_data.data,
        headers: oauth.toHeader(oauth.authorize(request_data, token))
    }).pipe(tweetStream);
};

let tweetsStreamingReq = createTweetsStreamingReq();

router.get('/tweet/:id', function*() {
    if (tweetsStreamingReq == null) {
        tweetsStreamingReq = createTweetsStreamingReq();
    }
    let id = parseInt(this.params.id);
    if (isNaN(id)) {
        this.body = tweetsQueue.getTopk(100);
    } else {
        this.body = tweetsQueue.getNewTweetsDownToId(id);
    }
});




module.exports = router;