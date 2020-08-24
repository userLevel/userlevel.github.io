// Copyright 2013, Small Picture, Inc.

var op = {
	expand: function () {
		return ($(getActiveOutliner ()).concord ().op.expand ());
		},
	expandAllLevels: function () {
		return ($(getActiveOutliner ()).concord ().op.expandAllLevels ());
		},
	expandEverything: function () {
		return ($(getActiveOutliner ()).concord ().op.fullExpand ());
		},
	expandTo: function (headline) {
		expandToCursor (headline);
		return (setCursorActive (headline.getCursor ()));
		},
	collapse: function () {
		return ($(getActiveOutliner ()).concord ().op.collapse ());
		},
	collapseEverything: function () {
		return ($(getActiveOutliner ()).concord ().op.fullCollapse ());
		},
	
	go: function (dir, ct) {
		if (dir == right) {
			op.expand ();
			}
		return ($(getActiveOutliner ()).concord ().op.go (dir, ct));
		},
	firstSummit: function () {
		op.go (left, infinity);
		op.go (up, infinity);
		return (true);
		},
	countSubs: function () {
		return ($(getActiveOutliner ()).concord().op.countSubs ());
		},
	hasSubs: function () {
		return (op.countSubs () > 0);
		},
	getLineText: function () {
		return ($(getActiveOutliner ()).concord ().op.getLineText ());
		},
	setLineText: function (s) { //8/7/13 by DW
		return ($(getActiveOutliner ()).concord ().op.setLineText (s));
		},
	
	insert: function (s, direction) {
		return ($(getActiveOutliner ()).concord ().op.insert (s, direction));
		},
	reorg: function (dir, ct) {
		if (ct == undefined) {
			ct = 1;
			}
		return ($(getActiveOutliner ()).concord ().op.reorg (dir, ct));
		},
	promote: function () {
		return ($(getActiveOutliner ()).concord ().op.promote ());
		},
	demote: function () {
		return ($(getActiveOutliner ()).concord ().op.demote ());
		},
	deleteSubs: function () {
		return ($(getActiveOutliner ()).concord ().op.deleteSubs ());
		},
	
	getCursorOpml: function () {
		return ($(getActiveOutliner ()).concord ().op.cursorToXml ());
		},
	insertOpml: function (opmltext, dir) {
		if (dir == undefined) {
			dir = down;
			}
		return ($(getActiveOutliner ()).concord ().op.insertXml (opmltext, dir));
		},
	
	bold: function () {
		return ($(getActiveOutliner ()).concord ().op.bold ());
		},
	italic: function () {
		return ($(getActiveOutliner ()).concord ().op.italic ());
		},
	strikethrough: function () {
		return ($(getActiveOutliner ()).concord ().op.strikethrough ());
		},
	link: function () {
		return ($(getActiveOutliner ()).concord ().op.link ());
		},
	
	isComment: function () {
		var isComment = op.attributes.getOne ("isComment")
		if ((isComment == undefined) || (isComment == "false")) {
			return (false);
			}
		else {
			return (true);
			}
		},
	unComment: function () {
		op.attributes.deleteOne ("isComment");
		return ($(getActiveOutliner ()).concord ().script.unComment ());
		},
	makeComment: function () {
		op.attributes.setOne ("isComment", "true");
		return ($(getActiveOutliner ()).concord ().script.makeComment ());
		},
	toggleComment: function () {
		if (op.isComment ()) {
			op.unComment ();
			}
		else {
			op.makeComment ();
			}
		},
	
	setRenderMode: function (flrendermode) { //7/28/13 by DW
		$(getActiveOutliner ()).concord ().op.setRenderMode (flrendermode);
		},
	getRenderMode: function () { //7/28/13 by DW
		return ($(getActiveOutliner ()).concord ().op.getRenderMode ());
		},
	toggleRenderMode: function () { //7/28/13 by DW
		op.setRenderMode (!op.getRenderMode ());
		},
	
	getCursor: function () {
		return ($(getActiveOutliner ()).concord ().op.getCursorRef ());
		},
	getCursorUrl: function () {
		var parent = undefined;
		op.visitToSummit (function (headline) {
			var type = headline.attributes.getOne ("type");
			if (type != undefined) {
				parent = headline;
				return (false); 
				}
			return (true); 
			});
		return (getTrexUrl (getActiveOutliner (), parent, true));
		},
	
	runSelection: function () {
		var value = eval (op.getLineText ());
		op.deleteSubs ();
		op.insert (value, right);
		op.go (left, 1);
		},
	setModified: function () {
		return ($(getActiveOutliner ()).concord ().op.markChanged ());
		},
	getModified: function () {
		return ($(getActiveOutliner ()).concord ().op.changed ());
		},
	setTextMode: function (fltextmode) {
		$(getActiveOutliner ()).concord ().op.setTextMode (fltextmode);
		},
	visitSubs: function (lineCallback, indentCallback, outdentCallback) {
		var levelnum = 0;
		var visitSub = function (sub) {
			lineCallback (sub, levelnum);
			if (sub.countSubs () > 0) {
				if (indentCallback != undefined) {
					indentCallback (levelnum);
					}
				levelnum++;
				sub.visitLevel (visitSub); 
				levelnum--; 
				if (outdentCallback != undefined) {
					outdentCallback (levelnum);
					}
				}
			return (true);
			};
		op.getCursor ().visitLevel (visitSub);
		},
	visitAll: function (callback) {
		return ($(getActiveOutliner ()).concord ().op.visitAll (callback));
		},
	visitToSummit: function (callback) {
		return ($(getActiveOutliner ()).concord ().op.visitToSummit (callback));
		},
	attributes: {
		getAll: function () {
			return ($(getActiveOutliner ()).concord ().op.attributes.getAll ());
			},
		getOne: function (name) {
			return $(getActiveOutliner ()).concord ().op.attributes.getOne (name);
			},
		setOne: function (name, value) {
			return $(getActiveOutliner ()).concord ().op.attributes.setOne (name, value);
			},
		addGroup: function (atts) {
			return $(getActiveOutliner ()).concord ().op.attributes.setGroup (atts);
			},
		deleteOne: function (name) {
			var atts = op.attributes.getAll ();
			if (atts [name] != undefined) {
				delete atts [name];
				}
			op.attributes.addGroup (atts);
			},
		makeEmpty: function () {
			var atts = new Object ();
			op.attributes.addGroup (atts);
			}
		}
	}
var number = {
	random: function (lower, upper) {
		return (random (lower, upper));
		}
	}
var file = {
	readWholeFile: function (path, callback) {
		vendor.read (path, callback);
		},
	writeWholeFile: function (path, data, callback) {
		vendor.write (path, data, callback);
		},
	getCurrentFilePath: function () {
		var tab = smallTabs.getActiveTab ();
		return (tab.url);
		},
	getCurrentFileTitle: function () {
		var tab = smallTabs.getActiveTab ();
		return (tab.getTitle ());
		},
	viewCurrentFileInReader: function () { //7/28/13 by DW
		openInTacoPie ();
		},
	saveCurrentFileAsMarkdown: function () { //7/28/13 by DW
		fileSaveAsMarkdownCommand ();
		},
	getPublicUrl: function (path, callback) {
		vendor.createSharedUrl (path, callback);
		},
	getDatePath: function (theDate, flLastSeparator) {
		if (theDate == undefined) {
			theDate = new Date ();
			}
		if (flLastSeparator == undefined) {
			flLastSeparator = true;
			}
		
		var month = padWithZeros (theDate.getMonth () + 1, 2);
		var day = padWithZeros (theDate.getDate (), 2);
		var year = theDate.getFullYear ();
		
		if (flLastSeparator) {
			return (year + "/" + month + "/" + day + "/");
			}
		else {
			return (year + "/" + month + "/" + day);
			}
		}
	}
var http = {
	readUrl: function (url, userCallback) {
		var headline = op.getCursor ();
		var myCallback = function (filetext, headline) {
			if (userCallback != undefined) { //2/21/14 by DW
				userCallback (filetext);
				}
			}
		readText (url, myCallback, headline, true);
		}
	}
var string = {
	beginsWith: function (s, possibleBeginning, flUnicase) { //11/27/13 by DW
		if (s.length == 0) { //1/1/14 by DW
			return (false);
			}
		if (flUnicase == undefined) {
			flUnicase = true;
			}
		if (flUnicase) {
			for (var i = 0; i < possibleBeginning.length; i++) {
				if (string.lower (s [i]) != string.lower (possibleBeginning [i])) {
					return (false);
					}
				}
			}
		else {
			for (var i = 0; i < possibleBeginning.length; i++) {
				if (s [i] != possibleBeginning [i]) {
					return (false);
					}
				}
			}
		return (true);
		},
	contains: function (s, possiblyContained, flUnicase) { //11/27/13 by DW
		if (flUnicase == undefined) {
			flUnicase = true;
			}
		if (flUnicase) {
			var s1 = string.lower (s);
			var s2 = string.lower (possiblyContained);
			return (s1.indexOf (s2) != -1);
			}
		else {
			return (s.indexOf (possiblyContained) != -1);
			}
		},
	countFields: function (s, chdelim) {
		var ct = 1;
		if (s.length == 0) {
			return (0);
			}
		for (var i = 0; i < s.length; i++) {
			if (s [i] == chdelim) {
				ct++;
				}
			}
		return (ct)
		},
	dayOfWeekToString: function (theDayNum) {
		return (dayOfWeekToString (theDayNum - 1));
		},
	delete: function (s, ix, ct) {
		var start = ix - 1;
		var end = (ix + ct) - 1;
		var s1 = s.substr (0, start);
		var s2 = s.substr (end);
		return (s1 + s2);
		},
	endsWith: function (s, possibleEnding, flUnicase) { //11/27/13 by DW
		if (s.length == 0) { //1/1/14 by DW
			return (false);
			}
		var ixstring = s.length - 1;
		if (flUnicase == undefined) {
			flUnicase = true;
			}
		if (flUnicase) {
			for (var i = possibleEnding.length - 1; i >= 0; i--) {
				if (string.lower (s [ixstring--]) != string.lower (possibleEnding [i])) {
					return (false);
					}
				}
			}
		else {
			for (var i = possibleEnding.length - 1; i >= 0; i--) {
				if (s [ixstring--] != possibleEnding [i]) {
					return (false);
					}
				}
			}
		return (true);
		},
	filledString: function (s, ct) {
		var theString = "";
		for (var i = 0; i < ct; i++) {
			theString += s;
			}
		return (theString);
		},
	getRandomPassword: function (ctchars) {
		return (getRandomPassword (ctchars));
		},
	hashMD5: function (s) {
		return (SparkMD5.hash (s));
		},
	innerCaseName: function (s) {
		return (getCanonicalName (s));
		},
	insert: function (source, dest, ix) { //11/26/13 by DW
		return (dest.substr (0, ix) + source + dest.substr (ix));
		},
	isAlpha: function (ch) {
		return (isAlpha (ch));
		},
	isNumeric: function (ch) {
		return (isNumeric (ch));
		},
	lastField: function (s, chdelim) { //11/20/13 by DW
		var ct = string.countFields (s, chdelim);
		return (string.nthField (s, chdelim, ct));
		},
	lower: function (s) { //9/2/13 by DW
		return (s.toLowerCase ());
		},
	mid: function (s, ix, len) {
		return (s.substr (ix-1, len));
		},
	monthToString: function (theMonthNum) { //January, February etc.
		return (monthToString (theMonthNum - 1));
		},
	nthField: function (s, chdelim, n) {
		var splits = s.split (chdelim);
		if (splits.length >= n) {
			return splits [n-1];
			}
		return ("");
		},
	padWithZeros: function (num, ctplaces) {
		return (padWithZeros (num, ctplaces));
		},
	popLastField: function (s, chdelim) { //12/3/13 by DW
		if (s.length == 0) {
			return (s);
			}
		if (string.endsWith (s, chdelim)) {
			s = string.delete (s, s.length, 1);
			}
		while (s.length > 0) {
			if (string.endsWith (s, chdelim)) {
				return (string.delete (s, s.length, 1));
				}
			s = string.delete (s, s.length, 1);
			}
		return (s);
		},
	popTrailing: function (s, ch) { //11/25/13 by DW
		while (s.length > 0) {
			if (s [s.length - 1] != ch) {
				break;
				}
			s = string.delete (s, s.length, 1);
			}
		return (s);
		},
	replaceAll: function (s, searchfor, replacewith) {
		return (s.replace (new RegExp (searchfor, 'g'), replacewith));
		},
	stripMarkup: function (s) {
		return (stripMarkup (s));
		},
	trimLeading: function (s, ch) {
		if (ch == undefined) {
			ch = " ";
			}
		return (trimLeading (s, ch));
		},
	trimTrailing: function (s, ch) {
		if (ch == undefined) {
			ch = " ";
			}
		return (trimTrailing (s, ch));
		},
	trimWhitespace: function (s, ch) { //8/24/13 by DW
		if (ch == undefined) {
			ch = " ";
			}
		return (trimLeading (trimTrailing (s, ch), ch))
		},
	upper: function (s) { //11/26/13 by DW
		return (s.toUpperCase ());
		}
	}
var dialog = {
	alert: function (s) {
		return (alertDialog (s));
		},
	ask: function (prompt, defaultValue, placeholder, callback) {
		return (askDialog (prompt, defaultValue, placeholder, callback));
		},
	viewText: function (prompt, s) {
		showViewTextDialog (prompt, s);
		},
	confirm: function (prompt, callback) {
		confirmDialog (prompt, callback);
		},
	about: function (urlOpml) {
		aboutDialogShow (urlOpml);
		}
	}
var date = {
	netStandardString: function (theDate) { //12/17/13 by DW
		return (theDate.toUTCString ());
		}
	}
var clock = {
	now: function () {
		return (new Date ());
		},
	waitSeconds: function (ctsecs) {
		var ctloops = 0;
		for (var whenStart = new Date (); secondsSince (whenStart) < ctsecs; ctloops) {
			ctloops++;
			}
		return (ctloops);
		}
	}
var speaker = {
	beep: function () {
		speakerBeep ();
		}
	}
var fargo = { //11/29/13 by DW
	version: function () {
		return (appConsts.version);
		},
	productname: function () {
		return (appConsts.productname);
		},
	productnameForDisplay: function () {
		return (appConsts.productnameForDisplay);
		}
	}
var cms = {
	version: function () {
		return (cmsVersion);
		},
	renderPage: function (path) {
		var tab = getActiveTab ();
		var xstruct = getTabXstruct (tab);
		return (cmsRenderPage (tab, xstruct, path));
		}
	}
var wordPress = {
	updatePost: function (title, msgbody, idpost, callback, wpBlogUrl, wpUsername, wpPassword) {
		var s;
		if (wpBlogUrl == undefined) {
			wpBlogUrl = appPrefs.wordpressBlogUrl;
			}
		if (wpUsername == undefined) {
			wpUsername = appPrefs.wordpressUsername;
			}
		if (wpPassword == undefined) {
			wpPassword = appPrefs.wordpressPassword;
			}
		if (idpost == undefined) {
			idpost = 0;
			}
		if (msgbody == undefined) {
			msgbody = "";
			}
		s = "postBody=" + encodeURIComponent (msgbody) + "&weblogUrl=" + encodeURIComponent (wpBlogUrl) + "&idPost=" + encodeURIComponent (idpost) + "&postTitle=" + encodeURIComponent (title) + "&blogUsername=" + encodeURIComponent (wpUsername) + "&blogPassword=" + encodeURIComponent (wpPassword);
		console.log ("wordPress.updatePost: " + s);
		var jxhr = $.ajax ({ 
			url: updateBlogpostUrl,
			data: s,
			type: "POST",
			dataType: "jsonp", 
			timeout: 30000,
			jsonpCallback : "getData"
			}) 
		.success (function (data, status) { 
			if (callback != undefined) {
				callback (data);
				}
			}) 
		.error (function (status) { 
			});
		},
	postCursor: function (callback) {
		var idpost = op.attributes.getOne  ("idpost"), bodytext = "";
		if (idpost == undefined) {
			idpost = 0;
			}
		op.visitSubs ( //get bodytext
			function (headline, levelnum) {
				var pretext = "<li>", posttext = "</li>";
				if (levelnum == 0) {
					pretext = "<p>";
					posttext = "</p>";
					}
				bodytext +=  string.filledString ("\t", levelnum) + pretext + headline.getLineText () + posttext + "\r\n";
				},
			function (levelnum) {
				bodytext += string.filledString ("\t", levelnum) + "<ul>\r\n";
				},
			function (levelnum) {
				bodytext += string.filledString ("\t", levelnum + 1) + "</ul>\r\n";
				}
			);
		wordPress.updatePost (op.getLineText (), bodytext, idpost, function (data) {
			if (data.error != undefined) { 
				speaker.beep ();
				dialog.alert (data.error);
				return;
				}
			if ((op.attributes.getOne  ("idpost") == undefined) && (data.idpost != undefined)) {
				op.attributes.setOne ("idpost", data.idpost);
				}
			if ((op.attributes.getOne  ("url") == undefined) && (data.link != undefined)) {
				op.attributes.setOne ("url", data.link);
				}
			if (op.attributes.getOne  ("type") != "metaWeblogPost") {
				op.attributes.setOne ("type", "metaWeblogPost");
				}
			//bump ctsaves att on blogpost headline
				var ctsaves = op.attributes.getOne ("ctSaves"); 
				if (ctsaves == undefined) {
					ctsaves = 0;
					}
				op.attributes.setOne ("ctSaves", ++ctsaves);
			if (callback != undefined) {
				callback (data);
				}
			});
		}
	}
