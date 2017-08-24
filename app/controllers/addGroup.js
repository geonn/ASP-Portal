var offcount = 0;
var member = [];
var name = "";
var chk = true;
var u_id = Ti.App.Properties.getString("u_id") || "";
var unchecker = "/images/checkbox_unchecked.png";
var checker = "/images/checkbox_checked.png";
if (OS_IOS) {
	$.selectedList.bottom = 50;
	$.mother_view.bottom = 100;
};
function doSubmit(){
	name = $.groupname.getValue();
	var length = $.selectedList.getChildren().length;
	if(length > 0){
		console.log("startLoading");
		Alloy.Globals.loading.startLoading("Loading...");
		console.log("starting");
		if ($.imageGroup_big.children.length > 0) {
			var encode = $.imageGroup_big.children[0].toImage();
		}else{
			console.log("stopLoading");
			Alloy.Globals.loading.stopLoading();
			alert("Please choose group image!!!");
			return;
		};
		console.log(name+" name");
		if(name == ""){
			alert("Group name Cannot be empty!!!");
			Alloy.Globals.loading.stopLoading();
			return;
		}
		if(u_id == ""){
			alert("User Id is null\nPlease Login Again");
			doLogout();
			return;
		}
		for(var i=0;i<$.selectedList.getChildren().length;i++){
			member.push($.selectedList.getChildren()[i].staffId);
		}
		var params={name:name,u_id:u_id,member:member.join()};
		_.extend(params,{Filedata:encode});
		API.callByPost({url:"addGroup",params:params },{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				Alloy.Globals.loading.stopLoading();
				Alloy.Globals.pageFlow.back();
				Ti.App.fireEvent("groupList:init");		
				alert("Add Group Success!!!");
				
			},onerror:function(err){
				console.log(err);
				Alloy.Globals.loading.stopLoading();
				Alloy.Globals.pageFlow.back();
			}
		});
	}else{
		alert("Please pick more than one member.");
	}
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
						image: "file://"+imgArray[i],
						width:Ti.UI.FILL,
						height:Ti.UI.SIZE
					});
					var imgView2 = Ti.UI.createImageView({
						image: "file://"+imgArray[i],
						width:Ti.UI.FILL,
						height:Ti.UI.SIZE
					});
					
					$.imageGroup.removeAllChildren();
					$.imageGroup_big.removeAllChildren();
					$.imageGroup.add(imgView);
					$.imageGroup_big.add(imgView2);
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
function showBar(param,position){
	for(var i=0;i<$.selectedList.getChildren().length;i++){
		if(param.id == $.selectedList.getChildren()[i].staffId){
			$.selectedList.remove($.selectedList.getChildren()[i]);
			if($.selectedList.getChildren().length==0){
				if (OS_IOS) {
					$.selectedList.setHeight(0);
					$.addgroup.bottom = 0;
				}else {
					setTimeout(function(){
			            $.mother_view.setBottom(0);
			            $.selectedList.setHeight(0);
					},500);
				}
			}
			return;
		}
	}
	if (OS_IOS) {
		$.selectedList.setHeight(50);
		$.addgroup.bottom = 50;
		$.addgroup.setHeight(50);
	}else{
		$.mother_view.setBottom(40);
		$.selectedList.setHeight(50);
		$.addgroup.setHeight(50);
	};
	var container = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:(param.img_path != undefined)?param.img_path:"/images/default_profile.png",staffId:param.id,position:position,backgroundColor:"#23C282"});
	$.selectedList.add(container);
	
	container.addEventListener("click",function(e){
		$.selectedList.remove(e.source);
		
		var getposition = children({name:"position", value:position}, $.mother_view);
		try {
			getposition.children[1].image = unchecker;
			getposition.check = false;
		}catch(e) {
			//
		}
		
		if($.selectedList.getChildren().length==0){
			if (OS_IOS) {
				$.selectedList.setHeight(0);
				$.addgroup.setHeight(0);
			}else {
				setTimeout(function(){
					$.mother_view.setBottom(0);
					$.selectedList.setHeight(0);
					$.addgroup.setHeight(0);
				},500);
			}
		}
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
function init(){
	$.myInstance.show('',false);
	$.scrollview.scrollingEnabled = false;
	setTimeout(render,2000);
}init();
function render(){
	if(offcount == 0) {
		$.mother_view.removeAllChildren();
	}
	
	var model = Alloy.createCollection("staff");
	var arr = model.getDataForRenderStaffList(false,offcount);
	
	for(var i=0;i<arr.length||show_MotherView();i++){
		var container = $.UI.create("View",{classes:['wfill','hsize','padding','toucha3a3a3'],top:0,staff:arr[i],check:false,position:arr[i].id});
		var small_container = $.UI.create("View",{height:'65',width:"84%",left:"0",touchEnabled:false});
		var userImg = (arr[i].img_path != "")?arr[i].img_path:"/images/default_profile.png";
		var image = $.UI.create("ImageView",{classes:['padding'],left:5,width:45,height:45,image:userImg,touchEnabled:false});
		var title = $.UI.create("Label",{classes:['wfill','hsize'],left:'60',text:arr[i].name,touchEnabled:false});
		var checkBox = $.UI.create("ImageView",{width:20,height:20,right:10,image:unchecker,touchEnabled:false});
		if(OS_ANDROID){
			title.ellipsize=true;
			title.wordWrap=false;
		}
		small_container.add(image);
		small_container.add(title);
		container.add(small_container);
		container.add(checkBox);	
		$.mother_view.add(container);
		container.addEventListener("click",function(e){	
			e.source.children[1].image =(!e.source.check)?checker:unchecker;
			e.source.check = !e.source.check;
			showBar(e.source.staff,e.source.position);
		});			
	}	
}
function show_MotherView(){
	offcount+=20;
	$.mother_view.opacity = 1;		
	$.myInstance.hide();
	$.scrollview.scrollingEnabled = true;	
	return false;	
}
function scrollChecker(e){
	if(offcount != 0) {
		var theEnd = $.mother_view.rect.height;
		var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
		var nearEnd = theEnd - 200;
		if (total >= nearEnd){
			render();
			
		}
	}
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
    $.imageGroup_big.removeAllChildren();
    for (var i=0; i < media.length; i++) {
    	var imgView =Ti.UI.createImageView({ image: media[i],top:0, width:Ti.UI.FILL, height: Ti.UI.FILL });
		$.imageGroup.add(imgView);
		var imgView2 =Ti.UI.createImageView({ image: media[i],top:0, width:Ti.UI.FILL, height: Ti.UI.SIZE });
		$.imageGroup_big.add(imgView2);  	
	};
}
$.staffName.listener('change', function(e){
	if(e.source.value != "") {
		$.mother_view.removeAllChildren();
		offcount = 0;
		
		var model = Alloy.createCollection("staff");
		var arr = model.searchStaff(e.source.value, false);
		var boll = false;
		var img = "/images/checkbox_unchecked.png";
		var cdtion = false;
		
		for(var i=0;i<arr.length;i++){
			if ($.selectedList.getChildren().length >= 1) {
			for(var ii = 0; ii < $.selectedList.getChildren().length; ii++) {
				if(arr[i].id == $.selectedList.children[ii].position) {
					boll = !boll;
					img = "/images/checkbox_checked.png";
					cdtion = true;
				}else {
					boll = false;
					img = "/images/checkbox_unchecked.png";
				}
				if(ii == $.selectedList.getChildren().length - 1 || cdtion) {
					var container = $.UI.create("View",{classes:['wfill','hsize','padding'],top:0,staff:arr[i],check:false,position:arr[i].id});
					var small_container = $.UI.create("View",{height:'65',width:"84%",left:"0",touchEnabled:false});
					var userImg = (arr[i].img_path != "")?arr[i].img_path:"/images/default_profile.png";
					var image = $.UI.create("ImageView",{classes:['padding'],left:5,width:45,height:45,image:userImg,touchEnabled:false});
					var title = $.UI.create("Label",{classes:['wfill','hsize'],left:'60',text:arr[i].name,touchEnabled:false});
					var checkBox = $.UI.create("ImageView",{width:20,height:20,right:10,image:unchecker,touchEnabled:false});
					if(OS_ANDROID){
						title.ellipsize=true;
						title.wordWrap=false;
					}
					small_container.add(image);
					small_container.add(title);
					container.add(small_container);
					container.add(checkBox);	
					$.mother_view.add(container);
					container.addEventListener("click",function(e){	
						e.source.children[1].image =(!e.source.check)?checker:unchecker;
						e.source.check = !e.source.check;
						showBar(e.source.staff,e.source.position);
					});
					
					cdtion = false;
					break;
				}
			}
			}else{
				var container = $.UI.create("View",{classes:['wfill','hsize','padding'],top:0,staff:arr[i],check:false,position:arr[i].id});
				var small_container = $.UI.create("View",{height:'65',width:"84%",left:"0",touchEnabled:false});
				var userImg = (arr[i].img_path != "")?arr[i].img_path:"/images/default_profile.png";
				var image = $.UI.create("ImageView",{classes:['padding'],left:5,width:45,height:45,image:userImg,touchEnabled:false});
				var title = $.UI.create("Label",{classes:['wfill','hsize'],left:'60',text:arr[i].name,touchEnabled:false});
				var checkBox = $.UI.create("ImageView",{width:20,height:20,right:10,image:unchecker,touchEnabled:false});
				if(OS_ANDROID){
					title.ellipsize=true;
					title.wordWrap=false;
				}
				small_container.add(image);
				small_container.add(title);
				container.add(small_container);
				container.add(checkBox);	
				$.mother_view.add(container);
				container.addEventListener("click",function(e){	
					e.source.children[1].image =(!e.source.check)?checker:unchecker;
					e.source.check = !e.source.check;
					showBar(e.source.staff,e.source.position);
				});
			}
		}
	}else{
		render();
	}
});