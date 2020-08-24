// Copyright 2013-2014, Small Picture, Inc.

var defaultUtilsOutliner = "#outliner"; //by default outliner ops apply to this outline, but you can change it, 3/2/13 by DW
var appTypeIcons = {
	"blogpost": "file-text-o",
	"essay": "file-text-o", //2/11/13 by DW
	"code": "laptop",
	"directory": "folder-open-o",
	"discusstree": "comments",
	"home": "home",
	"html": "file-text-o",
	"icon-comment": "comment-o", //2/16/13 by DW
	"icon-star": "star-empty", //2/16/13 by DW
	"icon-time": "time", //2/16/13 by DW
	"icon-user": "user", //2/16/13 by DW
	"include": "mail-forward", //2/28/14 by DW
	"index": "file-text-o",
	"link": "bookmark-o",
	"outline": "file-text-o",
	"medium": "file-text-o", //2/12/14 by DW
	"photo": "camera",
	"presentation": "file-text-o",
	"redirect": "refresh",
	"river": "file-text-o",
	"rss": "rss",
	"tabs": "file-text-o",
	"thread": "comments",
	"thumblist": "th",
	"profile": "user", //5/14/13 by DW
	"calendar": "calendar", //6/3/13 by DW
	"markdown": "file-text-o", //6/3/13 by DW
	"tweet": "twitter", //6/10/13 by DW
	"idea": "lightbulb-o", //3/11/14 by DW
	"metaWeblogPost": "file-text-o",
	"twitterFriend": "user" //6/27/14 by DW
	}
var initialOpmltext = 
	"<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><opml version=\"2.0\"><head><title>Untitled</title></head><body><outline text=\"\"/></body></opml>";
document.write('<script src="http://outliner.smallpicture.com/js/jBeep/jBeep.min.js" type="text/javascript"></script>');
//cookies
	function getCookie (cookieName) { { 
		var i,x,y,ARRcookies=document.cookie.split(";");;
		for (i=0;i<ARRcookies.length;i++) { { 
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));;
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);;
			x=x.replace(/^\s+|\s+$/g,"");;
			if (x==cookieName) { { 
				return unescape(y);;
				};
				}
			};
			}
		};
		}
	function setCookie (cookieName, value, exdays) { { 
		var exdate = new Date ();;
		exdate.setDate (exdate.getDate () + exdays);;
		var cookieValue = escape (value) + ((exdays == null) ? "" : "; expires="+exdate.toUTCString());;
		document.cookie = cookieName + "=" + cookieValue;;
		};
		}
	function deleteCookie (cookieName) {  { //2/22/13 by DW
		document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";;
		};
		}
	function cookiesEnabled () {  { //3/20/13 by DW -- returns true if cookies are enabled
		var flHaveCookies;;
		setCookie ("bleh", "123");;
		flHaveCookies = getCookie ("bleh") != undefined;;
		deleteCookie ("bleh");;
		return (flHaveCookies);;
		};
		}
//beep
	function speakerBeep () {
		if ((appPrefs.flBeepOnUpdate == undefined) || appPrefs.flBeepOnUpdate) {
			jBeep ("http://outliner.smallpicture.com/js/jBeep/beep.wav");
			}
		}
//op glue routines
	function opUndo () {
		return ($(defaultUtilsOutliner).concord ().op.undo ())
		}
	function opCut () {
		return ($(defaultUtilsOutliner).concord ().op.cut ())
		}
	function opCopy () {
		return ($(defaultUtilsOutliner).concord ().op.copy ())
		}
	function opPaste () {
		return ($(defaultUtilsOutliner).concord ().op.paste ())
		}
	function opReorg (dir, count) {
		return ($(defaultUtilsOutliner).concord().op.reorg (dir, count));
		}
	function opSetFont (font, fontsize, lineheight) {
		$(defaultUtilsOutliner).concord().prefs({"outlineFont": font, "outlineFontSize": fontsize, "outlineLineHeight": lineheight});
		}
	function opPromote () {
		$(defaultUtilsOutliner).concord().op.promote();
		}
	function opDemote () {
		$(defaultUtilsOutliner).concord().op.demote();
		}
	function opBold () {
		return ($(defaultUtilsOutliner).concord().op.bold ());
		}
	function opItalic () {
		return ($(defaultUtilsOutliner).concord().op.italic ());
		}
	function opLink (url) {
		return ($(defaultUtilsOutliner).concord().op.link (url));
		}
	function opSetTextMode (fltextmode) {
		$(defaultUtilsOutliner).concord ().op.setTextMode (fltextmode);
		}
	function opInTextMode () {
		return ($(defaultUtilsOutliner).concord ().op.inTextMode ());
		}
	
	function opGetAtts () {
		return $(defaultUtilsOutliner).concord().op.attributes.getAll();
		}
	function opGetOneAtt (name) {
		return $(defaultUtilsOutliner).concord().op.attributes.getOne (name);
		}
	function opHasAtt (name) {
		return (opGetOneAtt (name) != undefined);
		}
	function opSetOneAtt (name, value) {
		return $(defaultUtilsOutliner).concord().op.attributes.setOne (name, value);
		}
	function opSetAtts (atts) {
		return $(defaultUtilsOutliner).concord().op.attributes.setGroup(atts);
		}
	function opAddAtts (atts) { //2/1/13 by DW
		return $(defaultUtilsOutliner).concord().op.attributes.addGroup(atts);
		}
	
	function opSetStyle (css) {
		return $(defaultUtilsOutliner).concord ().op.setStyle (css);
		}
	
	function opGetLineText () {
		return ($(defaultUtilsOutliner).concord().op.getLineText());
		}
	function opExpand () {
		return ($(defaultUtilsOutliner).concord().op.expand());
		}
	function opExpandAllLevels () {
		return ($(defaultUtilsOutliner).concord().op.expandAllLevels());
		}
	function opExpandEverything () {
		return ($(defaultUtilsOutliner).concord().op.fullExpand());
		}
	function opCollapse () {
		return ($(defaultUtilsOutliner).concord().op.collapse());
		}
	function opIsComment () {
		return ($(defaultUtilsOutliner).concord ().script.isComment ());
		}
	function opMakeComment () {
		return ($(defaultUtilsOutliner).concord ().script.makeComment ());
		}
	function opUnComment () {
		return ($(defaultUtilsOutliner).concord ().script.unComment ());
		}
	function opToggleComment () {
		if (opIsComment ()) {
			opUnComment ();
			}
		else {
			opMakeComment ();
			}
		}
	function opCollapseEverything () {
		return ($(defaultUtilsOutliner).concord().op.fullCollapse());
		}
	function opInsert (s, dir) {
		return ($(defaultUtilsOutliner).concord().op.insert(s, dir));
		}
	function opInsertImage (url) {
		return ($(defaultUtilsOutliner).concord ().op.insertImage (url));
		}
	function opSetLineText (s) {
		return ($(defaultUtilsOutliner).concord().op.setLineText(s));
		}
	function opDeleteSubs () {
		return ($(defaultUtilsOutliner).concord().op.deleteSubs());
		}
	function opCountSubs () {
		return ($(defaultUtilsOutliner).concord().op.countSubs());
		}
	function opHasSubs () { //3/8/13 by DW
		return (opCountSubs () > 0);
		}
	function opSubsExpanded () {
		return ($(defaultUtilsOutliner).concord().op.subsExpanded());
		}
	function opGo (dir, ct) {
		return ($(defaultUtilsOutliner).concord().op.go(dir, ct));
		}
	function opFirstSummit () {
		opGo (left, 32767);
		opGo (up, 32767);
		}
	function opXmlToOutline (xmltext) {
		return ($(defaultUtilsOutliner).concord ().op.xmlToOutline (xmltext));
		}
	function opInsertXml (xmltext, dir) { //2/14/13 by DW
		return ($(defaultUtilsOutliner).concord ().op.insertXml (xmltext, dir));
		}
	function opOutlineToXml (ownerName, ownerEmail, ownerId) {
		return ($(defaultUtilsOutliner).concord ().op.outlineToXml (ownerName, ownerEmail, ownerId));
		}
	function opCursorToXml () {
		return ($(defaultUtilsOutliner).concord ().op.cursorToXml ());
		}
	function opSetTitle (title) {
		return ($(defaultUtilsOutliner).concord ().op.setTitle (title));
		}
	function opGetTitle () {
		return ($(defaultUtilsOutliner).concord ().op.getTitle ());
		}
	function opHasChanged () {
		return ($(defaultUtilsOutliner).concord ().op.changed ());
		}
	function opClearChanged () {
		return ($(defaultUtilsOutliner).concord ().op.clearChanged ());
		}
	function opMarkChanged () { //3/24/13 by DW
		return ($(defaultUtilsOutliner).concord ().op.markChanged ());
		}
	function opRedraw () { //3/9/13 by DW
		return ($(defaultUtilsOutliner).concord ().op.redraw ());
		}
	function opGetHeaders () { //4/20/14 by DW
		return ($(defaultUtilsOutliner).concord ().op.getHeaders ());
		}
	
	
	
//prefs dialog routines -- the dialog must be #idPrefsDialog
	$(document).ready (function () {
		$("#idPrefsDialog").bind ('show', function () {
			var inputs = document.getElementById ("idPrefsDialog").getElementsByTagName ("input"), i;
			for (var i = 0; i < inputs.length; i++) {
				if (appPrefs [inputs [i].name] != undefined) {
					if (inputs [i].type == "checkbox") {
						inputs [i].checked = appPrefs [inputs [i].name];
						}
					else {
						inputs [i].value = appPrefs [inputs [i].name];
						}
					}
				}
			
			var textareas = document.getElementById ("idPrefsDialog").getElementsByTagName ("textarea"), i;
			for (var i = 0; i < textareas.length; i++) {
				if (appPrefs [textareas [i].name] != undefined) {
					textareas [i].value = appPrefs [textareas [i].name];
					}
				}
			});
		});
	function prefsDialogShow () {
		
		try { //6/7/14 by DW
			concord.stopListening (); //3/11/13 by DW
			}
		catch (err) {
			}
		
		$("#idPrefsDialog").modal ('show'); 
		};
	function prefsCloseDialog() {
		
		try { //6/7/14 by DW
			concord.resumeListening (); //3/11/13 by DW
			}
		catch (err) {
			}
		
		$("#idPrefsDialog").modal ('hide'); 
		};
	
	function fixUrl (url) {
		var lowerurl;
		url = trimWhitespace (url);
		lowerurl = url.toLowerCase ();
		if ((lowerurl.indexOf ("http://") != 0) && (lowerurl.indexOf ("https://") != 0)) {
			return ("http://" + url);
			}
		return (url);
		}
	
	function prefsOkClicked () {
		var inputs = document.getElementById ("idPrefsDialog").getElementsByTagName ("input"), i;
		for (var i = 0; i < inputs.length; i++) {
			if (inputs [i].type == "checkbox") {
				appPrefs [inputs [i].name] = inputs [i].checked;
				}
			else {
				appPrefs [inputs [i].name] = inputs [i].value;
				}
			}
		
		var textareas = document.getElementById ("idPrefsDialog").getElementsByTagName ("textarea"), i;
		for (var i = 0; i < textareas.length; i++) {
			appPrefs [textareas [i].name] = textareas [i].value;
			}
		
		if (appPrefs.wordpressBlogUrl != undefined) {
			appPrefs.wordpressBlogUrl = fixUrl (appPrefs.wordpressBlogUrl); //3/10/13 by DW
			}
		
		prefsCloseDialog ();
		applyPrefs ();
		prefsToCookie ();
		};
//reading OPML files
	
	function getReadHttpUrl () {
		var server;
		try {
			server = cmsGetPublishServer ();
			}
		catch (err) {
			server = defaultFargoPubServer;
			}
		return ("http://" + server + "/httpReadUrl");
		}
	
	function readOpmlIntoOutline (opmlurl, idoutline, callback, flRenderMode, flReadOnly) {
		
		if (flRenderMode == undefined) {
			flRenderMode = true;
			}
		if (flReadOnly == undefined) {
			flReadOnly = true;
			}
		
		var jxhr = $.ajax ({ 
			url: getReadHttpUrl () + "?url=" + encodeURIComponent (opmlurl) + "&type=" + encodeURIComponent ("text/plain"),
			dataType: "text" , 
			timeout: 30000 
			}) 
		.success (function (data, status) { 
			var id = "#" + idoutline;
			$(id).concord ().op.xmlToOutline (data); 
			$(id).concord ().prefs ({"outlineFont": "Arial", "outlineFontSize": 16, "outlineLineHeight": 24, "renderMode":flRenderMode, "readonly":flReadOnly, "typeIcons": appTypeIcons}); 
				
			if (callback != undefined) { //3/20/13 by DW
				callback ();
				}
			httpReadStatus = status;
			httpReadData = data;
			}) 
		.error (function (status) { 
			httpReadStatus = status;
			});
		}
	function importOpmlIntoOutline (opmlurl, idoutline) { //3/24/13 by DW
		var jxhr = $.ajax ({ 
			url: getReadHttpUrl () + "?url=" + encodeURIComponent (opmlurl) + "&type=" + encodeURIComponent ("text/plain"),
			dataType: "text" , 
			timeout: 30000 
			}) 
		.success (function (data, status) { 
			var id = "#" + idoutline;
			$(id).concord ().op.insertXml (data, down); 
			$(id).concord ().op.go (down, 1); //4/4/13 by DW
			httpReadStatus = status;
			httpReadData = data;
			}) 
		.error (function (status) { 
			httpReadStatus = status;
			});
		}
//ask dialog
	var flAskDialogSetUp = false;
	var askDialogCallback;
	
	function setupAskDialog () {
		var s = 
			"<div class=\"divAskDialog\" style=\"left: 50%; width: 570px;\"><div id=\"idAskDialog\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"windowTitleLabel\" aria-hidden=\"true\"><div class=\"modal-header\"><a href=\"#\" class=\"close\" data-dismiss=\"modal\">&times;</a>";
		s +=
			"<h3 id=\"idAskDialogPrompt\" style=\"font-size: 18px;\"></h3></div><div class=\"modal-body\"><input class=\"xlarge\" id=\"idAskDialogInput\" name=\"xlInput\" type=\"text\" style=\"font-size: 17px; padding: 3px; height: auto; width: 515px;\" /></div><div class=\"modal-footer\"><a href=\"#\" class=\"btn\" onclick=\"closeAskDialog ();\" style=\"width: 80px; margin-left: 5px;\">Cancel</a><a href=\"#\" class=\"btn btn-primary\" onclick=\"okAskDialog ();\" style=\"width: 80px; margin-left: 5px;\">OK</a></div></div></div>";
		$("body").prepend (s)
		$("#idAskDialogInput").on ("keydown", function (event) { //3/22/13 by DW
			if (event.which == 13) {
				okAskDialog ();
				return (false);
				}
			});
		return (s);
		}
	function closeAskDialog () {
		$("#idAskDialog").modal ('hide'); 
		};
	function okAskDialog () {
		var input = document.getElementById ("idAskDialogInput");
		askDialogCallback (input.value);
		closeAskDialog ();
		};
	function askDialog (prompt, defaultvalue, placeholder, askcallback, type) {
		var input;
		if (!flAskDialogSetUp) {
			setupAskDialog ();
			flAskDialogSetUp = true;
			}
		input = document.getElementById ("idAskDialogInput");
		if (defaultvalue == undefined) {
			defaultvalue = "";
			}
		input.value = defaultvalue;
		
		if (type == undefined) {
			type = "text";
			}
		input.type = type; //8/26/13 by DW
		
		input.placeholder = placeholder;
		askDialogCallback = askcallback; 
		document.getElementById ("idAskDialogPrompt").innerHTML = prompt;
		$("#idAskDialog").on("shown", function(){
			input.focus();
			input.select();
			});
		$("#idAskDialog").modal ("show");
		}
	
	
	
//alert dialog
	var flAlertDialogSetUp = false;
	
	function setupAlertDialog () {
		var s = 
			"<div id=\"idAlertDialog\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"windowTitleLabel\" aria-hidden=\"true\" style=\"width: 450px; background-color: whitesmoke;\"><img src=\"http://static.scripting.com/larryKing/images/2013/04/13/alert.gif\" width=\"32\" height=\"32\" border=\"0\" alt=\"alert icon\" style=\"float: left; margin-left: 15px; margin-top: 15px;\"><div id=\"idAlertDialogPrompt\" style=\"font-size: 16px; line-height: 130%; margin-left: 65px; margin-top:15px; margin-right:15px;\"></div><a href=\"#\" class=\"btn btn-primary\" onclick=\"okAlertDialog ();\" style=\"width: 70px; margin-bottom: 8px; margin-right: 15px; margin-top: 30px; float: right;\">OK</a></div>"
		$("body").prepend (s);
		$("#idAlertDialog").on ("keydown", function (event) { //5/6/13 by DW
			if (event.which == 13) {
				okAlertDialog ();
				return (false);
				}
			});
		return (s);
		}
	function okAlertDialog () {
		$("#idAlertDialog").modal ('hide'); 
		};
	function alertDialog (prompt) {
		if (!flAlertDialogSetUp) {
			setupAlertDialog ();
			flAlertDialogSetUp = true;
			}
		document.getElementById ("idAlertDialogPrompt").innerHTML = prompt;
		$("#idAlertDialog").modal ("show");
		}
	
	
	
	
//confirm dialog
	var flConfirmDialogSetUp = false;
	var confirmDialogCallback;
	
	function setupConfirmDialog () {
		var s = 
			"<div class=\"divConfirmDialog\"><div id=\"idConfirmDialog\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"windowTitleLabel\" aria-hidden=\"true\" style=\"width: 450px; display: none;\"><img src=\"http://static.scripting.com/larryKing/images/2013/03/16/questionMarkIcon.gif\" width=\"42\" height=\"42\" alt=\"confirm icon\" style=\"float: left; margin-left: 15px; margin-top: 15px;\"><div id=\"idConfirmDialogPrompt\" style=\"font-size: 16px; line-height: 130%; margin-left: 65px; margin-top:15px; margin-right:15px;\"></div><a href=\"#\" class=\"btn btn-primary\" onclick=\"okConfirmDialog ();\" style=\"width: 70px; margin-bottom: 8px; margin-right: 15px; margin-top: 30px; float: right;\">OK</a><a href=\"#\" class=\"btn\" onclick=\"closeConfirmDialog ();\" style=\"width: 70px; margin-bottom: 8px; margin-right: 15px; margin-top: 30px; float: right;\">Cancel</a></div></div>"
		$("body").prepend (s)
		$("#idConfirmDialog").on ("keydown", function (event) { //5/6/13 by DW
			if (event.which == 13) {
				okConfirmDialog ();
				return (false);
				}
			});
		return (s);
		}
	function closeConfirmDialog () {
		$("#idConfirmDialog").modal ('hide'); 
		};
	function okConfirmDialog () {
		$("#idConfirmDialog").modal ('hide'); 
		confirmDialogCallback ();
		};
	function confirmDialog (prompt, callback) {
		if (!flConfirmDialogSetUp) {
			setupConfirmDialog ();
			flConfirmDialogSetUp = true;
			}
		document.getElementById ("idConfirmDialogPrompt").innerHTML = prompt;
		confirmDialogCallback = callback;
		$("#idConfirmDialog").modal ("show");
		}
	
//attributes dialog -- the dialog must be #idAttsDialog'
	function tableDeleteRow (r) {
		var table = document.getElementById ("idAttEditTable");
		var ixrow = r.parentNode.parentNode.parentNode.rowIndex;
		table.deleteRow (ixrow);
		}
	function tableDeleteAllRows () {
		var table = document.getElementById ("idAttEditTable");
		$(table).empty ();
		}
	function tableAddRow (name, value, flSetFocus) {
		var table = document.getElementById ("idAttEditTable");
		var row = table.insertRow (-1);
		
		var cell1 = row.insertCell (0);
		var cell2 = row.insertCell (1);
		var cell3 = row.insertCell (2);
		
		cell1.innerHTML = "<input type='text' value='" + name + "'>"
		cell2.innerHTML = "<input type='text' value='" + value + "'>"
		cell3.innerHTML = "<span style='cursor:pointer'><a onclick='tableDeleteRow (this)'><i class='fa fa-trash'></i></a></span>"
		
		if (flSetFocus) {
			cell1.firstChild.focus ();
			}
		}
	function attsCloseDialog () {
		$('#idAttsDialog').modal ('hide'); 
		};
	function attsOkClicked () {
		var table = document.getElementById ("idAttEditTable"), i, row;
		var atts = {};
		for (i = 0; row = table.rows [i]; i++) {
			var str1 = row.cells [0].childNodes [0].value, str2 = row.cells [1].childNodes [0].value;
			atts [str1] = str2;
			}
		opSetAtts (atts); //3/14/13 by DW -- changed from opAddAtts
		attsCloseDialog ();
		opRedraw (); //3/9/13 by DW
		};
	function setupAttsDialog () {
		var obj = opGetAtts ();
		tableDeleteAllRows ();
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				tableAddRow (p, obj [p], false);
				}
			}
		var table = document.getElementById ("idAttEditTable");
		if (table.rows.length == 0) {
			tableAddRow ("", "", false);
			}
		}
	$(document).ready (function () {
		$("#idAttsDialog").on ("keydown", function (event) { //5/6/13 by DW
			if (event.which == 13) {
				attsOkClicked ();
				return (false);
				}
			});
		$('#idAttsDialog').bind ('show', function () {
			setupAttsDialog ();
			});
		});
	function attsDialogShow () {
		$('#idAttsDialog').modal ('show'); 
		};
//blogging code 
	var updateBlogpostUrl = "http://ajax1.fargo.io/ajax/updateBlogpost", updateBlogpostStatus;
	var getCategoriesUrl = "http://ajax1.fargo.io/ajax/getBlogCategories", getCategoriesStatus, blogCategories;
	var blogPostNodeType = "metaWeblogPost", afterPostCallback;
	
	function saveBlogPostThruServer (title, msgbody, idpost, blogpost, wordpressBlogUrl) {
		
		if (wordpressBlogUrl == undefined) { //4/20/14 by DW
			wordpressBlogUrl = appPrefs.wordpressBlogUrl;
			}
		
		var postbody = "postBody=" + encodeURIComponent (msgbody) + "&weblogUrl=" + encodeURIComponent (wordpressBlogUrl) + "&idPost=" + encodeURIComponent (idpost) + "&postTitle=" + encodeURIComponent (title) + "&blogUsername=" + encodeURIComponent (appPrefs.wordpressUsername) + "&blogPassword=" + encodeURIComponent (appPrefs.wordpressPassword);
		console.log ("saveBlogPostThruServer: saving \"" + title + ".\"");
		var jxhr = $.ajax ({ 
			url: updateBlogpostUrl,
			data: postbody,
			type: "POST",
			dataType: "jsonp" , 
			timeout: 30000,
			jsonpCallback : "getData"
			}) 
		.success (function (data, status) { 
			updateBlogpostStatus = status;
			if (data.error != undefined) { //4/13/13 by DW
				speakerBeep ();
				alertDialog (data.error);
				return;
				}
			if (blogpost.attributes.getOne  ("idpost") == undefined) {
				blogpost.attributes.setOne ("idpost", data.idpost);
				}
			if (blogpost.attributes.getOne  ("url") == undefined) {
				blogpost.attributes.setOne ("url", data.link);
				}
			//bump ctsaves att on blogpost headline -- 1/31/13 by DW
				var ctsaves = blogpost.attributes.getOne ("ctSaves"); 
				if (ctsaves == undefined) {
					ctsaves = 0;
					}
				blogpost.attributes.setOne ("ctSaves", ++ctsaves);
			if (afterBlogpostPostCallback != undefined) { //4/30/13 by DW
				afterBlogpostPostCallback ();
				}
			speakerBeep ();
			}) 
		.error (function (status) { 
			updateBlogpostStatus = status;
			});
		}
	function saveBlogPost () {
		var blogpost = null, title, idpost, listopen = "<ul class=\"ulConcord\">\r\n", listclose = "</ul>\r\n";
		var content = null, outlinelevel = 1, headers = opGetHeaders ();
		$(defaultUtilsOutliner).concord ().op.visitToSummit (
			function (headline) {
				var t = headline.attributes.getOne ("type");
				if (t == blogPostNodeType) { 
					blogpost = headline; //blogpost found, lets store it
					idpost = headline.attributes.getOne ("idpost");
					if (idpost == undefined) {
						idpost = 0;
						}
					title = headline.getLineText ();
					return (false); //halt the traversal
					}
				else {
					return (true); //blogpost not found, keep traversing
					}
				}
			);
		if (blogpost != null) { //blogpost was found
			content = ""; 
			var visitSub = function (sub) {
				var isComment = sub.attributes.getOne ("isComment"); //5/22/13 by DW
				if ((isComment == undefined) || (isComment == "false")) { 
					if (appPrefs.flWordPressMarkdown) { //5/4/13 by DW
						content += sub.getLineText () + "\r\n"
						if (sub.countSubs () > 0) {
							outlinelevel++;
							sub.visitLevel (visitSub); 
							outlinelevel--;
							}
						}
					else {
						if (outlinelevel == 1) {
							content += "<p class=\"pConcord\">" + sub.getLineText () + "</p>\r\n"
							}
						else {
							content += filledString ("\t", outlinelevel) + "<li class=\"liConcord liLevel" + outlinelevel + "\" style=\"list-style-type: none;\">" + sub.getLineText () + "</li>\r\n"
							}
						if (sub.countSubs () > 0) {
							outlinelevel++;
							content += filledString ("\t", outlinelevel) + listopen; 
							outlinelevel++;
							sub.visitLevel (visitSub); 
							outlinelevel--;
							content += filledString ("\t", outlinelevel) + listclose;
							outlinelevel--;
							}
						}
					}
				};
			blogpost.visitLevel (visitSub);
			
			if (appPrefs.flWordPressMarkdown) { //5/4/13 by DW
				var converter = new Markdown.Converter ();
				content = converter.makeHtml (content);
				console.log (content);
				}
			
			
			saveBlogPostThruServer (title, content, idpost, blogpost, headers.wordpressBlogUrl); //4/20/14 by DW -- added headers.wordpressBlogUrl param
			
			return (true);
			}
		return (false); //we didn't save anything, because nothing on the path to the summit has the type att
		}
	
	function saveConfirmed () {
		opSetOneAtt ("type", blogPostNodeType);
		saveBlogPost ();
		}
	function saveBlogPostClick () { //the user clicked the icon (or something) to save to the blog
		opSetTextMode (false) //3/10/13 by DW
		if (!saveBlogPost ()) {
			confirmDialog ("Save \"" + opGetLineText () + "\" as a blog post?", saveConfirmed);
			}
		}
	
	function viewBlogHome () {
		window.open (appPrefs.wordpressBlogUrl);
		}
	function openMetaWeblog () { 
		var flopened = false;
		$(defaultUtilsOutliner).concord ().op.visitToSummit (
			function (op) {
				if (op.attributes.getOne ("type") == "metaWeblogPost") { 
					var url = op.attributes.getOne ("url");
					if (url != undefined) {
						flopened = true;
						window.open (url);
						return (false); //stop traversal
						}
					}
				return (true) //keep going
				}
			);
		return (flopened);
		}
//send to feed
	var sendToFeedUrl = "http://feedserver.smallpicture.com/ajax/sendToFeed", sendToFeedStatus, sendToFeedData;
	var stfOpmlUrl, stfShortname, stfFullname, stfIdAtt, stfKeyAtt; 
	var stfCommunityName = "community";
	
	function sendFeedToServer () {
		var extraparams = "";
		if ((stfIdAtt != undefined) && (stfKeyAtt != undefined)) { //5/8/13 by DW
			extraparams = "&id=" + encodeURIComponent (stfIdAtt) + "&key=" + encodeURIComponent (stfKeyAtt);
			}
		var jxhr = $.ajax ({ 
			url: sendToFeedUrl + "?feedname=" + stfCommunityName + "&opmlurl=" + encodeURIComponent (stfOpmlUrl) + "&shortname=" + encodeURIComponent (stfShortname) + "&fullname=" + encodeURIComponent (stfFullname) + "&opmltext=" + encodeURIComponent (opCursorToXml ()) + extraparams,
			type: "POST",
			dataType: "jsonp", 
			timeout: 30000, 
			jsonpCallback : "getData"
			}) 
		.success (function (data, status) { 
			
			if (data.error != undefined) { //6/1/13 by DW
				alertDialog (data.error);
				return;
				}
			if (data.info != undefined) { //6/2/13 by DW
				alertDialog (data.info);
				}
			
			if (extraparams.length == 0) {
				opSetOneAttActive ("icon", "rss");
				opSetOneAttActive ("id", data.id);
				opSetOneAttActive ("key", data.key);
				}
			sendToFeedData = data;
			sendToFeedStatus = status;
			speakerBeep ();
			}) 
		.error (function (status) { 
			sendToFeedStatus = status;
			});
		}
	function sendToFeed (opmlurl, shortname, fullname) {
		stfOpmlUrl = opmlurl;
		stfShortname = shortname;
		stfFullname = fullname;
		
		stfIdAtt = opGetOneAttActive ("id");
		stfKeyAtt = opGetOneAttActive ("key");
		
		if ((stfIdAtt != undefined) && (stfKeyAtt != undefined)) {
			sendFeedToServer ();
			}
		else {
			confirmDialog ("Send \"" + opGetLineText () + "\" to the <i>" + stfCommunityName + "</i> feed?", sendFeedToServer);
			}
		}
//addLink command
	function okAddLink (url) {
		if (opInTextMode ()) {
			opLink (url);
			}
		else {
			opSetOneAtt ("type", "link");
			opSetOneAtt ("url", url);
			opMarkChanged (); //3/24/13 by DW
			}
		appPrefs.lastLinkUrl = url;
		}
	function addLink () {
		var defaultUrl = appPrefs.lastLinkUrl, urlAtt = opGetOneAtt ("url");
		if ((!opInTextMode ()) && (urlAtt != undefined)) {
			defaultUrl = urlAtt;
			}
		askDialog ("Enter URL for link:", defaultUrl, "http://", okAddLink);
		}
//small picture banner -- 3/16/13 by DW
	var flSmallPictureBannerInstalled = false; //4/2/13 by DW
	
	
	document.write ('<link href="http://fonts.googleapis.com/css?family=Rancho" rel="stylesheet" type="text/css">');
	
	function addSmallPictureBanner (idGrid) {
		if (!flSmallPictureBannerInstalled) {
			if (idGrid == undefined) {
				idGrid = "idSmallPicturePage";
				}
			idGrid = "#" + idGrid;
			$(idGrid).prepend ("<div class=\"row-fluid show-grid\"><div class=\"span12\" style=\"background-color: black; border-bottom: 1px solid gainsboro;\"><div style=\"font-family: Rancho; font-size: 20px; line-height: 160%; margin-left: 12px; margin-top: 4px;\"><a href=\"http://smallpicture.com/\" style=\"color: white;\">Small Picture</a></div></div></div>");
			flSmallPictureBannerInstalled = true;
			}
		}
	
	
//get info about RSS feed -- 3/17/13 by DW
	var getInfoAboutFeedUrl = "http://ajaxbag.smallpicture.com/ajax/getFeedFromUrl", getInfoAboutFeedStatus, getInfoAboutFeedData;
	
	function getInfoAboutFeed (urlfeed, callback) {
		var jxhr = $.ajax ({ 
			url: getInfoAboutFeedUrl + "?url=" + encodeURIComponent (urlfeed),  
			dataType: "jsonp", 
			timeout: 30000 ,  
			jsonpCallback : "getData" }) 
		.success (function (data, status) { 
			getInfoAboutFeedData = data;
			getInfoAboutFeedStatus = status;
			console.log ("getInfoAboutFeed: " + data);
			callback (data);
			}) 
		.error (function (status, error) { 
			getInfoAboutFeedStatus = status;
			});
		}
//anon outlines -- 3/18/13 by DW
	
	
	var openAnonUrl = "http://trex.smallpicture.com/ajax/openAnonOutline", saveAnonUrl = "http://trex.smallpicture.com/ajax/saveOutline";
	var saveOutlineStatus, anonReadStatus, anonReadData;
	
	
	function saveAnonOutline (wo, callback) {
		var opmltext = $("#" + wo.idOutline).concord ().op.outlineToXml ();
		
		var jxhr = $.ajax ({ 
			url: saveAnonUrl + "?url=" + encodeURIComponent (wo.opmlurl) + "&username=" + encodeURIComponent ("") + "&password=" + encodeURIComponent (wo.password),
			data: opmltext,
			type: "POST",
			dataType: "text" , 
			timeout: 30000 
			}) 
		.success (function (data, status) { 
			saveOutlineStatus = status;
			if (callback != undefined) {
				callback (status, data);
				}
			console.log ("saveAnonOutline: Save complete, success.");
			$("#" + wo.idOutline).concord ().op.clearChanged ()
			}) 
		.error (function (status) { 
			if (callback != undefined) {
				callback (status);
				}
			saveOutlineStatus = status;
			console.log ("saveAnonOutline: Save complete, error.");
			});
		}
	function readAnonOutline (wo, callback) {
		var jxhr = $.ajax ({ 
			url: openAnonUrl + "?url=" + encodeURIComponent (wo.opmlurl) + "&password=" + encodeURIComponent (wo.password),  
			dataType: "jsonp" , 
			timeout: 30000 ,  
			jsonpCallback : "getData" }) 
		.success (function (data, status) { 
			console.log ("readAnonOutline: url == " + wo.opmlurl + ", password == " + wo.password + ".")
			wo.opmlurl = data.opmlUrl;
			wo.password = data.password;
			callback (wo, data.opmltext);
			anonReadStatus = status;
			anonReadData = data;
			}) 
		.error (function (status) { 
			anonReadStatus = status;
			});
		}
	
	
	
	
//about dialog -- 3/20/13 by DW
	var flAboutDialogSetUp = false;
	var aboutDialogFont = "Georgia", aboutDialogFontSize = "17", aboutDialogLineHeight = "24"; //3/11/13 by DW
	
	function setupAboutDialog () {
		var s = 
			"<div id=\"idAboutDialog\" concord-events=\"true\" class=\"modal hide fade\" style=\"margin-left: -370px; width: 740px;\"><div class=\"modal-header\"><a href=\"#\" class=\"close\" data-dismiss=\"modal\">&times;</a><h3>About <span id=\"idProductName\"></span>...</h3></div><div class=\"modal-body\"><div class=\"divDialogElements\" style:\"font-weight: normal;\"></div><div id=\"idAboutOutline\"></div></div><div class=\"modal-footer\"><span id=\"idProductVersion\" style=\"float: left; vertical-align: bottom; padding-top: 13px;\"></span><a href=\"#\" class=\"btn btn-primary\" data-dismiss=\"modal\" id=\"aboutDialogOk\" style=\"width: 50px;\"><span style=\"color: white; font-weight: normal;\">OK</span></a></div></div>"
		$("body").prepend (s);
		return (s);
		}
	
	function aboutKeystrokeCallback (event) { 
		if (event.which == 13) {
			$("#idAboutDialog").modal ('hide'); 
			return (false);
			}
		}
	function aboutDialogShow (urlAboutOpml) {
		if (!flAboutDialogSetUp) {
			setupAboutDialog ();
			document.getElementById ("idProductName").innerHTML = appConsts.productnameForDisplay;
			document.getElementById ("idProductVersion").innerHTML = "v" + appConsts.version + "/" + concordEnvironment.version;
			flAboutDialogSetUp = true;
			}
		var jxhr = $.ajax ({ 
			url: getReadHttpUrl () + "?url=" + encodeURIComponent (urlAboutOpml) + "&type=" + encodeURIComponent ("text/plain"),
			dataType: "text" , 
			timeout: 30000 
			}) 
		.success (function (data, status) { 
			$("#idAboutOutline").concord ().op.xmlToOutline (data); 
			$("#idAboutOutline").concord ().prefs ({"outlineFont": aboutDialogFont, "outlineFontSize": aboutDialogFontSize, "outlineLineHeight": aboutDialogLineHeight, "readonly": true}); 
			$('#idAboutDialog').modal ('show'); 
			$("#idAboutDialog").on("keypress", function(){ //5/6/13 by DW
				$(this).modal('hide');
				});
			httpReadStatus = status;
			httpReadData = data;
			}) 
		.error (function (status) { 
			httpReadStatus = status;
			});
		}
//google analytics code -- 6/29/13 by DW
	function getGoogleAnalyticsCode (account, domain) {
		var s = 
			"var _gaq = _gaq || []; _gaq.push(['_setAccount', '%%account%%']); _gaq.push(['_setDomainName', '%%domain%%']); _gaq.push(['_trackPageview']); (function() {var ga = document.createElement('script'); ga.type = ";
			s += "'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();";
		s = s.replace ("%%account%%", account);
		s = s.replace ("%%domain%%", domain);
		return (s);
		}
//Concord callbacks that do things all outliners want to do
	var appCallbacks = {
		"opCollapse": opCollapseCallback,
		"opInsert": opInsertCallback,
		"opExpand": opExpandCallback
		};
	var flExpandCallbackDisabled = false; //3/14/13 by DW
	
	function insertIncludedOpml (opmltext, op) {
		op.insertXml (opmltext, right); 
		op.clearChanged ();
		}
	function readText (url, callback, op, flAcceptOpml) {
		var headerval = {};
		if ((flAcceptOpml != undefined) && flAcceptOpml) { //5/14/13 by DW
			headerval = {"Accept": "text/x-opml"};
			}
		var jxhr = $.ajax ({ 
			url: getReadHttpUrl () + "?url=" + encodeURIComponent (url) + "&type=" + encodeURIComponent ("text/plain"),
			dataType: "text", 
			headers: headerval,
			timeout: 30000 
			}) 
		.success (function (data, status) { 
			callback (data, op);
			httpReadStatus = status;
			httpReadData = data;
			}) 
		.error (function (status) { 
			httpReadStatus = status;
			});
		}
	
	function stampWhenLastUserAction () { //4/30/14 by DW
		if (typeof whenLastUserAction != undefined) {
			whenLastUserAction = new Date (); 
			}
		}
	
	
	function opExpandCallback (op) {
		if (!flExpandCallbackDisabled) {
			var type = op.attributes.getOne ("type"), url = op.attributes.getOne ("url"), xmlUrl = op.attributes.getOne ("xmlUrl");
			stampWhenLastUserAction (); //4/30/14 by DW
			//link nodes
				if ((type == "link") && (url != undefined)) {
					window.open (url);
					return;
					}
			//idea nodes -- 3/20/14 by DW
				if ((type == "idea") && (url != undefined)) {
					window.open (url);
					return;
					}
			//rss nodes -- 3/25/13 by DW
				if ((type == "rss") && (xmlUrl != undefined)) {
					window.open (xmlUrl);
					return;
					}
			//include nodes
				if ((type == "include") && (url != undefined)) {
					op.deleteSubs ();
					op.clearChanged ();
					readText (url, insertIncludedOpml, op, true);
					}
			}
		}
	function opInsertCallback (op) { 
		var atts = {};
		atts.created = new Date ().toUTCString (); //1/18/13 by DW
		op.attributes.addGroup (atts);
		}
	function opCollapseCallback (op) {
		var type = op.attributes.getOne ("type");
		if (type == "include") {
			op.deleteSubs ();
			op.clearChanged ();
			}
		stampWhenLastUserAction (); //4/30/14 by DW
		}
//cribsheet -- 3/27/13 by DW -- the dialog must be #idCribsheetContainer
	function showCribsheet () {
		document.getElementById ("idCribsheetContainer").style.visibility = "visible";
		concord.stopListening ();
		}
	function hideCribsheet () {
		document.getElementById ("idCribsheetContainer").style.visibility = "hidden";
		concord.resumeListening ();
		}
	function initCribsheet () {
		$("#idCribsheet li").each(function(){
			var li = $(this);
			var liContent = li.html();
			liContent = liContent.replace("Cmd-", cmdKeyPrefix);
			li.html(liContent);
			});
		$(document).on ("keydown", function (event) {
			if (document.getElementById ("idCribsheetContainer").style.visibility == "visible") {
				hideCribsheet ();
				}
			});
		}
	function keyCribsheet () { //6/15/13 by DW -- call from your keystroke handler
		if ((event.which == 191) && event.metaKey && event.shiftKey) { //cmd-? -- 3/27/13 by DW
			showCribsheet ();
			return (true);
			}
		return (false);
		}
//messageOfTheDay -- 4/17/13 by DW -- the message is #idMessageOfTheDay
	var urlMessageOfTheDayFolder = "https://dl.dropboxusercontent.com/u/36518280/messageOfTheDay/";
	var whenLastMessageOfTheDayCheck = new Date () - 10000000;
	var flFirstMessageOfTheDayCheck = true;
	var ctMessageOfTheDayUpdates = 0;
	var ctSecsBetwMessageOfTheDayChecks = 60 * 5; //five minutes
	
	
	function getMessageOfTheDayText () {
		var url = urlMessageOfTheDayFolder + appConsts.productname + ".txt", requestHeaders = {};
		
		if (secondsSince (whenLastMessageOfTheDayCheck) > ctSecsBetwMessageOfTheDayChecks) {
			if (!flFirstMessageOfTheDayCheck) {
				requestHeaders ["If-Modified-Since"] = whenLastMessageOfTheDayCheck.toGMTString ();
				}
			whenLastMessageOfTheDayCheck = new Date ();
			var jxhr = $.ajax ({
				url: url,
				dataType: "text",
				timeout: 30000,
				headers: requestHeaders
				})
			.success (function (data, status, xhr) {
				if (xhr.status==200) {
					document.getElementById ("idMessageOfTheDay").innerHTML = data;
					ctMessageOfTheDayUpdates++;
					flFirstMessageOfTheDayCheck = false;
					}
				})
			.error (function (status) {
				console.log ("getMessageOfTheDayText: error, status == " + status);
				});
			}
		}
//snarky slogans -- 11/19/13 by DW
	var snarkySlogans = [
		"Good for the environment.", 
		"All baking done on premises.", 
		"Still diggin!", 
		"It's even worse than it appears.", 
		"Ask not what the Internet can do for you...", 
		"You should never argue with a crazy man.", 
		"Welcome back my friends to the show that never ends.", 
		"Greetings, citizen of Planet Earth. We are your overlords. :-)", 
		"We don't need no stinkin rock stars.", 
		"This aggression will not stand.", 
		"Pay no attention to the man behind the curtain.", 
		"Only steal from the best.", 
		"Reallll soooon now...", 
		"What a long strange trip it's been.", 
		"Ask not what the Internet can do for you.", 
		"When in doubt, blog.",
		"Shut up and eat your vegetables.",
		"Don't slam the door on the way out.",
		"Yeah well, that's just, you know, like, your opinion, man.",
		"So, it has come to this."
		]
	
	function getRandomSnarkySlogan () {
		return (snarkySlogans [random (0, snarkySlogans.length - 1)]);
		}
	
//miscellaneous -- 12/5/13 by DW
	function getBoolean (val) { //12/5/13 by DW
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
	function getNumber (val) { //1/4/14 by DW
		switch (typeof (val)) {
			case "string":
				if (string.lower (val) == "infinity") {
					return (infinity);
					}
				break;
			case "number":
				return (val);
			}
		val = Number (val);
		if (isNaN (val)) {
			val = 0;
			}
		return (val);
		}
	
	
//init utils -- 4/9/13 by DW
	var cmdKeyPrefix = "Ctrl+"; 
	
	function initUtils () {
		//set cmdKeyPrefix -- 3/25/13 by DW
			if (navigator.platform.toLowerCase ().substr (0, 3) == "mac") {
				cmdKeyPrefix = "&#8984;";
				}
		initCribsheet ();
		}
