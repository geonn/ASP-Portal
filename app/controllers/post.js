var picker = require('ti.gmimagepicker');	
function add_image(e) {
	var gallerypicker = require('titutorial.gallerypicker');
	gallerypicker.openGallery({
		cancelButtonTitle : "Cancel",
		doneButtonTitle : "Okay",
		title : "Gallery",
		errorMessage: "Limit reached",
		limit : 30,
		success : function(e) {
			Ti.API.info("response is => " + JSON.stringify(e));
			var imgArray = e.filePath.split(",");
	
			for(var i=0; i<imgArray.length; i++){
				if(imgArray[i]){
					var imgView = Ti.UI.createImageView({
						top:'10dp',
						image: gallerypicker.decodeBitmapResource(imgArray[i], 300, 300)
					});
					$.mother_post.add(imgView);
				}
			}
		},
		error : function(e) {
			alert("error " + JSON.stringify(e));
		},
		cancel : function(e) {
			//alert("cancel " + JSON.stringify(e));
		}
	});
}

function showGMImagePicker(e) { 
	picker.openPhotoGallery({
		maxSelectablePhotos: 30,
		// allowMultiple: false, // default is true
	    success: function (e) {
	        Ti.API.error('success: ' + JSON.stringify(e));
	        renderPhotos(e.media);
	    },
	    cancel: function (e) {
	    	Ti.API.error('cancel: ' + JSON.stringify(e));
	    },
	    error: function (e) {
	        Ti.API.error('error: ' + JSON.stringify(e));
	    }
	});
}

function renderPhotos(media) {
	var views = [];
    
    for (var i=0; i < media.length; i++) {
    	var imgView =Ti.UI.createImageView({ image: media[i],top:10, width:Ti.UI.FILL, height: Ti.UI.SIZE });
		$.mother_post.add(imgView);    	
	};
}