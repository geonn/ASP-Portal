var args = arguments[0] || {};
var edit = args.edit || false;
var p_id = args.p_id || "";
var refreshName = args.refreshName || null;
var num = 0;
var u_id = Ti.App.Properties.getString("u_id")||"";
var my_group = Alloy.createCollection("my_group");
var g_id = [];
g_id[0] = "";

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
		maxSelectablePhotos: 30,
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
	var g_id = "";
	if(description == ""){
		alert("Please type something on field box");
		return;
	}
	if(u_id == ""){
		alert("User Id is null\nPlease Login Again");
		doLogout();
		return;
	}
	var url = (edit)?"editPost":"doPost";
	var params = (edit)?{id:p_id,title:"Public Post",u_id:u_id,description:description,status:1}:{u_id:u_id,g_id:"",title:"Public Post",description:description,status:1};
	Alloy.Globals.loading.startLoading("Posting");		
	API.callByPost({url:url,params:params},{
	onload:function(responceText){
		var res = JSON.parse(responceText);
		console.log("result:"+JSON.stringify(res));
		var p_id = res.data[0].id;
		for(var i = 0;i<$.imageMother.children.length;i++){
			var image = $.imageMother.children[i].toImage();	
			var params1 = {p_id:p_id,u_id:u_id};	
			console.log("image:"+JSON.stringify(image));
			_.extend(params1, {Filedata: image});	
			console.log("image:"+JSON.stringify(params1));				
			API.callByPost({url:"doPostImage",params:params1},{
				onload:function(responceText){
					console.log("success");
				},onerror:function(err){}
			});			
		}
		setTimeout(function(){
			Alloy.Globals.loading.stopLoading();		
			if(res.status == "success"){
				if(refreshName != null){
					console.log("asdf:"+refreshName);
					Ti.App.fireEvent("discussion:refresh",{refreshName:refreshName});														
				}else{
					Ti.App.fireEvent("discussion:refresh");					
				}
				Alloy.Globals.pageFlow.back();			
			}else{
				alert("Something wrong!");
				Alloy.Globals.pageFlow.back();
			}			
		},2000);
	},onerror:function(err){}});
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
	var options = [];
	options[0] = "Public";
	var arr = my_group.getData(u_id);
	console.log("arr" + JSON.stringify(arr)+" "+arr[0].g_name);
	var count = 1;
	arr.forEach(function(data) {
		options[count] = data.g_name;
		g_id[count] = data.g_id;
		count++;
	});
	
	var opts = {options: options, destructive: 0, title: 'Year'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
		if(e.index >= 0) {
			$.lb_group.setText(options[e.index]);
			console.log($.lb_goup.text);
		}
	});
	
	dialog.show();
}