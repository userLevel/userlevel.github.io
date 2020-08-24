// Copyright 2013-2014, Small Picture, Inc.

var flSetupPictureViewer = false;
var flSnapDrawerOpen = false; //if true, the drawer is open
var snapForFargo; 

document.write ("<script src=\"http://fargo.io/code/utils.js?v=1.35\"></script>"); 
document.write ("<script src=\"http://fargo.io/code/fargoVerbs.js?v=1.35\"></script>"); 
document.write ("<script src=\"http://fargo.io/cms/dateFormat.js\"></script>");
document.write ("<link href=\"http://outliner.smallpicture.com/ranchoFont.css\" rel=\"stylesheet\" type=\"text/css\">");
document.write ("<script type=\"text/javascript\" src=\"http://fargo.io/cms/snap/snap.js\"></script>");
document.write ("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://fargo.io/cms/snap/snap.css\" />");
document.write ("<script type=\"text/javascript\" src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyAPvwr-hTG0AfMXbgNXVjTkKbwUAIEKnYQ&sensor=false\"></script>"); //12/26/13 by DW
document.write ("<script src=\"http://fargo.io/code/shared/riversx.js\"></script>");
document.write ("<link rel=\"stylesheet\" href=\"http://fargo.io/code/shared/rivers.css\"/>");

function isAlpha (ch) {
	return (((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z')));
	}
function addPgfPermaLinks () { //2/23/14 by DW
	var ct = 0;
	function getKey (s) {
		var key = "";
		function skipBlanks (s) {
			while (s.length > 0) {
				if (s [0] != " ") {
					return (s);
					}
				s = string.delete (s, 1, 1);
				}
			return (s);
			}
		function skipToWord (s) {
			while (s.length > 0) {
				if (isAlpha (s [0])) {
					return (s);
					}
				s = string.delete (s, 1, 1);
				}
			return (s);
			}
		function skipPastWord (s) {
			while (s.length > 0) {
				if (s [0] == " ") {
					while (s.length > 0) {
						if (isAlpha (s [0])) {
							return (s);
							}
						s = string.delete (s, 1, 1);
						}
					}
				s = string.delete (s, 1, 1);
				}
			return (s);
			}
		function skipPastPunc (s) {
			while (s.length > 0) {
				var ch = s [0];
				if ((ch == ".") || (ch == "!") || (ch == "?")) {
					if ((s.length == 1) || (s [1] == " ")) {
						return (string.delete (s, 1, 1));
						}
					}
				s = string.delete (s, 1, 1);
				}
			return (s);
			}
		for (var i = 1; i <= 5; i++) {
			s = skipToWord (s);
			if (s.length == 0) {
				break;
				}
			key += s [0].toUpperCase ();
			s = skipPastWord (s);
			}
		return (key);
		}
	$("#idFargoMarkdown").find ("p").each (function () {
		var paragraphtext = this.innerHTML;
		var key = getKey (paragraphtext);
		if (key.length == 0) {
			key = ++ct;
			}
		var name = "a" + key;
		var permalink = "<span class=\"divPgfPermaLink\"><a href=\"#" + name + "\">#</a></span>";
		this.innerHTML = "<a name=\"" + name + "\"></a>" + paragraphtext + permalink;
		});
	
	}
function hitCounter () { //2/3/14 by DW
	var referrer = document.referrer;
	if ((pagetable.counterGroup != undefined) && (pagetable.counterServer != undefined) && (referrer.length > 0)) {
		function encode (s) {
			return (encodeURIComponent (s));
			}
		
		var thispageurl = location.href;
		if (thispageurl == undefined) {
			thispageurl = "";
			}
		if (string.endsWith (thispageurl, "#")) {
			thispageurl = string.mid (thispageurl, 1, thispageurl.length - 1);
			}
		
		var jxhr = $.ajax ({
			url: pagetable.counterServer + "?group=" + encode (pagetable.counterGroup) + "&referer=" + encode (referrer) + "&url=" + encode (thispageurl),
			dataType: "jsonp",
			jsonpCallback : "getData",
			timeout: 30000
			})
		.success (function (data, status, xhr) {
			console.log ("counter ping accepted by server.");
			})
		.error (function (status, textStatus, errorThrown) {
			console.log ("counter ping error: " + textStatus);
			});
		}
	}
function ecUL (idnum) { //called when user clicks on a wedge in the the left sidebar
	
	
	var c = document.getElementById ("idCaret" + idnum), idUL = "#idUL" + idnum;
	if (c.className == "fa fa-caret-down") {
		c.className = "fa fa-caret-right";
		$(idUL).slideUp ("fast");
		}
	else {
		c.className = "fa fa-caret-down";
		$(idUL).slideDown ("fast");
		}
	
	}
function secondsSince (when) {
	var now = new Date ();
	return ((now - when) / 1000);
	}
function getBoolean (val) { 
	switch (typeof (val)) {
		case "string":
			if (string.lower (val) == "true") {
				return (true);
				}
			break;
		case "boolean":
			return (val);
			break;
		case "number":
			if (val == 1) {
				return (true);
				}
			break;
		}
	return (false);
	}
function hidePictureViewer () {
	$("#idPictureViewer").modal ("hide");
	}
function openPictureViewer (urlPic, title) {
	if (!flSetupPictureViewer) {
		var s = 
			"<div class=\"divPictureViewer\"><div id=\"idPictureViewer\" class=\"modal hide fade\"><div class=\"modal-body\"><div class=\"divPictureViewerPicture\" id=\"idPictureViewerPicture\"></div></div><div class=\"modal-footer\"><a href=\"#\" class=\"btn btn-primary\" onclick=\"hidePictureViewer ();\">Close</a></div></div></div>"
		$("body").prepend (s)
		flSetupPictureViewer = true;
		}
	
	if (title == undefined) {
		title = "Yo mama is fine.";
		}
	
	$("#idPictureViewerPicture").html ("<img src=\"" + urlPic + "\">");
	$("#idPictureViewer").modal ("show");
	}
function viewCommentsLink () {
	var t = document.getElementById  ("idShowHideComments");
	if (t != null) {
		var c = document.getElementById ("idDisqusComments");
		if (c != null) {
			t.innerHTML = (c.style.visibility == "hidden") ? "<i class=\"fa fa-caret-right\"></i> Show comments" : "<i class=\"fa fa-caret-down\"></i> Hide comments"; 
			}
		}
	}
function showHideComments () {
	var c = document.getElementById ("idDisqusComments");
	var flwasvisible = c.style.visibility == "visible";
	c.style.visibility =  (flwasvisible) ? "hidden" : "visible";
	if (flwasvisible) { //it becomes not-visible
		c.style.height = 0;
		}
	else {
		c.style.height = "auto";
		}
	viewCommentsLink ();
	}
function initMap () { //12/26/13 by DW
	var mapCanvas = document.getElementById ("idMapCanvas");
	if (mapCanvas != null) {
		var mapOptions = {
			center: new google.maps.LatLng (pagetable.mapLatitude, pagetable.mapLongitude),
			zoom: Number (pagetable.mapZoom),
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl :false,
			overviewMapControl: false,
			rotateControl: false,
			mapTypeId: pagetable.mapType
			};
		var map = new google.maps.Map (mapCanvas, mapOptions);
		
		console.log ("initMap");
		}
	}
function backgroundProcess () {
	}
function hackDisqusComments () { //8/23/1 by DW
	//8/23/18; 10:43:00 AM by DW
		//Disqus started putting moving movies on the page, bigger than most of my blog posts
		//so I hacked this so the comments are not initially visible
	$("#idDisqusComments").css ("visibility", "hidden"); //8/23/18 by DW
	}
function startupFargoPlatform () {
	var flMapHeader = getBoolean (pagetable.flMapHeader);
	var wholepage = document.getElementById  ("idWholePage");
	var posttitle = document.getElementById  ("idPostTitle");
	var description = document.getElementById  ("idPostDescription");
	var bodytext = document.getElementById  ("idBodyText");
	var byline = document.getElementById  ("idByline"); 
	var crumbs = document.getElementById  ("idBreadcrumbs"); 
	var headlineunit = document.getElementById  ("idHeadlineUnit"); 
	
	if (byline != null) { //12/31/13 by DW
		if (getBoolean (pagetable.flHideByline)) {
			byline.style.visibility =  "hidden";
			byline.style.height = 0;
			}
		}
	if (wholepage != null) {
		if ((pagetable.backgroundImage != undefined) && (!flMapHeader)) {
			if (pagetable.backgroundImage.length > 0) { //4/7/14 by DW
				wholepage.style.backgroundImage = "url(" + pagetable.backgroundImage + ")"
				}
			}
		}
	if (posttitle != null) {
		if (pagetable.titleColor != undefined) {
			posttitle.style.color = pagetable.titleColor;
			}
		posttitle.innerHTML = pagetable.text;
		}
	if (description != null) {
		if (pagetable.description != undefined) {
			description.innerHTML = pagetable.description;
			}
		if (pagetable.subheadColor != undefined) {
			description.style.color = pagetable.subheadColor; 
			}
		}
	if (bodytext != null) {
		bodytext.style.color = "#333332"; 
		}
	
	//pagetable initializations 
		pagetable.type = pagetable.type.toLowerCase ();
	
	//social media links
		var twitter = document.getElementById  ("idTwitterLink");
		if ((twitter != null) && (pagetable.authorTwitterAccount != undefined)) {
			twitter.href = "http://twitter.com/" + pagetable.authorTwitterAccount;
			}
		
		var facebook = document.getElementById  ("idFacebookLink");
		if ((facebook != null) && (pagetable.authorFacebookAccount != undefined)) {
			facebook.href = "http://facebook.com/" + pagetable.authorFacebookAccount;
			}
		
		var rss = document.getElementById  ("idRssLink");
		if ((rss != null) && (pagetable.opmlFeed != undefined)) {
			rss.href = pagetable.opmlFeed;
			}
	//initialize snap.js
		if ((pagetable.flSnapEnabled == undefined) || (getBoolean (pagetable.flSnapEnabled))) {
			var snapcontent = document.getElementById ("idSnapContent");
			var openicon = document.getElementById ("idSnapOpenIcon");
			
			if (snapcontent != null) {
				snapForFargo = new Snap ({
					element: snapcontent, touchToDrag: false
					});
				}
			if (openicon != null) {
				openicon.addEventListener ("click", function () {
					if (flSnapDrawerOpen) {
						snapForFargo.close ("left");
						}
					else {
						snapForFargo.open ("left");
						}
					flSnapDrawerOpen = !flSnapDrawerOpen;
					});
				}
			}
	//bloghome initializations -- 1/7/14 by DW
		if (pagetable.type == "bloghome") {
			if (pagetable.path.length > 0) { //not on the site home page
				headlineunit.style.display = "block";
				
				}
			}
	//presentation initialization -- 1/30/14 by DW
		if (pagetable.type == "presentation") {
			if (pagetable.theme == undefined) { 
				pagetable.theme = "default";
				}
			if (pagetable.transition == undefined) {
				pagetable.transition = "default";
				}
			Reveal.initialize ({
				controls: true,
				progress: true,
				history: true,
				keyboard: true,
				overview: true,
				loop: false,
				autoSlide: 0,
				mouseWheel: true,
				rollingLinks: false,
				theme: pagetable.theme, // available themes are in /css/theme
				transition: pagetable.transition, // default/cube/page/concave/linear(2d)
				dependencies: [
					{ src: 'http://static.opml.org/opmlEditor/reveal/lib/js/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },
					{ src: 'http://static.opml.org/opmlEditor/reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
					{ src: 'http://static.opml.org/opmlEditor/reveal/lib/js/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
					{ src: 'http://static.opml.org/opmlEditor/reveal/lib/js/data-markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
					{ src: 'http://static.opml.org/opmlEditor/reveal/socket.io/socket.io.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
					{ src: 'http://static.opml.org/opmlEditor/reveal/plugin/speakernotes/client.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
					]
				});
			}
	//hit counter -- 2/3/14 by DW
		if (getBoolean (pagetable.flHitCounter)) {
			hitCounter ();
			}
	//paragraph permalinks -- 2/23/14 by DW
		if (getBoolean (pagetable.flPgfPermaLinks)) {
			addPgfPermaLinks ();
			}
	//if the menu is fixed, move the content down by 110 pixels -- 3/13/14 by DW
		if (getBoolean (pagetable.flFixedMenu)) {
			var container = document.getElementById  ("idOutlineContainer"); 
			if (container != null) {
				container.style.marginTop = "110px";
				}
			}
	
	hackDisqusComments (); //8/23/1 by DW
	
	viewCommentsLink ();
	
	if (flMapHeader) {
		initMap (); 
		}
	
	console.log ("startupFargoPlatform.");
	
	}
