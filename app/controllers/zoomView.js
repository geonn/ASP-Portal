var args = arguments[0] || {};

//console.log(blob);
var img = args.img_path;
var videoPlayer;
function init(){ 	
	$.myInstance.show('',false);		
	if($.args.isVideo!= undefined){
		Alloy.Globals.loading.stopLoading();						
		setTimeout(function(){
			videoPlayer = Titanium.Media.createVideoPlayer({
			    backgroundColor : '#000',
			    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
			    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
			});
			if (OS_ANDROID) {
				videoPlayer.width = Ti.UI.FILL;
				videoPlayer.height = Ti.UI.SIZE;
			};
			videoPlayer.url = img;			
			videoPlayer.addEventListener("durationavailable",function(){
				$.myInstance.hide();				
			});		
			$.imageMother.add(videoPlayer);    			
		},1000);		
	}
	else{
		$.myInstance.hide();						
		$.webview.url = img;
		Alloy.Globals.loading.stopLoading();					
	}	
}
init();
function closeWindow(){
	$.destroy();
	$.win.close();
}
exports.removeEventListeners = function() {
	try{
		$.imageMother.removeAllChildren();    		    
	    console.log("Zoom no listener");			
	    videoPlayer.hide();
	    videoPlayer.release();
	    videoPlayer = null;		
	}
	catch(err){
		console.log(err);
	}
};
