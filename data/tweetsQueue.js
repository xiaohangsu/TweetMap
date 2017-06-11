const TWEETS_SIZE        = require('./../config').tweetsSize;

class TweetsQueue {
    constructor() {
        this.tweets = [];
        this.tweetIdMap = {};
    }

    tweet(json) {
        return {
            tweet: {
                id: this.count,
                coordinates: json.coordinates.coordinates
            },
            tweetDetail: {
                id: json['id_str'],
                text: json.text,
                createdAt: json['timestamp_ms'],
                user: {
                    name: json.user['screen_name'],
                    profileImageUrl: json.user['profile_image_url_https']
                }
            }
        };
    }

    addTweet(json) {
        if (this.tweets.length === TWEETS_SIZE) {
            delete this.tweetIdMap[this.tweets[0].tweet.id];
            this.tweets.shift();

        }

        if (this.tweets.length % 10 === 0) {
            console.log(this.tweets.length);
        }
        let tweet = this.tweet(json);
        this.tweetIdMap[tweet.tweet.id] = this.tweets.length;
        this.tweets.push(tweet);

    }

    // get Brief of id and Coordinates
    getTopk(k) {
        let count = this.tweets.legnth > k ? this.tweets.length - k : 0;
        return this.tweets.slice(count).map((obj)=>{
            return obj.tweet;
        });
    }


    // get Tweet Detail info
    getTweetDetail(id) {
        return this.elasticSearch.get({
            type:'tweet', 
            index: 'twitter',
            id: id
        }).then((res)=> {
            return res['_source'].tweetDetail;
        }, (err)=> {
            console.log(err);
            return err;
        });
    }

    search(text) {

    }


    getCount() {
        return this.count;
    }

    searchGeo(dis, coord) {
    }

    getShrink() {

    }

    hasNew(id) {
        console.log(id, this.count);
        return this.count - 1 != parseInt(id);
    }

}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;