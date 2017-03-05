const tweetsQueueConfig = require('./../config').tweetsQueue;

class TweetsQueue {
    constructor() {
        // tweets key = id, value can be text and coordinates
        this.tweets = {};
        // store all the keys of tweetsQueue
        this.tweetsKey = [];
        this.limits = tweetsQueueConfig.QueueMaxSize;
    }

    tweet(json) {
        return {
            tweet: {
                id: json['id_str'],
                coordinates: json.coordinates.coordinates
            },
            tweetDetail: {
                text: json.text,
                'created_at': json['created_at'].split('+')[0],
                user: {
                    'screen_name': json.user['screen_name'],
                    'profile_image_url': json.user['profile_image_url_https']
                }
            }
        };
    }

    removeOldestTweetFromQueue() {
        delete this.tweets[this.tweetsKey[0]];
        this.tweetsKey.shift();
    }

    addTweet(json) {
        if (this.tweets[json['id_str']] == undefined) {
            this.tweets[json['id_str']] = this.tweet(json);
            this.tweetsKey.push(json['id_str']);
            if (this.tweetsKey.length == this.limits) {
                this.removeOldestTweetFromQueue();
            }
        }
    }

    // get Brief of id and Coordinates
    getTopk(k) {
        let tweetsList = [];
        let len = this.tweetsKey.length;
        for (let i = len > k ? len - k : 0; i < len; i++) {
            if (this.tweetsKey[len - i + 1] !== undefined) {
                tweetsList.push(this.tweets[this.tweetsKey[len - i + 1]].tweet);
            }
        }
        return tweetsList;
    }

    // get Brief info of id and Coordinates
    getNewTweetsDownToId(pastId, max = 20) {
        let tweetsList = [];
        let len = this.tweetsKey.length;
        for (let i = len < max ? 0 : len - max; i < len; i++) {
            if (this.tweets[this.tweetsKey[i]] !== undefined) {
                tweetsList.push(this.tweets[this.tweetsKey[i]].tweet);
            }
            if (pastId == this.tweetsKey[i]) {
                tweetsList = [];
            }
        }
        return tweetsList;
    }

    // get Tweet Detail info
    getTweetDetail(id) {
        let tweetDetail = this.tweets[id].tweetDetail;
        tweetDetail.id = id;
        return tweetDetail;
    }

    getCount() {
        return this.tweetsKey.length;
    }

    hasNew(id) {
        return !(id == this.tweetsKey[this.tweetsKey.length - 1]);
    }
}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;