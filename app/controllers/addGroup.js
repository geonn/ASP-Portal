var animate_height1 = Ti.UI.createAnimation({duration:100,height:50});
var animate_bottom1 = Ti.UI.createAnimation({duration:100,bottom:50});	
var animate_height = Ti.UI.createAnimation({duration:100,height:0});
var animate_bottom = Ti.UI.createAnimation({duration:100,bottom:0});
function doSubmit(e){
	console.log("doSubmit");
	Alloy.Globals.pageFlow.startLoading("Loading...");
	setTimeout(function(){
		Alloy.Globals.pageFlow.stopLoading();	
	},2000);
}
function add_image(e) {
	var gallerypicker = require('titutorial.gallerypicker');
	gallerypicker.openGallery({
		cancelButtonTitle : "Cancel",
		doneButtonTitle : "Okay",
		title : "Gallery",
		errorMessage: "Limit reached",
		limit : 1,
		success : function(e) {
			Ti.API.info("response is => " + JSON.stringify(e));
			var imgArray = e.filePath.split(",");
	
			for(var i=0; i<imgArray.length; i++){
				if(imgArray[i]){
					var imgView = Ti.UI.createImageView({
						image: gallerypicker.decodeBitmapResource(imgArray[i], 400, 400),
						width:Ti.UI.FILL,
						height:Ti.UI.FILL
					});
					$.imageGroup.removeAllChildren();
					$.imageGroup.add(imgView);
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
var showmember = false;
function showMember(e){
	if(!showmember){
		showmember = true;		
		$.memberList.animate(animate_height1);
		$.mother_view.animate(animate_bottom1);
	}else if(showmember){
		showmember = false;
		setTimeout(function(){
			$.memberList.animate(animate_height);
			$.mother_view.animate(animate_bottom);				
		},500);		
	}
}
function init(){
	$.myInstance.show('',false);
	$.scrollview.scrollingEnabled = false;
	getStaffList();
}init();
function getStaffList(){
	API.callByPost({url:"getStaffList",params:""},{
		onload:function(responceText){
			var res = JSON.parse(responceText);
			var arr = res.data || null;
			console.log(JSON.stringify(arr));
		},
		onerror:function(err){}
	});
	setTimeout(function(){
		$.mother_view.opacity = 1;		
		$.myInstance.hide();
		$.scrollview.scrollingEnabled = true;		
	},2000);
}
function showGMImagePicker(e) { 
	var picker = require('ti.gmimagepicker');		
	picker.openPhotoGallery({
		maxSelectablePhotos: 1,
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
    $.imageGroup.removeAllChildren();
    for (var i=0; i < media.length; i++) {
    	var imgView =Ti.UI.createImageView({ image: media[i],top:0, width:Ti.UI.FILL, height: Ti.UI.FILL });
		$.imageGroup.add(imgView);    	
	};
}
