var args = arguments[0] || {};
var edit = args.edit || false;
var p_id = args.p_id || "";
var refreshName = args.refreshName || null;
var num = 0;

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
					var img_view = Ti.UI.createView({ width:Ti.UI.FILL, height:Ti.UI.SIZE });
					var delete_img = Ti.UI.createImageView({ image:"/images/Icon_Delete_Round.png", width:30, height:30, top:15, right:5, number:num });
					var imgView = Ti.UI.createImageView({
						top:'10dp',
						image:"file://"+imgArray[i],
					});
					img_view.add(imgView);
			    	img_view.add(delete_img);
					$.imageMother.add(img_view);
					delete_img.addEventListener("click",function(e){
						$.imageMother.removeAllChildren();
					});  
					num++;
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
	var image = $.mother_post.children[2].children[0];
	console.log("asdf:"+JSON.stringify(image));	
	var img = image.toImage();
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
	_.extend(params, {Filedata: img});	
	Alloy.Globals.loading.startLoading("Posting");		
	API.callByPost({url:url,params:params},{
	onload:function(responceText){
		var res = JSON.parse(responceText);
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
 
    	var img_view = Ti.UI.createView({ width:Ti.UI.FILL, height:Ti.UI.SIZE });
    	var delete_img = Ti.UI.createImageView({ image:"/images/Icon_Delete_Round.png", width:30, height:30, top:15, right:5, number:num });
    	var img = Ti.UI.createImageView({ image:media[i],top:10, width:Ti.UI.FILL, height:Ti.UI.SIZE });
    	img_view.add(img);
    	img_view.add(delete_img);
		$.imageMother.add(img_view);
		delete_img.addEventListener("click",function(e){
			$.imageMother.removeAllChildren();
		});  
		num++;	
	};
	
}
function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
