var args = arguments[0] || {};
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var cell_width;
var mod = require('bencoding.blur');
var u_id = args.u_id || null;
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id);
var gender = "m";
var blob = "";
console.log(JSON.stringify(u_res));

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
}

function init(){
	Alloy.Globals.loading.startLoading("Loading...");
	userProfileImage();
	$.email.setText(u_res.email);
	$.name.setValue(u_res.name);
	$.position.setValue(u_res.position);
	$.mobile.setHintText("Not yet Assign");
	$.mobile.setValue(u_res.mobile);
	if(u_res.gender == "m" || u_res.gender == null){
		male_chkbox();
	}else{
		female_chkbox();
	}
}

init();

function editProfile(){
	Alloy.Globals.loading.startLoading("Loading...");
	var name = $.name.getValue();
	var mobile = $.mobile.getValue();
	var position = $.position.getValue();
	if(name == ""){
		alert("Name cannot be blank!");
	}else if(mobile == ""){
		alert("Mobile cannot be blank!");
	}else if(position == ""){
		alert("Position cannot be blank!");
	}else{
		var params = {u_id:u_id, name:name, mobile:mobile, gender:gender, position:position};
		_.extend(params, {Filedata: blob});	
		API.callByPost({
			url: "getEditProfile",
			new: true,
			params: params
		},{
		onload: function(res){
			var res = JSON.parse(res);
			var arr = res.data || null;
			console.log("Edit Profile "+JSON.stringify(arr));
			var checker = Alloy.createCollection('updateChecker'); 
			var isUpdate = checker.getCheckerById("1");
			API.callByPost({url:"getStaffList",params:{last_updated: isUpdate.updated}},{
				onload:function(responseText){
					var res = JSON.parse(responseText);
					var arr = res.data || null;
					var model = Alloy.createCollection("staff");
					model.saveArray(arr);
					model = null;
					arr = null;
					res =null;				
				}
			});
			setTimeout(function(){
				Alloy.Globals.loading.stopLoading();
				alert("Edit Success!");
				Alloy.Globals.pageFlow.back();	
				Ti.App.fireEvent("more:init");            
			},500);
		},
		onerror: function(e){
			console.log("Edit Profile fail!");
		}});	
	}
}
Ti.App.addEventListener("edit_profile:editProfile",editProfile);

function userProfileImage(){
	var img_blur = mod.createBasicBlurView({
		width:Ti.UI.FILL,
		height:"200%",
		blurRadius:10,
		image: (u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png",
		zIndex: '1'
	});

	var img_blurr = $.UI.create("View",{
		classes: ['wfill'],
		height: cell_width*1.2,
		backgroundColor: "#B3787878",
		zIndex: "2"
	});
	
	var img_mother = $.UI.create("ScrollView",{
		height: cell_width,
		width: cell_width,
		borderRadius: cell_width/2,
		zIndex: '3',
		backgroundColor: "#000"
	});
	
	var img_view = $.UI.create("View",{
		classes: ['wfill'],
		height: cell_width*1.2
	});
	
	var chg_icon = $.UI.create("ImageView",{
		width: cell_width*0.3,
		height: cell_width*0.3,
		right: cell_width/2,
		bottom: cell_width*1.2/2/2/2,
		borderRadius: cell_width*0.3/2,
		borderWidth: 3,
		borderColor: "#fff",
		image: "/images/camera_icon.png",
		zIndex: '4'
	});	
	
	var user_img = $.UI.create("ImageView",{
		//height: cell_width,
		width: cell_width,
		//borderRadius: cell_width/2,
		image: (u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png",
		zIndex: '3'
	});
	
	img_view.add(img_blur);
	img_view.add(img_blurr);
	img_mother.add(user_img);
	img_view.add(img_mother);
	img_view.add(chg_icon);
	chg_icon.addEventListener("click",function(e){
		if(OS_ANDROID) {
			try {
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
						
						img_mother.removeAllChildren();
						$.imageGroup_big.removeAllChildren();
						
						for(var i=0; i<imgArray.length; i++){
							if(imgArray[i]){
								var imgView = Ti.UI.createImageView({
									image: gallerypicker.decodeBitmapResource(imgArray[i], 640, 640),
									nativePath:"file:/"+e.filePath,
									width:Ti.UI.FILL,
									height:Ti.UI.SIZE,
									form_type:"image"
								});
								var imgView2 = Ti.UI.createImageView({
									image: gallerypicker.decodeBitmapResource(imgArray[i], 640, 640),
									nativePath:"file:/"+e.filePath,
									width:Ti.UI.FILL,
									height:Ti.UI.SIZE,
									form_type:"image"
								});
								
								img_view.children[0].image = "file://"+imgArray[i];
								img_mother.add(imgView);
								$.imageGroup_big.add(imgView2);
							}
						}
						blob = $.imageGroup_big.children[0].toImage();
					},
					error : function(e) {
						alert("error " + JSON.stringify(e));
					},
					cancel : function(e) {
						//alert("cancel " + JSON.stringify(e));
					}
				});
			}catch(e) {
				
			}
		}else {
			//img_view.remove(img_blur);
			var picker = require('ti.gmimagepicker');		
			picker.openPhotoGallery({
				maxSelectablePhotos: 1,
				// allowMultiple: false, // default is true
			    success: function (e) {
			        Ti.API.error('success: ' + JSON.stringify(e));
			        img_mother.removeAllChildren();
					$.imageGroup_big.removeAllChildren();
			        
					for (var i=0; i < e.media.length; i++) {
						var imgView = Ti.UI.createImageView({
							image: e.media[i],
							nativePath:e.media[i],
							width:Ti.UI.FILL,
							height:Ti.UI.SIZE,
							form_type:"image"
						});
						var imgView2 = Ti.UI.createImageView({
							image: e.media[i],
							nativePath:e.media[i],
							width:Ti.UI.FILL,
							height:Ti.UI.SIZE,
							form_type:"image"
						});
						
						img_view.children[0].image = e.media[i];
						img_mother.add(imgView);
						$.imageGroup_big.add(imgView2);
					};
					blob = $.imageGroup_big.children[0].toImage();
			    },
			    cancel: function (e) {
			    	Ti.API.error('cancel: ' + JSON.stringify(e));
			    },
			    error: function (e) {
			        Ti.API.error('error: ' + JSON.stringify(e));
			    }
			});
		}
	});
	$.user_img.add(img_view);
	Alloy.Globals.loading.stopLoading();	
}

function createMessage(t,e){
	var box = Titanium.UI.createAlertDialog({
		title: t,
		message: e
	});
	box.show();
};

function showEmail(){
	//alert(u_res.email);
	createMessage("Can't edit",u_res.email);
}

function male_chkbox(){
	$.male.image = "/images/checkbox_checked.png";
	$.female.image = "/images/checkbox_unchecked.png";
	gender = "m";
}

function female_chkbox(){
	$.female.image = "/images/checkbox_checked.png";
	$.male.image = "/images/checkbox_unchecked.png";
	gender = "f";
}

function chgPw(){
	addPage("change_password","Change Password",{u_id:u_id},"change_password:savePw");
}

function renderPhotos(media) {
    
}