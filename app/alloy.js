Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;
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
var _ = require('underscore')._;
//var API = require('api');
var COMMON = require('common'); 
var DBVersionControl = require('DBVersionControl');

var last_update_on = true;
DBVersionControl.checkAndUpdate();
