var tweetsQueue = ()=> {
	var tweet = (json)=> {
		return {
			id: json.id,
			text: json.text,
			"created_at": json["created_at"].split("+")[0],
			coordinates: json.coordinates.coordinates,
			user: {
				"screen_name": json.user["screen_name"],
				"profile_image_url": json.user["profile_image_url_https"]
			}
		}
	};

	var removeOldestTweetFromQueue = ()=> {
		delete this.tweets[this.tweetsKey[0]];
		this.tweetsKey.shift();
	}


	// tweets key = id, value can be text and coordinates
	this.tweets = {};
	// store all the keys of tweetsQueue
	this.tweetsKey = [];
	this.limits = 500;
	this.addTweet = (json)=> {
		if (this.tweets[json.id] == undefined) {
			this.tweets[json.id] = tweet(json);
			this.tweetsKey.push(json.id);
			if (this.tweetsKey.length == this.limits) {
				removeOldestTweetFromQueue();
			}

		}
	}

	this.getTopk = (k)=> {
		tweetsList = {};
		var len = this.tweetsKey.length;
		for (var i = len > k ? len - k : 0; i < len; i++) {
			tweetsList[this.tweetsKey[len - i + 1]] = this.tweets[this.tweetsKey[len - i + 1]];
		}
		return tweetsList;
	}

	this.getNewTweetsDownToId = (pastId, max = 20)=> {
		tweetsList = {};
		var len = this.tweetsKey.length;
		for (var i = len < max ? 0 : len - max; i < len; i++) {
			tweetsList[this.tweetsKey[i]] = this.tweets[this.tweetsKey[i]];
			if (pastId == this.tweetsKey[i]) {
				tweetsList = {};
			}
		}
		return tweetsList;
	}
	return this;
}

module.exports = tweetsQueue();