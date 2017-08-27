var args = arguments[0] || {};
//console.log(blob);
var img = args.img_path;

function init(){
	//if(OS_ANDROID){
		$.webview.url = img;
		Alloy.Globals.loading.stopLoading();
	// }else{
		// var Ziv = Ti.UI.createScrollView({
			// width :Ti.UI.FILL, 
			// height :Ti.UI.FILL,        
            // showHorizontalScrollIndicator:false,
            // showVerticalScrollIndicator:false,
            // maxZoomScale:10,
            // minZoomScale:1.0,
            // borderWidth :1, 
      		// backgroundColor :"transparent",
      		// zIndex :100
		// });
		// var Zimage = Ti.UI.createImageView({
			// image: blob,
			// width :"100%",
			// height :Ti.UI.SIZE,
			// zIndex :101,
			// //enableZoomControls :"true"
		// });		
		// Ziv.add(Zimage);
		// $.imageMother.add(Ziv);
	// }		
}
init();
function closeWindow(){
	$.destroy();
	$.win.close();
}
