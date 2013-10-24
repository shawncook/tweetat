// I made this twitter bot to tweet a random phrase at the same time daily.
// I'm running it as a Google Apps Script, hosted in Google Drive.
// It's set to trigger once a minute, checking if it's the specified time.
// Adapted from http://www.labnol.org/internet/write-twitter-bot/27902/

function start() {
	var TWITTER_CONSUMER_KEY     = ""; // Apply for these values at dev.twitter.com
	var TWITTER_CONSUMER_SECRET  = "";
	var TWITTER_HANDLE           = "";
	
	ScriptProperties.setProperty("TWITTER_CONSUMER_KEY", TWITTER_CONSUMER_KEY);
	ScriptProperties.setProperty("TWITTER_CONSUMER_SECRET", TWITTER_CONSUMER_SECRET);
	ScriptProperties.setProperty("TWITTER_HANDLE", TWITTER_HANDLE);
		
	var triggers = ScriptApp.getScriptTriggers();
	for (var i=0; i < triggers.length; i++) {
		ScriptApp.deleteTrigger(triggers[i]); } // Clear existing triggers first
		
	ScriptApp.newTrigger("setupTweet").timeBased().everyMinutes(1).create(); }

function oAuth() {
	var oauthConfig = UrlFetchApp.addOAuthService("twitter");
	oauthConfig.setAccessTokenUrl("https://api.twitter.com/oauth/access_token");
	oauthConfig.setRequestTokenUrl("https://api.twitter.com/oauth/request_token");
	oauthConfig.setAuthorizationUrl("https://api.twitter.com/oauth/authorize");
	oauthConfig.setConsumerKey(ScriptProperties.getProperty("TWITTER_CONSUMER_KEY"));
	oauthConfig.setConsumerSecret(ScriptProperties.getProperty("TWITTER_CONSUMER_SECRET")); }

function setupTweet() {
	oAuth();
	
	try {
		var tweets = [
			"Sample tweet!",
			"Another sample tweet!" ];
		var tweet = tweets[Math.floor(Math.random() * tweets.length)] // Pick a random tweet
        var currentTime = new Date()
        if (currentTime.getHours() == 16 && currentTime.getMinutes() == 20){ // Tweet if it's 4:20
            sendTweet(tweet); }
	} catch (e) { Logger.log(e.toString()); }
}

function sendTweet(tweet) {
	var options = {
		"method": "POST",
		"oAuthServiceName":"twitter",
		"oAuthUseToken":"always" };

	var status = "https://api.twitter.com/1.1/statuses/update.json";
	status = status + "?status=" + encodeURL(tweet);
	
	try {
		var result = UrlFetchApp.fetch(status, options);
		Logger.log(result.getContentText()); }  
	catch (e) { Logger.log(e.toString()); }
}

function encodeURL(string) {
   var tmp =  encodeURIComponent(string);
   tmp = tmp.replace(/!/g,'%21');
   tmp = tmp.replace(/\*/g,'%2A');
   tmp = tmp.replace(/\(/g,'%28');
   tmp = tmp.replace(/\)/g,'%29');
   tmp = tmp.replace(/'/g,'%27');
   return tmp; }