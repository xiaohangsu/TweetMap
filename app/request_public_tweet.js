var tweetReq = new XMLHttpRequest();
var chunk = {};
tweetReq.onprogress = ()=> {
	chunk = JSON.parse(tweetReq.responseText);
	console.log(chunk);
}
tweetReq.open("GET", "/tweet", true);
tweetReq.send();

module.exports = chunk;