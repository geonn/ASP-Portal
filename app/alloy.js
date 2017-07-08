Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;
Alloy.Globals.loading = Alloy.createWidget("com.rays.loading");
Alloy.Globals.naviPath = [];
if (OS_ANDROID) {
    Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor - 25;
    Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}

Alloy.Globals.isIos7Plus = OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 7;

Ti.Gesture.addEventListener('orientationchange', function(e) {
    Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
    Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

    if (OS_ANDROID) {
        Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor - 25;
        Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
    }
});
function addPage(pageName,title,args){
	if(typeof pageName==undefined){
		alert("Page Name is undefined");
		return;		
	}
	title = (typeof title != "undefined")?title:"Title";
	args = (typeof args != "undefined")?args:{};
	Alloy.Globals.pageFlow.addChild({
		arguments:args,
	    controller: pageName,
	    navBar: {
	        title: title
	    }
	});	
}
var _ = require('underscore')._;
//var API = require('api');
var COMMON = require('common'); 
var DBVersionControl = require('DBVersionControl');

var last_update_on = true;
DBVersionControl.checkAndUpdate();
