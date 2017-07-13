//image sample provided by http://ny-pictures.com/nyc/photo/picture/42553/nostalgic_view_famous_hall

var mod = require('bencoding.blur');
Ti.API.info("module is => " + mod);

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white', title:"Basic Blur Demo"
});

var vwTest = mod.createBasicBlurView({
	width:Ti.UI.FILL, height:Ti.UI.FILL, blurRadius:10,
	image: '42553_m.jpg', backgroundColor:'red'
});
win.add(vwTest);

win.open();
