var args = arguments[0] || {};
var edit = args.edit || false;
var post_group = args.post_group || false;
var p_id = args.p_id || "";
var refreshName = args.refreshName || null;
var num = args.g_id || 0;
console.log("num:"+num);
var u_id = Ti.App.Properties.getString("u_id")||"";
var my_group = Alloy.createCollection("my_group");
var group_id = [];
$.lb_group.setText(args.g_name);
group_id[0] = "";
var group_name = [];
group_name[0] = "Public Post";
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id);
$.u_img.image = (u_res.img_path!="") ? u_res.img_path : "/images/asp_square_logo.png";

if(edit){
	setData();
}else{
	$.u_name.text = Ti.App.Properties.getString("u_name")||"";
}
function setData(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	
	$.description.value = res.description;
	$.u_name.text = res.u_name;
}
function mediaOptions(){
	if($.imageMother.children.length > 2){
		alert("Limit reached!\nPlease remove image of bottom to add new image.");
		return;
	}	
	var options = ['Camera','Gallery','Cancel'];
	var opts = {cancel: 2,options:options,destructive: 0,title: 'Options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(e.index == 0){
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
			if(OS_ANDROID){
				add_image();			
			}else{
				showGMImagePicker();
			}
		}
	});	
	dialog.show();
}
function add_image() {
	var gallerypicker = require('titutorial.gallerypicker');
	gallerypicker.openGallery({
		cancelButtonTitle : "Cancel",
		doneButtonTitle : "Okay",
		title : "Gallery",
		errorMessage: "Limit reached",
		limit : 3,
		success : function(e) {
			Ti.API.info("response is => " + JSON.stringify(e));
			var imgArray = e.filePath.split(",");
	
			for(var i=0; i<imgArray.length; i++){
				if(imgArray[i]){
					var imgView = Ti.UI.createImageView({
						top:'10dp',
						classes:['wfill','hsize'],
						image:"file://"+imgArray[i],
					});
					imgView.addEventListener("longclick",function(e1){
						$.imageMother.remove(e1.source);
					});
					$.imageMother.add(imgView);
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
function showGMImagePicker() {
	var picker = require('ti.gmimagepicker');		 
	picker.openPhotoGallery({
		maxSelectablePhotos: 3,
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
function doSubmit(){
	var description =$.description.value || "";
	var u_id = Ti.App.Properties.getString('u_id')||"";
	var g_id = num;
	if(description == ""){
		alert("Please type something on field box");
		return;
	}
	if(u_id == ""){
		alert("User Id is null\nPlease Login Again");
		doLogout();
		return;
	}
	var title =	(post_group)?args.g_name:group_name[num];
	Alloy.Globals.loading.startLoading("Posting");
	var url = (edit)?"editPost":"doPost";
	var params = (edit)?{id:p_id,title:"Public Post",u_id:u_id,description:description,status:1}:{u_id:u_id,g_id:g_id,title:title,description:description,status:1};
	
	API.callByPost({url:url,params:params},{
	onload:function(responceText){
		var res = JSON.parse(responceText);
		console.log("result:"+JSON.stringify(res));
		var p_id = res.data[0].id;
		var image_counter = 0;
		if(res.status != "success"){
			Alloy.Globals.pageFlow.back();
			return;
		}
		if($.imageMother.children.length > 0){
			for(var i = 0;i<$.imageMother.children.length;i++){
				var image = $.imageMother.children[i].toImage();
				var params1 = {p_id:p_id,u_id:u_id};
				_.extend(params1, {Filedata: image});	
				console.log("image:"+JSON.stringify(params1));				
				API.callByPost({url:"doPostImage",params:params1},{
					onload:function(responceText){			
						console.log("success");
						image_counter++;
						if(image_counter >= $.imageMother.children.length)
							discussion_refresh();
					},onerror:function(err){}
				});			
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
	Titanium.Media.showCamera({
		success:function(event) {
			// called when media returned from the camera
			Ti.API.debug('Our type was: '+event.mediaType);
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				var imageView = Ti.UI.createImageView({
					classes:['wfill','hsize'],
					top:10,
					image: event.media
				});
				$.imageMother.add(imageView);
			} else {
				alert("got the wrong type back ="+event.mediaType);
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
				num = group_id[e.index];
			}
		}); 	
		dialog.show();		
	}	
}
