var app    = require('koa')();
var router = require('koa-router')();
var send   = require('koa-send');
var OAuth   = require('oauth-1.0a');
var crypto  = require('crypto');
var https   = require('https');
var stream  = require('stream');
var request = require('request');
var tweetsQueue = require('../data/tweetsQueue');
var oauth = OAuth({
    consumer: {
        key: 'yIzrJlgbCpDzlMSmoBd6jKZfo',
        secret: 'Y89G3sFShAcr3FpzwVzDpKgvkxJ7pYZfzSv2jUP5tzTmhvOYdD',
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

var request_data = {
    url: 'https://stream.twitter.com/1.1/statuses/filter.json?locations=-180.0,-90.0,180.0,90.0',
    method: 'POST',
    headers: {
    }
};

var token = {
    key: '760285412455624704-nTz2BQJlvCIA98pI5dkU6DCx7MuquTC',
    secret: '8NMzq0Zeo7bDgNJeXj5SDGOEAjOmco5RFIC3h0OqcWH0K'
}

var requests = [];
var chunk = "";

const tweetStream = stream.Writable();


var lastString = "";
tweetStream._write = function(chunk, enc, cb) {
    var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
    var json = isJSON(lastString + buffer.toString('utf-8').substring(-1));
    if (typeof json == String) {
        lastString += json;
    } else {

        if (json['coordinates'] != null || json['coordinates'] != undefined) {
            tweetsQueue.addTweet(json);
        };
        lastString = "";
    }
    cb();
};

tweetStream.on('drain', ()=>{
    console.log("Drain");
});
tweetStream.on('pipe', (src)=>{
    console.log("Pipe", src);
});
tweetStream.on('error', (err)=>{
    console.log("ERROR", err);
});
tweetStream.on('finish', ()=>{
    tweetsStreamingReq = null;
    console.log("tweetStream Finish!");
});
tweetStream.on('unpipe', (obj)=>{
    console.log("unpipe", obj);
})

tweetStream.on('close', ()=>{
    tweetsStreamingReq = null;
    console.log("tweetStream Close");
});

var isJSON = (str)=> {
    try {
        return JSON.parse(str);
    } catch(err) {
        return str;
    }
}

var createTweetsStreamingReq = ()=> {
    return request({
        url: request_data.url,
        method: request_data.method,
        form: request_data.data,
        headers: oauth.toHeader(oauth.authorize(request_data, token))
    }).pipe(tweetStream);
}

var tweetsStreamingReq = createTweetsStreamingReq();

router.get('/tweet/:id', function*(){
    if (tweetsStreamingReq == null) {
        tweetsStreamingReq = createTweetsStreamingReq();
    }
    var id = parseInt(this.params.id);
    if (isNaN(id)) {
        this.body = tweetsQueue.getTopk(100);
    } else {
        this.body = tweetsQueue.getNewTweetsDownToId(id);
    }
});




module.exports = router;