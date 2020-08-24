// Copyright 2013-2014, Small Picture, Inc.


var twitterConfig;
var whenLastTwRatelimitError = undefined;
var twEmbedCache = [], maxTwEmbedCache = 25, flEmbedCacheInitialized = false;
var twittericon = "<i class=\"fa fa-twitter\" style=\"color: #4099FF; font-weight: bold;\"></i>"; //7/22/14 by DW
var twitterIconColor = "#4099FF";


function twGetDefaultServer () { //10/5/14 by DW
	var url = "http://twitter.radio3.io/";
	try {
		if (appConsts.urlTwitterServer != undefined) {
			url = appConsts.urlTwitterServer;
			}
		}
	catch (err) {
		}
	return (url);
	}
function twGetOauthParams (flRedirectIfParamsPresent) {
	var flTwitterParamsPresent = false;
	if (flRedirectIfParamsPresent == undefined) { //6/4/14 by DW
		flRedirectIfParamsPresent = true;
		}
	function getURLParameter (name) {
		return (decodeURI ((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
		}
	function getParam (paramname, objname) {
		var val = getURLParameter (paramname);
		if (val != "null") {
			localStorage [objname] = val;
			flTwitterParamsPresent = true;
			}
		}
	getParam ("oauth_token", "twOauthToken");
	getParam ("oauth_token_secret", "twOauthTokenSecret");
	getParam ("user_id", "twUserId");
	getParam ("screen_name", "twScreenName");
	
	//redirect if there are params on the url that invoked us -- 4/29/14 by DW
		if (flTwitterParamsPresent && flRedirectIfParamsPresent) {
			window.location.href = window.location.href.substr (0, window.location.href.search ("\\?"));
			return;
			}
	
	return (flTwitterParamsPresent); //6/4/14 by DW
	}
function twDisconnectFromTwitter () {
	localStorage.removeItem ("twOauthToken");
	localStorage.removeItem ("twOauthTokenSecret");
	localStorage.removeItem ("twScreenName");
	localStorage.removeItem ("twUserId");
	}
function twConnectToTwitter (urlServer) {
	function trimTrailing (s, ch) {
		while (s.charAt (s.length - 1) == ch) {
			s = s.substr (0, s.length - 1);
			}
		return (s);
		}
	var s = trimTrailing (window.location.href, "#");
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	
	var urlRedirectTo = urlServer + "connect?redirect_url=" + encodeURIComponent (s);
	window.location.href = urlRedirectTo;
	}
function twIsTwitterConnected () {
	return (localStorage.twOauthToken != undefined);
	}
function twGetScreenName () { //12/18/14 by DW
	return (localStorage.twScreenName);
	}
function twCheckForRateLimitError (responseText) { //check for rate-limit error -- 7/10/14 by DW
	var jstruct = JSON.parse (responseText);
	var twResponse = JSON.parse (jstruct.data);
	if (twResponse.errors != undefined) {
		if (twResponse.errors [0].code == 88) { //rate limit error -- raise the flag
			whenLastTwRatelimitError = new Date ();
			console.log ("twCheckForRateLimitError: rate-limit error");
			}
		}
	}
function twGetUserInfo (userScreenName, callback, urlServer) { //6/21/14 by DW
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	$.ajax({
		type: "GET",
		url: urlServer + "getuserinfo" + "?oauth_token=" + encode (localStorage.twOauthToken) + "&oauth_token_secret=" + encode (localStorage.twOauthTokenSecret) + "&screen_name=" + encode (userScreenName),
		success: function (data) {
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetUserInfo: error == " + JSON.stringify (status, undefined, 4));
			},
		dataType: "json"
		});
	}
function twGetTweetInfo (idTweet, callback, urlServer) { //6/25/14 by DW
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	$.ajax({
		type: "GET",
		url: urlServer + "gettweetinfo" + "?oauth_token=" + encode (localStorage.twOauthToken) + "&oauth_token_secret=" + encode (localStorage.twOauthTokenSecret) + "&id=" + encode (idTweet),
		success: function (data) {
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetTweetInfo: error == " + JSON.stringify (status, undefined, 4));
			},
		dataType: "json"
		});
	}
function twGetUserScreenName (callback) {
	$.ajax({
		type: "GET",
		url: twGetDefaultServer () + "getmyscreenname" + "?oauth_token=" + encodeURIComponent (localStorage.twOauthToken) + "&oauth_token_secret=" + encodeURIComponent (localStorage.twOauthTokenSecret),
		success: function (data) {
			console.log (JSON.stringify (data, undefined, 4));
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetUserScreenName: error == " + JSON.stringify (status, undefined, 4));
			},
		dataType: "json"
		});
	}
function twGetMyTweets (oauthToken, oauthTokenSecret, userid, callback, idLastSeen, urlServer) {
	var sinceParam = "";
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	if (idLastSeen != undefined) {
		sinceParam = "&since_id=" + idLastSeen;
		}
	$.ajax({
		type: "GET",
		url: urlServer + "getmytweets" + "?oauth_token=" + encode (oauthToken) + "&oauth_token_secret=" + encode (oauthTokenSecret) + "&user_id=" + encode (userid) + sinceParam,
		success: function (data) {
			whenLastTwRatelimitError = undefined; //7/10/14 by DW
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetMyTweets: error == " + JSON.stringify (status, undefined, 4));
			twCheckForRateLimitError (status.responseText); //7/10/14 by DW
			},
		dataType: "json"
		});
	}
function twGetUserTweets (userid, idLastSeen, callback, urlServer) { //6/21/14 by DW
	twGetMyTweets (localStorage.twOauthToken, localStorage.twOauthTokenSecret, userid, function (theTweets) {
		callback (theTweets);
		}, idLastSeen, urlServer);
	}
function twGetEmbedCode (id, callback, urlServer, maxwidth, hide_media, hide_thread, omit_script, align, related, lang) { //6/20/14 by DW
	var url;
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	url = urlServer + "getembedcode" + "?id=" + encodeURIComponent (id);
	
	function addParam (val, name) {
		if (val != undefined) {
			url += "&" + name + "=" + encodeURIComponent (val);
			}
		}
	addParam (maxwidth, "maxwidth");
	addParam (hide_media, "hide_media");
	addParam (hide_thread, "hide_thread");
	addParam (omit_script, "omit_script");
	addParam (align, "align");
	addParam (related, "related");
	addParam (lang, "lang");
	
	$.ajax({
		type: "GET",
		url: url,
		success: function (data) {
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetEmbedCode: error == " + JSON.stringify (status, undefined, 4));
			callback (undefined); //9/3/14 by DW
			},
		dataType: "json"
		});
	}
function twGetTwitterReplies (oauthToken, oauthTokenSecret, userid, callback, idLastSeen, urlServer) {
	var sinceParam = "";
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	if (idLastSeen != undefined) {
		sinceParam = "&since_id=" + idLastSeen;
		}
	$.ajax({
		type: "GET",
		url: urlServer + "getmymentions?oauth_token=" + encode (oauthToken) + "&oauth_token_secret=" + encode (oauthTokenSecret) + "&user_id=" + encode (userid) + sinceParam,
		success: function (data) {
			callback (data);
			},
		error: function (status) { 
			console.log ("twGetTwitterReplies: error == " + JSON.stringify (status, undefined, 4));
			},
		dataType: "json"
		});
	}
function twTweet (status, oauthToken, oauthTokenSecret, inReplyToId, callback, urlServer) {
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	if (inReplyToId == undefined) {
		inReplyToId = 0;
		}
	if (oauthToken == undefined) { //6/5/14 by DW
		oauthToken = localStorage.twOauthToken;
		}
	if (oauthTokenSecret == undefined) { //6/5/14 by DW
		oauthTokenSecret = localStorage.twOauthTokenSecret;
		}
	
	console.log ("twTweet: status == " + status);
	
	var apiUrl = urlServer + "tweet?oauth_token=" + encode (oauthToken) + "&oauth_token_secret=" + encode (oauthTokenSecret) + "&status=" + encode (status) + "&in_reply_to_status_id=" + encode (inReplyToId);
	console.log ("twTweet: " + apiUrl);
	
	$.ajax({
		type: "GET",
		url: apiUrl,
		success: function (data){
			console.log ("twTweet: twitter response == " + JSON.stringify (data, undefined, 4)); //9/3/14 by DW
			if (callback != undefined) { //6/5/14 by DW
				callback (data);
				}
			},
		error: function (status) { 
			var twitterResponse = JSON.parse (status.responseText);
			var innerResponse = JSON.parse (twitterResponse.data);
			console.log ("twTweet: status == " + jsonStringify (status));
			alertDialog ("Twitter reported an error: \"" + innerResponse.errors [0].message + "\"");
			
			},
		dataType: "json"
		});
	}
function twFindTweetWithId (idToFind) {
	var fl = false;
	$(getActiveOutliner ()).concord ().op.visitAll (function (headline) {
		var id = headline.attributes.getOne ("tweetId");
		if (id == idToFind) {
			fl = true;
			return (false); //stop looking
			}
		else {
			return (true); //keep looking
			}
		});
	return (fl);
	}
function twViewCursorTweet () {
	window.open ("http://twitter.com/" + opGetOneAtt ("tweetUserName") + "/status/" + opGetOneAtt ("tweetId"))
	}
function twOutlinerTweet (twitterStatus, inReplyToId, origcursor, otherguysname) {
	twTweet (twitterStatus, localStorage.twOauthToken, localStorage.twOauthTokenSecret, inReplyToId, function (data) {
		var urlReplyTo = "";
		lastTweetData = data;
		origcursor.attributes.setOne ("type", "tweet");
		origcursor.attributes.setOne ("tweetId", data.id_str);
		origcursor.attributes.setOne ("tweetUserName", data.user.screen_name);
		if (data.in_reply_to_status_id_str != null) {
			origcursor.attributes.setOne ("tweetInReplyToId", data.in_reply_to_status_id_str);
			}
		if (appPrefs.flTweetToPorkChopServer) {
			var url = opGetOneAtt ("url");
			if (url == undefined) {
				url = "";
				}
			if (otherguysname != undefined) {
				urlReplyTo = "http://twitter.com/" + otherguysname + "/status/" + inReplyToId;
				}
			sendToPorkChopServer (localStorage.twScreenName, origcursor.getLineText (), url, urlReplyTo); 
			}
		});
	}
function twGetUrlLength () { //8/8/14 by DW
	var twUrlLength = 23;
	if (twitterConfig != undefined) {
		twUrlLength = twitterConfig.short_url_length_https;
		}
	return (twUrlLength);
	}
function twTweetFromOutline (flJustReturnText, flConfirmTweets, idoutliner, flAddUrlIfPresent) {
	function getCursorRef () {
		var theCursor = $(idoutliner).concord ().op.getCursor ();
		return ($(idoutliner).concord ().op.setCursorContext (theCursor))
		}
	var origcursor = getCursorRef (), text = opGetLineText (), ctlevels = 0, idparent = undefined, otherguysname = undefined;
	var tweetLength = text.length; //8/8/14 by DW
	if (flAddUrlIfPresent === undefined) { //12/8/14 by DW
		flAddUrlIfPresent = true;
		}
	if (flJustReturnText === undefined) {
		flJustReturnText = false;
		}
	$(idoutliner).concord ().op.visitToSummit (function (op) {
		if (ctlevels++ == 1) {
			idparent = op.attributes.getOne ("tweetId");
			if (idparent != undefined) {
				otherguysname = op.attributes.getOne ("tweetUserName");
				}
			return (false);
			}
		return (true);
		});
	if (idparent == undefined) {
		idparent = 0;
		}
	if (otherguysname != undefined) {
		text = "@" + otherguysname + " -- " + text;
		}
	if (flAddUrlIfPresent) { //look for a url
		var shortUrl = opGetOneAtt ("shortUrl");
		if (shortUrl != undefined) {
			text += " " + shortUrl;
			tweetLength += twGetUrlLength ();
			}
		else {
			var urlRenderedPage = opGetOneAtt ("urlRenderedPage");
			if (urlRenderedPage != undefined) {
				text += " " + urlRenderedPage;
				tweetLength += twGetUrlLength ();
				}
			}
		}
	if (flJustReturnText) {
		return (text);
		}
	if (tweetLength > appPrefs.maxTweetLength) {
		alertDialog ("Can't tweet because the text is longer than " + appPrefs.maxTweetLength + " characters.");
		return;
		}
	if (flConfirmTweets) {
		confirmDialog ("Send the text to your Twitter followers?", function () {
			twOutlinerTweet (text, idparent, origcursor, otherguysname);
			});
		}
	else {
		twOutlinerTweet (text, idparent, origcursor, otherguysname);
		}
	}
function twSetHeadlineAtts (thisTweet) { //6/21/14 by DW
	opSetOneAtt ("type", "tweet");
	opSetOneAtt ("tweetId", thisTweet.id_str);
	opSetOneAtt ("tweetUserName", thisTweet.user.screen_name);
	opSetOneAtt ("created", thisTweet.created_at);
	}
function twOutlinerGetMyTweets () {
	var flFirstGetMyTweets = true;
	if (localStorage.lastSeenMyTweetId != undefined) {
		if (localStorage.lastSeenMyTweetId.length > 0) {
			flFirstGetMyTweets = false; 
			}
		}
	twGetMyTweets (localStorage.twOauthToken, localStorage.twOauthTokenSecret, localStorage.twUserId, function (myTweets) {
		var starttime = new Date ();
		for (var i = 0; i < myTweets.length; i++) {
			var thisTweet = myTweets [i];
			if (!flFirstGetMyTweets) { //the first time we don't add them to the outline
				if (thisTweet.in_reply_to_status_id_str == null) { //an original tweet, not a reply
					if (!twFindTweetWithId (thisTweet.id_str)) { //we don't already have it
						newPostWithoutIcon (hotUpText (thisTweet.text));
						twSetHeadlineAtts (thisTweet);
						opSetOneAtt ("cssTextClass", "newTweetReply");
						
						
						
						}
					}
				}
			//maintain localStorage.lastSeenMyTweetId
				if ((localStorage.lastSeenMyTweetId == undefined) || (thisTweet.id_str > localStorage.lastSeenMyTweetId)) {
					localStorage.lastSeenMyTweetId = thisTweet.id_str;
					}
			}
		}, localStorage.lastSeenMyTweetId);
	}
function twOutlinerGetTwitterReplies (flBeepIfNoReplies, callback) {
	var timestamp = new Date ().getTime (), ctreplies = 0;
	var oldcursor = opGetCursor ();
	whenLastReplyCheck = new Date ();
	if (flBeepIfNoReplies == undefined) {
		flBeepIfNoReplies = false;
		}
	
	twGetTwitterReplies (localStorage.twOauthToken, localStorage.twOauthTokenSecret, localStorage.twUserId, function (myTweets) {
		lastRepliesData = myTweets;
		$(getActiveOutliner ()).concord ().op.visitAll (function (headline) {
			var cssClass = headline.attributes.getOne ("cssTextClass");
			if (cssClass == "newTweetReply") {
				var atts = headline.attributes.getAll ();
				delete atts ["cssTextClass"];
				headline.attributes.setGroup (atts);
				}
			for (var i = 0; i < myTweets.length; i++) {
				var id = headline.attributes.getOne ("tweetId"), thisTweet = myTweets [i];
				if (id != undefined) {
					if (thisTweet.in_reply_to_status_id_str == id) {
						if (!twFindTweetWithId (thisTweet.id_str)) {
							var screenName = thisTweet.user.screen_name;
							var tweetText = popTweetNameAtStart (thisTweet.text);
							tweetText = hotUpText ("@" + screenName + ": "  + tweetText);
							headline.insert (tweetText, right);
							opSetOneAtt ("type", "tweet");
							opSetOneAtt ("tweetId", thisTweet.id_str);
							opSetOneAtt ("tweetUserName", screenName);
							opSetOneAtt ("created", thisTweet.created_at);
							opSetOneAtt ("cssTextClass", "newTweetReply");
							if (appPrefs.flExpandToShowReplies) {
								opExpandTo (getCursorRef ());
								}
							ctreplies++;
							}
						}
					}
				if ((localStorage.lastSeenId == undefined) || (thisTweet.id_str > localStorage.lastSeenId)) {
					localStorage.lastSeenId = thisTweet.id_str;
					}
				}
			});
		opSetCursor (oldcursor);
		if ((ctreplies == 0) && flBeepIfNoReplies && appPrefs.flBeepIfNoReplies) {
			speakerBeep ();
			}
		if (callback != undefined) { //12/8/14 by DW
			callback ();
			}
		}, localStorage.lastSeenMyTweetId);
	}
function twToggleConnectCommand () { 
	if (twIsTwitterConnected ()) {
		confirmDialog ("Sign off Twitter?", function () {
			twDisconnectFromTwitter ();
			});
		}
	else {
		twConnectToTwitter ();
		}
	}
function twUpdateTwitterMenuItem (iditem) {
	document.getElementById (iditem).innerHTML = (twIsTwitterConnected ()) ? "Sign off Twitter..." : "Sign on Twitter...";
	}
function twUpdateTwitterUsername (iditem) {
	document.getElementById (iditem).innerHTML = (twIsTwitterConnected ()) ? localStorage.twScreenName : "Sign on here";
	}
function twWebIntent (id, twOp, paramName) {
	if (paramName == undefined) {
		paramName = "tweet_id";
		}
	if (id != undefined) {
		window.open ("https://twitter.com/intent/" + twOp + "?" + paramName + "=" + id, "_blank", "left=200,top=300,location=no,height=350,width=600,scrollbars=no,status=no");
		}
	}
function twUploadOpml (opmltext, nameoutline, callback, urlServer, flPrivate) { //6/26/14 by DW
	var privateParam = "";
	function encode (s) {
		return (encodeURIComponent (s));
		}
	if (urlServer == undefined) {
		urlServer = twGetDefaultServer ();
		}
	if (flPrivate) { //8/3/14 by DW
		privateParam = "&flprivate=true";
		}
	$.ajax({
		type: "POST",
		url: urlServer + "publishopml" + "?oauth_token=" + encode (localStorage.twOauthToken) + "&oauth_token_secret=" + encode (localStorage.twOauthTokenSecret) + "&nameoutline=" + encode (nameoutline) + privateParam,
		data: opmltext,
		success: function (data) {
			callback (data.opmlurl, data);
			},
		error: function (status) { 
			var twitterResponse = JSON.parse (status.responseText);
			console.log ("twUploadOpml: error, twitter response == " + JSON.stringify (twitterResponse, undefined, 4));
			},
		dataType: "json"
		});
	}
function twBuildParamList (paramtable, flPrivate) { //8/10/14 by DW
	var s = "";
	if (flPrivate) {
		paramtable.flprivate = "true";
		}
	for (var x in paramtable) {
		if (s.length > 0) {
			s += "&";
			}
		s += x + "=" + encodeURIComponent (paramtable [x]);
		}
	return (s);
	}
function twGetFile (relpath, flIncludeBody, flPrivate, callback) { //8/10/14 by DW
	var paramtable = {
		oauth_token: localStorage.twOauthToken,
		oauth_token_secret: localStorage.twOauthTokenSecret,
		relpath: relpath
		}
	if (flIncludeBody) {
		paramtable.flIncludeBody = "true";
		}
	var url = twGetDefaultServer () + "getfile?" + twBuildParamList (paramtable, flPrivate);
	$.ajax ({
		type: "GET",
		url: url,
		success: function (data) {
			callback (undefined, data);
			},
		error: function (status, something, otherthing) { 
			console.log ("twGetFile: error == " + JSON.stringify (status, undefined, 4));
			console.log ("twGetFile: something == " + JSON.stringify (something, undefined, 4));
			console.log ("twGetFile: otherthing == " + JSON.stringify (otherthing, undefined, 4));
			callback (status, undefined);
			},
		dataType: "json"
		});
	}
function twUploadFile (relpath, filedata, type, flPrivate, callback) { //8/3/14 by DW
	var paramtable = {
		oauth_token: localStorage.twOauthToken,
		oauth_token_secret: localStorage.twOauthTokenSecret,
		relpath: relpath,
		type: type
		}
	var url = twGetDefaultServer () + "publishfile?" + twBuildParamList (paramtable, flPrivate);
	$.post (url, filedata, function (data, status) {
		if (status == "success") {
			callback (JSON.parse (data));
			}
		else {
			console.log ("twUploadFile: error == " + JSON.stringify (status, undefined, 4));
			}
		});
	
	
	
	}
function twTwitterDateToGMT (twitterDate) { //7/16/14 by DW
	return (new Date (twitterDate).toGMTString ());
	}
function twViewTweet (idTweet, idDiv, callback) { //7/18/14 by DW
	function prefsToStorage () {
		localStorage.twEmbedCache = JSON.stringify (twEmbedCache, undefined, 4);
		}
	function storageToPrefs () {
		if (localStorage.twEmbedCache != undefined) {
			twEmbedCache = JSON.parse (localStorage.twEmbedCache);
			}
		}
	var idViewer = "#" + idDiv, now = new Date ();
	
	if (!flEmbedCacheInitialized) {
		storageToPrefs ();
		flEmbedCacheInitialized = true;
		}
	
	if (idTweet == undefined) {
		$(idViewer).html ("");
		}
	else {
		var cacheElement, flFoundInCache = false;
		for (var i = 0; i < twEmbedCache.length; i++) {
			var c = twEmbedCache [i];
			if (c.id == idTweet) {
				cacheElement = c;
				flFoundInCache = true;
				}
			}
		if (flFoundInCache) {
			$(idViewer).html (cacheElement.html);
			cacheElement.ctAccesses++;
			cacheElement.whenLastAccess = now;
			if (callback != undefined) { //10/4/14 by DW
				callback (cacheElement);
				}
			prefsToStorage ();
			}
		else {
			twGetEmbedCode (idTweet, function (struct) {
				$(idViewer).css ("visibility", "hidden");
				$(idViewer).html (struct.html);
				
				var obj = {
					html: struct.html,
					id: idTweet,
					ctAccesses: 0,
					whenLastAccess: now
					};
				if (twEmbedCache.length < maxTwEmbedCache) {
					twEmbedCache [twEmbedCache.length] = obj;
					}
				else {
					var whenOldest = twEmbedCache [0].whenLastAccess, ixOldest = 0;
					for (var i = 1; i < twEmbedCache.length; i++) {
						if (twEmbedCache [i].whenLastAccess < whenOldest) {
							whenOldest = twEmbedCache [i].whenLastAccess;
							ixOldest = i;
							}
						}
					twEmbedCache [ixOldest] = obj;
					}
				
				if (callback != undefined) {
					callback (struct);
					}
				
				prefsToStorage ();
				});
			}
		}
	
	$(idViewer).on ("load", function () {
		$(idViewer).css ("visibility", "visible");
		});
	}
function twDerefUrl (shorturl, callback) { //7/31/14 by DW
	if (twIsTwitterConnected ()) {
		$.ajax ({
			type: "GET",
			url: twGetDefaultServer () + "derefurl?oauth_token=" + encodeURIComponent (localStorage.twOauthToken) + "&oauth_token_secret=" + encodeURIComponent (localStorage.twOauthTokenSecret) + "&url=" + encodeURIComponent (shorturl),
			success: function (data) {
				if (callback != undefined) {
					callback (data.longurl);
					}
				console.log ("twDerefUrl: data == " + jsonStringify (data));
				},
			error: function (status) { 
				console.log ("twDerefUrl: error status == " + jsonStringify (status));
				},
			dataType: "json"
			});
		}
	}
function twShortenUrl (longUrl, callback) { //8/25/14 by DW
	$.ajax ({
		type: "GET",
		url: twGetDefaultServer () + "shortenurl" + "?url=" + encodeURIComponent (longUrl),
		success: function (data) {
			if (callback != undefined) {
				callback (data.shortUrl);
				}
			},
		error: function (status) { 
			console.log ("twShortenUrl: error == " + JSON.stringify (status, undefined, 4));
			},
		dataType: "json"
		});
	}
function twSendStatus (s, callback) { //8/27/14 by DW -- a streamlined interface for sending a tweet
	twTweet (s, undefined, undefined, undefined, function (tweetData) {
		if (callback != undefined) {
			callback (tweetData);
			}
		});
	}
function twUserWhitelisted (username, callback) {
	$.ajax ({
		type: "GET",
		url: twGetDefaultServer () + "iswhitelisted?screen_name=" + username,
		success: function (data) {
			callback (data);
			},
		error: function (status, something, otherthing) { 
			callback (false);
			},
		dataType: "json"
		});
	}
function twGetUserFiles (flPrivate, callback) { //12/21/14 by DW
	if (flPrivate == undefined) {
		flPrivate = false;
		}
	$.ajax ({
		type: "GET",
		url: twGetDefaultServer () + "getfilelist?oauth_token=" + encodeURIComponent (localStorage.twOauthToken) + "&oauth_token_secret=" + encodeURIComponent (localStorage.twOauthTokenSecret) + "&flprivate=" + encodeURIComponent (getBoolean (flPrivate)),
		success: function (data) {
			whenLastTwRatelimitError = undefined; 
			console.log ("twGetUserFiles: list == " + jsonStringify (data));
			if (callback != undefined) {
				callback (data);
				}
			},
		error: function (status) { 
			console.log ("twGetUserFiles: error == " + JSON.stringify (status, undefined, 4));
			twCheckForRateLimitError (status.responseText); 
			},
		dataType: "json"
		});
	
	}
function twGetTwitterConfig (urlServer) {
	if (twIsTwitterConnected ()) {
		if (urlServer == undefined) {
			urlServer = twGetDefaultServer ();
			}
		$.ajax({
			type: "GET",
			url: urlServer + "configuration?oauth_token=" + encodeURIComponent (localStorage.twOauthToken) + "&oauth_token_secret=" + encodeURIComponent (localStorage.twOauthTokenSecret),
			success: function (data) {
				twitterConfig = data;
				},
			error: function (status) { 
				console.log ("getTwitterConfig: error.");
				},
			dataType: "json"
			});
		}
	}
