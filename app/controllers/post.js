var args = arguments[0] || {};
var edit = args.edit || false;
var p_id = args.p_id || "";
if(edit){
	setData();
}else{
	$.u_name.text = Ti.App.Properties.getString("u_name")||"";
}
function setData(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	console.log(JSON.stringify(res));
	$.description.value = res.description;
	$.u_name.text = res.u_name;
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
						top:'10dp',
						image:"file://"+imgArray[i],
						nativePath:"file://"+imgArray[i]
					});
					$.mother_post.add(imgView);
					doBlob();
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
	var picker = require('ti.gmimagepicker');		 
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
function doBlob(){
	var before =Ti.Filesystem.getFile($.mother_post.children[2].nativePath);
	console.log("asdf:"+JSON.stringify(before));
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
		setTimeout(function(){
			Alloy.Globals.loading.stopLoading();		
			if(res.status == "success"){
				alert("Success");
				Ti.App.fireEvent("discussion:refresh");
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
		$.mother_post.add(imgView);    	
	};
}
