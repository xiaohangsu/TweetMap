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
            id: json['id_str'],
            text: json.text,
            'created_at': json['created_at'].split('+')[0],
            coordinates: json.coordinates.coordinates,
            user: {
                'screen_name': json.user['screen_name'],
                'profile_image_url': json.user['profile_image_url_https']
            }
        };
    }

    removeOldestTweetFromQueue() {
        delete this.tweets[this.tweetsKey[0]];
        this.tweetsKey.shift();
    }


    addTweet(json) {
        if (this.tweets[json.id] == undefined) {
            this.tweets[json.id] = this.tweet(json);
            this.tweetsKey.push(json.id);
            if (this.tweetsKey.length == this.limits) {
                this.removeOldestTweetFromQueue();
            }
        }
    }

    getTopk(k) {
        let tweetsList = {};
        let len = this.tweetsKey.length;
        for (let i = len > k ? len - k : 0; i < len; i++) {
            tweetsList[this.tweetsKey[len - i + 1]] = this.tweets[this.tweetsKey[len - i + 1]];
        }
        return tweetsList;
    }

    getNewTweetsDownToId(pastId, max = 20) {
        let tweetsList = {};
        let len = this.tweetsKey.length;
        for (let i = len < max ? 0 : len - max; i < len; i++) {
            tweetsList[this.tweetsKey[i]] = this.tweets[this.tweetsKey[i]];
            if (pastId == this.tweetsKey[i]) {
                tweetsList = {};
            }
        }
        return tweetsList;
    }

    getCount() {
        return this.tweetsKey.length;
    }
}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;