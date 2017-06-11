const TWEETS_SIZE        = require('./../config').tweetsSize;

class TweetsQueue {
    constructor() {
        this.tweets = [];
        this.tweetIdMap = {};
        this.count = 0;
    }

    tweet(json) {
        return {
            tweet: {
                id: this.count++,
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
        if (this.count % TWEETS_SIZE === TWEETS_SIZE - 1) {
            delete this.tweetIdMap[this.tweets[0].tweet.id];
            this.tweets.shift();

        }

        if (this.count % 5000 === 0) {
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

    getNewTweetsDownToId(id) {
        let tweetStartIndex = this.count - id + 1 > 50 ? this.count - 50 : this.count - id + 1;
        return this.tweets.slice(tweetStartIndex).map((obj)=> {
            return obj.tweet;
        });
    }


    // get Tweet Detail info
    getTweetDetail(id) {
        return this.tweets[this.tweetIdMap[id]].tweetDetail;
    }

    search(text) {

    }


    getCount() {
        return this.count;
    }

    searchGeo(dis, coord) {
    }

    hasNew(id) {
        console.log(id, this.count);
        return this.count - 1 != parseInt(id);
    }

}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;