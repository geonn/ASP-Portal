var args = arguments[0] || {};
var edit = args.edit || false;
var post_group = args.post_group || false;
var p_id = args.p_id || "";
var refreshName = args.refreshName || null;
var num = args.g_id || 0;
var num1 = 0;
var u_id = Ti.App.Properties.getString("u_id")||"";
var my_group = Alloy.createCollection("my_group");
var group_id = [];
group_id[0] = "";
var group_name = [];
var imageC = [3,2,1];
group_name[0] = "Public Post";
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id);
$.u_img.image = (u_res.img_path!="") ? u_res.img_path : "/images/asp_square_logo.png";
var video_image ;
var video_blob;
function init(){
	Alloy.Globals.loading.stopLoading();
	if(edit){
		setData();
	}else{
		$.u_name.text = Ti.App.Properties.getString("u_name")||"";
	}
	$.lb_group.text =(post_group)?args.g_name:group_name[0];
}
init();

function setData(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	
	$.description.value = res.description;
	$.u_name.text = res.u_name;
}
function mediaOptions(){
	if(!edit){

		var options = ['Capture Image','Image From Library','Capture Video','Video From Library','Cancel'];
		var opts = {cancel: 4,options:options,destructive: 0,title: 'Options'}; 
		var dialog = Ti.UI.createOptionDialog(opts); 
  		dialog.addEventListener("click",function(e){
			if(e.index == 0){
				if($.imageMother.children.length > 2){
					alert("Limit reached!\nPlease remove image of bottom to add new image.");
					return;
    			}     
    			if (Ti.Media.hasCameraPermissions()) {   
     				openCamera();
    			}else{
     				Ti.Media.requestCameraPermissions(function(e) {
						if(e.success){
	                    	openCamera();
	               		}else{
	                   		alert('You denied permission');
	               		} 
			    	});       
    			} 
   			}  
			if(e.index == 1){
				if($.imageMother.children.length > 2){
					alert("Limit reached!\nPlease remove image of bottom to add new image.");
					return;
				}     
    			if(OS_ANDROID){
     				add_image();
     				//addImageV2();   
    			}else{
     				showGMImagePicker();
    			}
   		    }
			if(e.index == 2){    
				if (Ti.Media.hasCameraPermissions()) {   
					if(OS_ANDROID){
						openVideoRecorder();
					}else{
						openVideoRecorder_IOS();
					}
				}else{
					Ti.Media.requestCameraPermissions(function(e) {
						if(e.success){
							if(OS_ANDROID){
								openVideoRecorder();
							}else{
								openVideoRecorder_IOS();
							}
						}else{
							alert('You denied permission');
						} 
					});       
				} 
			}    
			if(e.index == 3){
				if(OS_ANDROID){
					if(Titanium.Filesystem.hasStoragePermissions()){
						addImageV2();
					}else{
						Titanium.Filesystem.requestStoragePermissions(function(e) {
							if (e.success) {
								addImageV2();
							}else{
								common.createAlert("Warning","You don't have file storage permission!!!\nYou can go to setting enabled the permission.",function(e){});
							}
						});        
					}     
				}
				else{
					Titanium.Media.openPhotoGallery({
						mediaTypes:[Titanium.Media.MEDIA_TYPE_VIDEO],
						success:function(event){
							var result=event.media.nativePath;
							video_blob = event.media;
							Ti.API.info(event);
							addImageV2_IOS(result);
						}
					});
				}
			}
		}); 
		dialog.show();  
	}
	else{
		alert("Edit post cannot change image or add images.");
	}
}
function openVideoRecorder_IOS(){ // Onn, i cant testing with simulator
	Titanium.Media.showCamera({
		videoQuality: Titanium.Media.QUALITY_MEDIUM,
		videoMaximumDuration: 300000,		 
		success:function(event) {
			// called when media returned from the camera
			Ti.API.debug('Our type was: '+event.mediaType);
			if(event.mediaType == Ti.Media.MEDIA_TYPE_VIDEO) {
				var result=event.media.nativePath;
				video_blob = event.media;
				addImageV2_IOS(result);
				/*var videoPlayer = Titanium.Media.createVideoPlayer({
				    top : 0,
				    autoplay : true,
				    backgroundColor : '#000',
				    width : Ti.UI.Fill,
				    height: 250,
				    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
				    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
				});
				videoPlayer.url = event.media;
				// var filePath = e.intent.data;
		        // var file = Ti.Filesystem.getFile(filePath);
		        // var copiedFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, file.name);
		        // file.copy(copiedFile.nativePath); 		
		       	// video_blob = copiedFile.read();
				$.videoMother.add(videoPlayer); */
			} else {
				alert("Invalid Format");
			}
		},
		cancel:function() {
			// called when user cancels taking a picture
		},
		error:function(error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({title:'Camera'});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery:true,
	    // allowEditing and mediaTypes are iOS-only settings
		allowEditing: true,
		mediaTypes: [Ti.Media.MEDIA_TYPE_VIDEO]
	});
}
function add_image() {
	var gallerypicker = require('titutorial.gallerypicker');
	var ImageFactory = require('ti.imagefactory');	
	var count = 0;
	if($.imageMother.children.length > 0){
		console.log("asdf:"+$.imageMother.children.length);
		count = $.imageMother.children.length;
	}
	console.log("asdf:"+imageC[count]);
	gallerypicker.openGallery({
		cancelButtonTitle : "Cancel",
		doneButtonTitle : "Okay",
		title : "Gallery",
		errorMessage: "Limit reached",
		limit : imageC[count],
		success : function(e) {
			Ti.API.info("response is => " + JSON.stringify(e));
			var imgArray = e.filePath.split(",");
	
			for(var i=0; i<imgArray.length; i++){
				if(imgArray[i]){
					var blob = Titanium.Filesystem.getFile("file://"+imgArray[i]).read();
					var blobSize = blob.height/blob.width;			
					var imgView = Ti.UI.createImageView({
						top:'10dp',
						classes:['wfill','hsize'],
						image:ImageFactory.imageAsResized(blob, { width:640,height:blobSize*640}),
					});
					imgView.addEventListener("longclick",function(e1){
						$.imageMother.remove(e1.source);
					});
					$.imageMother.add(imgView);
					imgView = undefined;
				}
			}
			imgArray = undefined;
		},
		error : function(e) {
			alert("error " + JSON.stringify(e));
		},
		cancel : function(e) {
			//alert("cancel " + JSON.stringify(e));
		}
	});
	gallerypicker = undefined;
}
function addImageV2_IOS(e){
	var videoPlayer = Titanium.Media.createVideoPlayer({
	    top : 0,
	    autoplay : true,
	    backgroundColor : '#000',
	    width : Ti.UI.Fill,
	    height: 250,
	    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
	    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
	    url : e
	});
	videoPlayer.addEventListener("longpress",function(e1){
		$.videoMother.remove(e1.source);
	});
	$.videoMother.add(videoPlayer); 	
}
function addImageV2(){
    var intent = Titanium.Android.createIntent({
        action : Ti.Android.ACTION_PICK,
        type : "video/*"
    });

    intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
    var activity = Titanium.Android.currentActivity;
    activity.startActivityForResult(intent, function(e) { 
    	try{
	    	if(e.intent.type == "image/jpeg" || e.intent.type == "image/png"){
	    		alert("This video got problem!!!\nPlease select another video to upload.");
	    		return;
	    	}
	    	else{
	    		$.videoMother.removeAllChildren();	
	    		console.log("video url:"+e.intent.data);
	    		console.log("data:"+JSON.stringify(e));
				var videoPlayer = Titanium.Media.createVideoPlayer({
				    top : 0,
				    autoplay : true,
				    backgroundColor : '#000',
				    width : Ti.UI.Fill,
				    height: 250,
				    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
				    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
				});
				videoPlayer.addEventListener("longpress",function(e1){
					$.videoMother.remove(e1.source);
				});
				videoPlayer.url = e.intent.data;	
		        var filePath = e.intent.data;
		        var file = Ti.Filesystem.getFile(filePath);
		        var copiedFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, file.name);
		        file.copy(copiedFile.nativePath); 		
		       	video_blob = copiedFile.read();
				// var f = Titanium.Filesystem.openStream(Titanium.Filesystem.MODE_READ,videoPlayer.url);
				// console.log("Video Object:"+JSON.stringify(f));
				// var VideoObject = f.read();				
				// console.log("Video Object"+JSON.stringify(VideoObject));
				// if(isNaN(VideoObject.length) || VideoObject.length == 0){
					// alert("Video source got problem!!!\nPlease select another video to upload.");
					// return;
				// }		
				$.videoMother.add(videoPlayer);    							
	    	}    		
    	}catch(err){
    		console.log("error:"+err);
    	}
    });
}
function showGMImagePicker() {
	var picker = require('ti.gmimagepicker');	
	var count = 0;
	if($.imageMother.children.length > 0){
		count = $.imageMother.children.length;
	}		 
	picker.openPhotoGallery({
		maxSelectablePhotos: imageC[count],
		// allowMultiple: false, // default is true
	    success: function (e) {
	        Ti.API.error('successaaa: ' + JSON.stringify(e));
	        console.log("native path:"+JSON.stringify(e));
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
function openVideoRecorder(){
    var intent = Titanium.Android.createIntent({ action: 'android.media.action.VIDEO_CAPTURE' });
    var activity = Titanium.Android.currentActivity;
    activity.startActivityForResult(intent, function(e) { 
        if (e.resultCode == Ti.Android.RESULT_OK) {
            if (e.intent.data != null) {
	    		$.videoMother.removeAllChildren();	
	    		console.log("video url:"+e.intent.data);
	    		console.log("data:"+JSON.stringify(e));
				var videoPlayer = Titanium.Media.createVideoPlayer({
				    top : 0,
				    autoplay : true,
				    backgroundColor : '#000',
				    width : Ti.UI.Fill,
				    height: 250,
				    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
				    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
				});
				videoPlayer.addEventListener("longpress",function(e1){
					$.videoMother.remove(e1.source);
				});
				videoPlayer.url = e.intent.data;	
		        var filePath = e.intent.data;
		        var file = Ti.Filesystem.getFile(filePath);
		        var copiedFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, file.name);
		        file.copy(copiedFile.nativePath); 		
		       	video_blob = copiedFile.read();
		               				
				// var f = Titanium.Filesystem.openStream(Titanium.Filesystem.MODE_READ,videoPlayer.url);
				// console.log("Video Object:"+JSON.stringify(f));
				// var VideoObject = f.read();				
				// console.log("Video Object"+JSON.stringify(VideoObject));
				// if(isNaN(VideoObject.length) || VideoObject.length == 0){
					// alert("Video source got problem!!!\nPlease select another video to upload.");
					// return;
				// }		
				$.videoMother.add(videoPlayer); 
    	    }
            else {
                Ti.API.error('Could not retrieve media URL!');
            }
        }
        else if (e.resultCode == Ti.Android.RESULT_CANCELED) {
            Ti.API.trace('User cancelled video capture session.');
        }
        else {
            Ti.API.error('Could not record video!');
        }
    });	
}
function doSubmit(){
	var description =$.description.value || "";
	var u_id = Ti.App.Properties.getString('u_id')||"";
	var g_id = num;
	if(description == "" || description == $.description.hintText){
		alert("Please type something on field box");
		return;
	}
	if(u_id == ""){
		alert("User Id is null\nPlease Login Again");
		doLogout();
		return;
	}
	var title =	(post_group)?args.g_name:group_name[num1];
	Alloy.Globals.loading.startLoading("Posting");
	var url = (edit)?"editPost":"doPost";
	var params = (edit)?{id:p_id,title:"Public Post",u_id:u_id,description:description,status:1}:{u_id:u_id,g_id:g_id,title:title,description:description,status:1};
	API.callByPost({url:url,params:params},{
	onload:function(responceText){
		var res = JSON.parse(responceText);
		var p_id = res.data[0].id;
		var image_counter = 0;
		if(res.status != "success"){
			Alloy.Globals.pageFlow.back();
			return;
		}
		if($.imageMother.children.length > 0 || $.videoMother.children.length > 0){
			console.log($.imageMother.children.length+" $.imageMother.children.length");
			for(var i = 0;i<$.imageMother.children.length;i++){
				var image = $.imageMother.children[i].toImage();
				var params1 = {p_id:p_id,u_id:u_id};
				_.extend(params1, {Filedata: image,media_type:"image"});	
				console.log("image:"+JSON.stringify(params1));				
				API.callByPost({url:"doPostImage",params:params1},{
					onload:function(responceText){			
						console.log("success");
						image_counter++;
						($.videoMother.children.length == 0)?discussion_refresh():"";
					},onerror:function(err){}
				});			
			}
			console.log("Video length:"+i<$.videoMother.children.length);
			if($.videoMother.children.length != 0){
				for(var i = 0;i<$.videoMother.children.length;i++){ 
					// var f = Ti.Filesystem.getFile($.videoMother.children[i].url);
					// var video = f.read();
					// console.log("Video url:"+$.videoMother.children[i].url);
					// console.log("video:"+JSON.stringify(video));
					var params1 = {p_id:p_id,u_id:u_id};
					_.extend(params1,{Filedata:video_blob,media_type:"video",img_thumb:video_image});
					console.log("params video:"+JSON.stringify(params1));
					API.callByPostVoice({url:"doPostImage",params:params1,type:"voice"},function(responseText){
						discussion_refresh();					
					}					
					);
				}				
			}
		}else{
			discussion_refresh();
		}
	},onerror:function(err){}});
}

function discussion_refresh(){
	if(refreshName != null){
		Ti.App.fireEvent("discussion:refresh",{refreshName:refreshName});
	}else{
		Ti.App.fireEvent("discussion:refresh");					
	}
	Alloy.Globals.loading.stopLoading();
	Alloy.Globals.pageFlow.back();
}

function renderPhotos(media) {
    for (var i=0; i < media.length; i++) {
    	var imgView =Ti.UI.createImageView({ image: media[i],top:10, width:Ti.UI.FILL, height: Ti.UI.SIZE });
		imgView.addEventListener("longclick",function(e1){
			$.imageMother.remove(e1.source);
		});    	
		$.imageMother.add(imgView);    	
	};
}
function openCamera(){
	var ImageFactory = require('ti.imagefactory');		
	Titanium.Media.showCamera({
		success:function(event) {
			// called when media returned from the camera
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {		
				var blobSize = event.height/event.width;			
				var imgView = Ti.UI.createImageView({
					top:'10dp',
					classes:['wfill','hsize'],
					image: event.media.imageAsThumbnail(640, blobSize*640)//ImageFactory.imageAsResized(event.media, { width:640,height:blobSize*640}),
				});
				imgView.addEventListener("longclick",function(e1){
					$.imageMother.remove(e1.source);
				});				
				console.log("Event Camera:"+JSON.stringify(event));				
				$.imageMother.add(imgView);
			} else {
				alert("Invalid Format");
			}
		},
		cancel:function() {
			// called when user cancels taking a picture
		},
		error:function(error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({title:'Camera'});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
        allowImageEditing:true,
        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
        saveToPhotoGallery:true
	});	
}
function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
function select_group(e) {
	if(!post_group){
		var arr = my_group.getDataById(u_id);
		var count = 1;
		arr.forEach(function(data) {
			group_name[count] = data.g_name;
			group_id[count] = data.g_id;
			count++;
		});
		
		var opts = {options: group_name, destructive: 0, title: 'Group'};
		var dialog = Ti.UI.createOptionDialog(opts);
		
		dialog.addEventListener("click", function(e) {
			if(e.index >= 0) {
				$.lb_group.setText(group_name[e.index]);
				num1 = e.index;
				num = group_id[e.index];
			}
		}); 	
		dialog.show();		
	}
}


$.description.addEventListener('focus', function(e) {
	if (e.source.value == e.source.hintText) {
		e.source.value = "";
	}
});

$.description.addEventListener('blur', function(e) {
	if (e.source.value == "") {
		e.source.value = e.source.hintText;
	}
});
