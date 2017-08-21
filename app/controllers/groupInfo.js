var args = arguments[0] || {};
var g_id = args.g_id || undefined;
var cell_width;
var arr = args.arr || {};
var usermodel = Alloy.createCollection("staff");
var creatordata = usermodel.getSmallDataById(arr.u_id);
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var u_id = Ti.App.Properties.getString("u_id") || undefined;

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
}
function init(){
	$.info_view.height = cell_width*2.5;
	$.info_view.width = cell_width*1.8;
	$.title.width = cell_width*1.8;
	$.scrollView.height = cell_width*2.5-101;
	$.ok_button.width = cell_width*1.8;
	getData();
}
init();
function getData(){
	var model = Alloy.createCollection("my_group");
	API.callByPost({url:"getGroupListMemberByGid",params:{g_id:g_id}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var data = res.data || {};
			model.saveArray(data);
			var count = model.getMemberCountByG_id(g_id);
			$.member.text = count.memberCount+" Members";
			count = undefined;			
			data = undefined;
			res = undefined;
			model = undefined;
			setData();
		}
	});
}
function setData(){
	$.g_name.text = arr.name;
	$.creator.text = creatordata.name;
}
function doleaveGroup(e){
	COMMON.createAlert("Warning","Are you sure want to leave this group?",function(e){
		if(u_id == undefined){
			alert("User Id is null\nPlease Login Again");
			doLogout();
			return;
		}
		if(g_id == undefined){
			alert("Group id is null");
			Alloy.Globals.pageFlow.back();
			return;		
		}
		API.callByPost({url:"deleteGroupMember",params:{u_id:u_id,g_id:g_id}},{
			onload:function(responseText){
				var res = JSON.parse(responseText);
				if(res.status == "success"){
					alert("Success");
					$.args.motherView.remove($.args.childView);							
					Alloy.Globals.pageFlow.back();		
				}
			}
		});
	});	
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
		limit : 1,
		success : function(e) {
			Ti.API.info("response is => " + JSON.stringify(e));
			var imgArray = e.filePath.split(",");
	
			for(var i=0; i<imgArray.length; i++){
				if(imgArray[i]){
					$.g_image.image = "file://"+imgArray[i];
					$.args.GroupImg.image = "file://"+imgArray[i];
					$.args.outsideImg.image = "file://"+imgArray[i];
					changeImage();
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
		maxSelectablePhotos: 1,
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
function renderPhotos(media) {
    for (var i=0; i < media.length; i++) {
		$.g_image.image = media[i];
		$.args.GroupImg.image = media[i];	
		$.args.outsideImg.image = media[i];
		changeImage();		
	};
}
function openCamera(){
	Titanium.Media.showCamera({
		success:function(event) {
			// called when media returned from the camera
			Ti.API.debug('Our type was: '+event.mediaType);
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				$.g_image.image = event.media;
				$.args.GroupImg.image = event.media;	
				$.args.outsideImg.image = event.media;
				changeImage();				
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
function changeImage(){
	Alloy.Globals.loading.startLoading("Loading...");	
	setTimeout(function(){
		var encode = $.args.GroupImg.toImage();	
		var param = {id:g_id,u_id:u_id};
		_.extend(param,{Filedata:encode});
		API.callByPost({url:"updateGroupPhoto",params:param},{
			onload:function(responseText){
				var res = JSON.parse(responseText);
				console.log(JSON.stringify(res));
				Alloy.Globals.loading.stopLoading();			
			}
		});		
	},1000);
}
function closeView(){
	$.args.mother.remove($.getView()); 
}
function showmember(){
	addPage("showGroupMember",arr.name+" Members",{g_id:g_id});
};
function showCreator(){
	addPage("my_profile","My Profile",{u_id:creatordata.id});
}
