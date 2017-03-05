const OAuth       = require('oauth-1.0a');
const crypto      = require('crypto');
const stream      = require('stream');
const request     = require('request');
const tweetOauth  = require('../config').tweetOauth;
let tweetsQueue   = require('../data/tweetsQueue');

let oauth = OAuth({
    consumer: {
        key: tweetOauth.key,
        secret: tweetOauth.secret,
    },
    signature_method: tweetOauth.signatureMethod,
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


class TweetsStream {
    constructor() {
        this.lastString = '';           // use temporary string to concat cutted json
        this.tweetsStream = stream.Writable();
        this.isConnected = true;
        this.tweetsStream._write = function(chunk, enc, cb) {
            let isJSON = (str)=> {
                try {
                    return JSON.parse(str);
                } catch(err) {
                    return str;
                }
            };

            let buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, enc);
            let json = isJSON(this.lastString + buffer.toString('utf-8').substring(-1));
            if (typeof json == String) {
                this.lastString += json;
            } else {

                if (json['coordinates'] != null || json['coordinates'] != undefined) {
                    tweetsQueue.addTweet(json);
                }
                this.lastString = '';
            }
            cb();
        };

        this.tweetsStream.on('drain', ()=>{
            console.log('tweetStream Drain');
        });
        this.tweetsStream.on('pipe', (src)=>{
            console.log('tweetStream Pipe');
        });
        this.tweetsStream.on('error', ()=>{
            this.isConnected = false;
            console.log('tweetStream ERROR');
        });
        this.tweetsStream.on('finish', ()=>{
            this.isConnected = false;
            console.log('tweetStream Finish');
        });
        this.tweetsStream.on('unpipe', (obj)=>{
            console.log('tweetStream Unpipe', obj);
        });

        this.tweetsStream.on('close', ()=>{
            this.isConnected = false;
            console.log('tweetStream Close');
        });

        // create Connection
        this.createTweetsStreamingReq();
    }

    createTweetsStreamingReq() {
        console.log("Create TweetsStreaming Requst....")
        this.isConnected = true;
        return request({
            url: request_data.url,
            method: request_data.method,
            form: request_data.data,
            headers: oauth.toHeader(oauth.authorize(request_data, token))
        }).pipe(this.tweetsStream);
    }

    isLostConnection() {
        return !this.isConnected;
    }
}

const tweetsStream = new TweetsStream();

module.exports = tweetsStream;