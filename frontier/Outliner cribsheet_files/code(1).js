var appConsts = {
	domain: stringNthField (window.location.href, "/", 3)
	};
var savedState = { //9/22/17 by DW
	expansionStates: {
		}
	};
function collapseEverything () {
	$(".aOutlineWedgeLink i").each (function () {
		var id = $(this).attr ("id"); //something like idOutlineWedge17
		var idnum = stringDelete (id, 1, "idOutlineWedge".length);
		if (idnum != 0) {
			var idWedge = "#idOutlineWedge" + idnum;
			var idLevel = "#idOutlineLevel" + idnum;
			$(idWedge).attr ("class", "fa fa-caret-right");
			$(idWedge).css ("color", "black");
			$(idLevel).css ("display", "none");
			}
		});
	}
function saveState () { //9/22/17 by DW
	localStorage.savedState = jsonStringify (savedState);
	console.log ("saveState: localStorage.savedState == " + localStorage.savedState);
	}
function restoreExpansionState () { //9/26/17 by DW
	try {
		if (savedState.expansionStates [window.location.href] !== undefined) {
			collapseEverything ();
			applyExpansionState (savedState.expansionStates [window.location.href]);
			}
		}
	catch (err) {
		console.log ("restoreExpansionState: err.message == " + err.message);
		}
	}
function getOpmlHeadElements (xstruct) {
	var adropml = xmlGetAddress (xstruct, "opml");
	var adrhead = xmlGetAddress (adropml, "head");
	return (xmlGetSubValues (adrhead));
	}
function startDisqus (disqusGroup) {
	(function() {
		var dsq = document.createElement ('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqusGroup + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
	(function() {
		var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
		s.src = '//' + disqusGroup + '.disqus.com/count.js';
		(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
		}());
	}
	
function typeToClass (type) {
	switch (type) {
		case "blogpost":
			return ("divtypeblogpost");
		}
	return ("divtypedefault");
	}
function readGlossary (urlOpmlFile, glossary, callback) {
	var whenstart = new Date ();
	if ((urlOpmlFile !== undefined) && (urlOpmlFile.length > 0)) {
		readHttpFileThruProxy (urlOpmlFile, undefined, function (opmltext) {
			if (opmltext != undefined) {
				var xstruct = $($.parseXML (opmltext)), ctread = 0;
				var adropml = xmlGetAddress (xstruct, "opml");
				var adrbody = xmlGetAddress (adropml, "body");
				xmlOneLevelVisit (adrbody, function (adrx) {
					if (!xmlIsComment (adrx)) {
						var name = xmlGetTextAtt (adrx);
						if (name.length > 0) {
							var subtext = xmlGetSubText (adrx, false); //8/11/16 by DW -- don't add tabs and newlines to the glossary text
							ctread++;
							glossary [name] = subtext;
							}
						}
					return (true);
					});
				console.log ("readGlossary: read " + ctread + " items in " + secondsSince (whenstart) + " secs.");
				}
			if (callback !== undefined) {
				callback ();
				}
			});
		}
	else {
		if (callback !== undefined) {
			callback ();
			}
		}
	}
function viewTypedOutline (headElements, theOutline, callback) {
	var flDisqusComments = getBoolean (headElements.flDisqusComments), disqusGroup = "smallpict";
	if (headElements.disqusGroup !== undefined) {
		disqusGroup = headElements.disqusGroup;
		}
	$("#idOutlineTitle").html (headElements.title);
	
	if (headElements.description !== undefined) { //3/18/20 by DW
		$("#idOutlineDescription").html (headElements.description);
		}
	if (headElements.footer !== undefined) { //3/18/20 by DW
		$("#idOutlineFooter").html (headElements.footer);
		}
	
	
	if (headElements.dateModified !== undefined) {
		$("#idWhenLastUpdate").html (dateFormat (new Date (headElements.dateModified), "dddd mmmm d, yyyy; h:MM TT Z"));
		}
	if (headElements.dateCreated !== undefined) {
		$("#idWhenCreated").html (dateFormat (new Date (headElements.dateCreated), "dddd mmmm d, yyyy; h:MM TT Z"));
		}
	
	var type = (headElements.type === undefined) ? "blogpost" : headElements.type;
	$("#idOutlineDisplayer").addClass (typeToClass (type));
	
	var outlineHtml = renderOutlineBrowser (theOutline, false, undefined, undefined, true);
	outlineHtml = emojiProcess (outlineHtml);
	
	function finishStart () {
		if (flDisqusComments) {
			startDisqus (disqusGroup);
			$("#idComments").css ("display", "block");
			}
		if (headElements.urlCustomCss !== undefined) {
			console.log ("Inserting custom css: " + headElements.urlCustomCss);
			var header = document.getElementsByTagName ("head") [0];
			var styleSheet = document.createElement ("link");
			styleSheet.rel = "stylesheet";
			styleSheet.type = "text/css";
			styleSheet.href = headElements.urlCustomCss;
			header.appendChild (styleSheet);
			}
		callback ();
		}
	
	$("#idOutlineDisplayer").html (outlineHtml);
	if (headElements.urlGlossary !== undefined) {
		var glossary = new Object ();
		readGlossary (headElements.urlGlossary, glossary, function () {
			outlineHtml = multipleReplaceAll (outlineHtml, glossary);
			$("#idOutlineDisplayer").html (outlineHtml);
			finishStart ();
			});
		}
	else {
		finishStart ();
		}
	}
function everySecond () {
	}
function setXmlIcon (urlOpml) {
	$("#idXmlIcon").html ("<a href=\"" + urlOpml + "\"><img src=\"http://scripting.com/images/xml.gif\" widt=\"36\" height=\"14\"></a>");
	console.log ("setXmlIcon: urlOpmlFile == " + urlOpml);
	}
function startup () {
	console.log ("startup");
	
	if (localStorage.savedState !== undefined) { //9/22/17 by DW
		savedState = JSON.parse (localStorage.savedState);
		}
	
	hitCounter (); 
	initGoogleAnalytics (); 
	
	//add top level permalinks
		var toplevel = jstruct.opml.body.subs;
		for (var i = 0; i < toplevel.length; i++) {
			toplevel [i].flPermalink = true;
			}
	outlineBrowserData.flTextBasedPermalinks = false;
	
	viewTypedOutline (jstruct.opml.head, jstruct.opml.body, function () {
		setXmlIcon (getAppUrl () + "?format=opml");
		outlineBrowserData.expandCollapseCallback = function (idnum) {
			if (savedState.expansionStates === undefined) {
				savedState.expansionStates = new Object ();
				}
			savedState.expansionStates [window.location.href] = getExpansionState ();
			saveState ();
			}
		});
	
	
	self.setInterval (everySecond, 1000); 
	}
