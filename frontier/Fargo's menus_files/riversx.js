
document.write ('<link href="http://fargo.io/code/ubuntuFont.css" rel="stylesheet" type="text/css">');
document.write ('<script src="http://fargo.io/code/node/shared/utils.js"></script>');
document.write ('<script src="http://fargo.io/code/shared/twitter.js"></script>');
document.write ('<script src="http://fargo.io/code/shared/emojify.js"></script>');
document.write ('<script src="http://fargo.io/cms/dateFormat.js"></script>');
document.write ('<link rel="stylesheet" href="http://fargo.io/code/fontAwesome/css/font-awesome.min.css"/>');


var theRiver; 
var serialnumForRiverRender = 0; 
var riverCache = new Array ();

function shareClick (iditem) {
	var feeds = theRiver.updatedFeeds.updatedFeed, urlLinkBlogTool = "http://radio3.io/";
	try {
		if (appPrefs.urlLinkBlogTool != undefined) { //10/3/14 by DW
			urlLinkBlogTool = appPrefs.urlLinkBlogTool;
			}
		}
	catch (err) {
		}
	
	function encode (s) {
		return (encodeURIComponent (s));
		}
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i];
		for (var j = 0; j < feed.item.length; j++) {
			var item = feed.item [j];
			if (item.id == iditem) {
				var urlShare = urlLinkBlogTool + "?"; 
				function addParam (name, val) {
					if (val != undefined) {
						if (val.length > 0) {
							urlShare += name + "=" + encode (val) + "&";
							}
						}
					
					
					}
				
				if ((item.outline != undefined) && (item.outline.type != "tweet")) { //plain jane outline, don't send the body, it's too big for a linkblog entry
					addParam ("title", item.title);
					addParam ("link", item.link);
					}
				else {
					addParam ("title", item.title);
					addParam ("link", item.link);
					addParam ("description", item.body);
					}
				
				if (endsWith (urlShare, "&")) {
					urlShare = urlShare.substr (0, urlShare.length - 1); //pop last char
					}
				console.log ("shareClick: item == " + jsonStringify (item));
				console.log ("shareClick: urlShare == " + urlShare);
				window.open (urlShare);
				
				
				
				
				return;
				}
			}
		}
	
	}
function ecOutline (idnum) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "#idOutlineLevel" + idnum;
	if (c.className == "fa fa-caret-down") {
		c.className = "fa fa-caret-right";
		c.style.color = "black";
		$(idUL).slideUp (75);
		}
	else {
		c.className = "fa fa-caret-down";
		c.style.color = "silver";
		$(idUL).slideDown (75);
		}
	}
function ecTweet (idnum, idtweet) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "idOutlineLevel" + idnum;
	if (c.style.color == "silver") {
		c.style.color = "#4099FF";
		$("#" + idUL).slideUp (75);
		}
	else {
		c.style.color = "silver";
		twViewTweet (idtweet, idUL, function () {
			$("#" + idUL).slideDown (75);
			});
		}
	}
function ecImage (idnum) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "#idOutlineLevel" + idnum;
	if (c.style.color == "silver") {
		c.style.color = "black";
		$(idUL).slideUp (75);
		}
	else {
		c.style.color = "silver";
		$(idUL).slideDown (75);
		}
	}
function getIcon (idnum, flcollapsed) {
	var wedgedir, color;
	if (flcollapsed) {
		wedgedir = "right";
		color = "black";
		}
	else {
		wedgedir = "down";
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecOutline (" + idnum + ")\" ";
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aOutlineWedgeLink\" " + clickscript + "><i class=\"fa fa-caret-" + wedgedir + "\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i></a></span>";
	return (icon);
	}
function getIconForTweet (idnum, idtweet, flcollapsed) { //9/22/14 by DW
	var color;
	if (flcollapsed) {
		color = "#4099FF";
		}
	else {
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecTweet (" + idnum + ", '" + idtweet + "')\" ";
	var iconchar = "<i class=\"fa fa-twitter\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i>"; 
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aTwitterLink\" " + clickscript + ">" + iconchar + "</a></span>";
	return (icon);
	}
function getIconForImage (idnum, flcollapsed) { //9/23/14 by DW
	var color;
	if (flcollapsed) {
		color = "black";
		}
	else {
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecImage (" + idnum + ")\" ";
	var iconchar = "<i class=\"fa fa-image\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i>"; 
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aImageIconLink\" " + clickscript + ">" + iconchar + "</a></span>";
	return (icon);
	}
function getShareLink (item) { //9/22/14 by DW
	var sharescript = "shareClick ('" + item.id + "');";
	var sharelink = "<span class=\"spShareLink\"><a onclick=\"" + sharescript + "\" title=\"Share\"><i class=\"fa fa-share\"></i></a></span>";
	return (sharelink);
	}
function getEnclosureLink (item) { //9/22/14 by DW
	var enclosurelink = "";
	if (item.enclosure != undefined) {
		var theEnclosure = item.enclosure [0];
		if ((theEnclosure != undefined) && (theEnclosure.url != undefined)) {
			enclosurelink = "<span class=\"spEnclosureLink\"><a href=\"" + theEnclosure.url + "\" target=\"_blank\" title=\"Enclosure\"><i class=\"fa fa-headphones\"></i></a></span>";
			}
		}
	return (enclosurelink);
	}
function getItemFooter (item) { //9/22/14 by DW
	var sharelink = getShareLink (item);
	var enclosurelink = getEnclosureLink (item);
	var itemfooter = "<div class=\"divItemFooter\"><span class=\"spTimeDifference\">" + timeDifference (item.pubDate) + "</span>" + enclosurelink + sharelink + "</div>";
	return (itemfooter);
	}
function expandableTextLink (theText, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecOutline (" + idLevel + ")\">" + theText + "</a>");
	}
function expandableTweetTextLink (theText, idTweet, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecTweet (" + idLevel + ", '" + idTweet + "')\">" + theText + "</a>");
	}
function expandableImageTextLink (theText, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecImage (" + idLevel + ")\">" + theText + "</a>");
	}
function riverRenderOutline (outline) {
	var htmltext = "", indentlevel = 0;
	function add (s) {
		htmltext += filledString ("\t", indentlevel) + s + "\r\n";
		}
	function getHotText (outline) {
		var origtext = outline.text;
		var s = hotUpText (outline.text, outline.url);
		if (s != origtext) {
			return (s);
			}
		else {
			return (expandableTextLink (s, serialnumForRiverRender));
			}
		}
	function hasSubs (outline) {
		return (outline.subs != undefined) && (outline.subs.length > 0);
		}
	function addSubs (outline, flcollapsed) {
		if (hasSubs (outline)) {
			var style = "";
			if (flcollapsed) {
				style = " style=\"display: none;\"";
				}
			add ("<ul class=\"ulOutlineList\" id=\"idOutlineLevel" + serialnumForRiverRender++ + "\"" + style + ">"); indentlevel++;
			for (var i = 0; i < outline.subs.length; i++) {
				var child = outline.subs [i], flchildcollapsed = true;
				if (hasSubs (child)) {
					add ("<li>"); indentlevel++;
					add ("<div class=\"divOutlineText\">" + getIcon (serialnumForRiverRender, flchildcollapsed) + getHotText (child) + "</div>");
					addSubs (child, flchildcollapsed);
					add ("</li>"); indentlevel--;
					}
				else {
					add ("<li><div class=\"divOutlineText\">" + child.text + "</div></li>");
					}
				}
			add ("</ul>"); indentlevel--;
			}
		}
	
	
	if (hasSubs (outline)) { //9/22/14 by DW
		var flTopLevelCollapsed = true, theText = getHotText (outline);
		add ("<div class=\"divRenderedOutline\">"); indentlevel++;
		add ("<div class=\"divItemHeader divOutlineHead\">" + getIcon (serialnumForRiverRender, flTopLevelCollapsed) + theText + "</div>");
		addSubs (outline, flTopLevelCollapsed);
		add ("</div>"); indentlevel--;
		
		serialnumForRiverRender++; //9/22/14 by DW
		}
	else {
		add ("<div class=\"divRenderedOutline\">"); indentlevel++;
		add ("<div class=\"divItemHeader divOutlineHead\">" + hotUpText (outline.text, outline.url) + "</div>");
		add ("</div>"); indentlevel--;
		}
	
	return (htmltext);
	}
function freshRiverDisplay (idRiver) {
	var feeds = theRiver.updatedFeeds.updatedFeed, idSerialNum = 0;
	$("#" + idRiver).empty ();
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i], feedLink, whenFeedUpdated, favicon = "", items = "";
		//set feedLink
			feedLink = feed.feedTitle;
			if ((feed.websiteUrl != null) && (feed.websiteUrl.length > 0)) {
				feedLink = "<a href=\"" + feed.websiteUrl + "\" title=\"Web page\">" + feedLink + "</a>";
				favicon = "<img class=\"imgFavIcon\" src=\"" + getFavicon (feed.websiteUrl) + "\" width=\"16\" height=\"16\">";
				}
			if (feed.feedUrl.length > 0) {
				feedLink += " (<a href=\"" + feed.feedUrl + "\" title=\"Link to RSS feed\">Feed</a>)";
				}
		//set whenFeedUpdated
			whenFeedUpdated = feed.whenLastUpdate;
		//set items
			for (var j = 0; j < feed.item.length; j++) {
				var item = feed.item [j], title, body, itemlink, itemhtml, sharelink, idItem = "idItem" + idSerialNum++, enclosurelink = "";
				
				if (j > 0) {
					items += "<div class=\"divInterItemSpacer\"></div>";
					}
				
				if (item.outline != undefined) {
					switch (item.outline.type) {
						case "tweet":
							var flTweetCollapsed = true, style = "";
							if (flTweetCollapsed) {
								style = " style=\"display: none;\"";
								}
							var tweetlinetext = getIconForTweet (serialnumForRiverRender, item.outline.tweetid, flTweetCollapsed) + expandableTweetTextLink (item.outline.text, item.outline.tweetid, serialnumForRiverRender);
							var tweethead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + tweetlinetext  + "</div></div>";
							var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = item.outline.tweetid;
							var tweetbody = "<div class=\"divTweetInRiver\" id=\"" + idDiv + "\"" + style + ">&lt;tweet id=" + idTweet + "></div>";
							itemhtml = tweethead + tweetbody + getItemFooter (item);
							break;
						case "image":
							var imagelinetext = getIconForImage (serialnumForRiverRender, true) + expandableImageTextLink (item.outline.text, serialnumForRiverRender);
							var style = " style=\"display: none;\"";
							var imagehead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + imagelinetext  + "</div></div>";
							var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = item.outline.tweetid;
							var imagebody = "<div class=\"divImageInRiver\" id=\"" + idDiv + "\"" + style + "><img class=\"divRenderedImage\" src=\"" + item.outline.url + "\"></div>";
							itemhtml = imagehead + imagebody + getItemFooter (item);
							break;
						default:
							itemhtml = riverRenderOutline (item.outline) + getItemFooter (item);
							break;
						}
					}
				else {
					//set title, body
						if (item.title.length > 0) {
							title = item.title;
							body = item.body;
							}
						else {
							title = item.body;
							body = "";
							}
					//set itemlink
						if (item.link.length > 0) {
							itemlink = "<a href=\"" + item.link + "\">" + title + "</a>";
							}
						else {
							itemlink = title;
							}
						itemlink =  "<div class=\"divItemHeader\">" + itemlink + "</div>";
					
					var itembody = "<div class=\"divItemDescription\">" + body + "</div>";
					itemhtml = itemlink + itembody + getItemFooter (item);
					}
				
				items += "<div class=\"divItem\" id=\"" + idItem + "\">" + itemhtml + "</div>";
				}
			items = emojiProcess (items); //10/11/14 by DW
		
		var title = "<div class=\"divFeedTitle\">" + favicon + feedLink+ "</div>";
		var updated = "<span class=\"spFeedUpdateTime\">" + dateFormat (whenFeedUpdated, "timeDate")  + "</span>";
		var head = "<div class=\"divItemHeader\">" + updated + title + "</div>";
		
		$("#" + idRiver).append ("<div class=\"divRiverSection\">" + head + items + "</div>");
		}
	
	}
function onGetRiverStream (updatedFeeds) {
	}
function httpGetRiver (urlRiver, flSkipCache, idRiver) {
	var whenstart = new Date ();
	if (flSkipCache == undefined) { //by default cache is off
		flSkipCache = true; 
		}
	if (idRiver == undefined) { //10/5/14 by DW
		idRiver = "idRiverDisplay";
		}
	urlLastRiverGet = urlRiver;
	if (!flSkipCache) {
		for (var i = 0; i < riverCache.length; i++) {
			var item = riverCache [i];
			if (item.url == urlRiver) {
				console.log ("httpGetRiver: found in cache at " + i + ".");
				theRiver = item.jstruct;
				freshRiverDisplay (idRiver);
				return;
				}
			}
		}
	$.ajax ({ 
		url: urlRiver,  
		jsonpCallback : "onGetRiverStream",
		success: function (data) {
			console.log ("httpGetRiver: read took " + secondsSince (whenstart) + " secs.");
			theRiver = data;
			freshRiverDisplay (idRiver);
			riverCache [riverCache.length] = {
				url: urlRiver,
				jstruct: data
				};
			},
		error: function (status) {
			console.log ("httpGetRiver: error status == " + jsonStringify (status));
			},
		dataType: "jsonp"
		});
	}
function clearRiverCache () {
	riverCache = new Array ();
	}
