var args = arguments[0] || {};
var p_id = args.p_id || "";
var u_id1;
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");

function init(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	setData(res);
}init();

function setData(params){
	$.user_name.text = params.u_name;
	u_id1 = params.u_id;
	var u_model = Alloy.createCollection("staff");
	var u_res = u_model.getDataById(u_id1);
	$.desc.text = params.description;
	$.count_coment.text = params.comment_count+" comment";
	$.date_time.setText(countdown.getTimePost(params.created));
	$.img.image = (u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png";
	var imgArr = i_model.getImageByCateandPriId(true,undefined,2,p_id);
	var count_img = 1;
	if(imgArr.length != 0){
		var imglength = imgArr.length;
		var image_container = $.UI.create("ScrollableView",{classes:['wfill'],height:250,backgroundColor:"#000",top:"0",scrollingEnabled:true});
		var imgcount_container = $.UI.create("View",{classes:['wsize','hsize'],backgroundColor:"#99000000",zIndex:10,right:10,top:10,borderRadius:"5"});
		var imgcount = (imglength > 1) ? $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,color:"#fff",text:"1/"+imglength,imglength:imglength}) : $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,imglength:imglength});
		imgcount_container.add(imgcount);
		imgArr.forEach(function(entry1){
			var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
			var image = $.UI.create("ImageView",{classes:['wfill','hsize'],image:entry1.img_path, defaultImage: "/images/loading.png"});
			small_image_container.add(image);
			image_container.addView(small_image_container);
			image.addEventListener("click",function(e){
				try {
					addPage("zoomView","Image Preview",{img_path:e.source.image});
				}catch(e) {
					//
				}
			});	
		});
		image_container.addEventListener("scrollend",function(e){
			if(e.currentPage != undefined && imgcount.imglength > 1) {
				var count = (e.currentPage + 1) + "/" + imgcount.imglength;
				imgcount.setText(count);
			}
		});
		$.p_img.add(image_container);
		$.p_img.add(imgcount_container);
	}
}	

function postOptions(){
	var u_id = Ti.App.Properties.getString("u_id")||"";
	var options = (u_id == u_id1)?['Edit','Delete','Cancel']:['Favourite','Report','Cancel'];
	var checking = (u_id == u_id1)?true:false;
	var opts = {cancel: 2,options:options,destructive: 0,title: 'More options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(checking&&e.index == 0){
			addPage("post","Edit Post",{p_id:p_id,edit:true,refreshName:"post_detail:init"});
		}
		if(checking&&e.index == 1){
			deletePost(p_id);
		}
	});	
	dialog.show();
}

function deletePost(){
	COMMON.createAlert("Warning","Are you sure want to delete this post?",function(e){
		Alloy.Globals.loading.startLoading("Delete...");		
		API.callByPost({url:"deletePost",params:{id:p_id,status:2}},{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				if(res.status != "success"){
					Ti.App.fireEvent("discussion:refresh");
					Alloy.Globals.pageFlow.back();							
					Alloy.Globals.loading.stopLoading();							
					alert("Something wrong right now please try again later.");
				}else{
					Alloy.Globals.pageFlow.back();				
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
			}
		});
	});
}

function goProfile(){
	addPage("my_profile","My Profile",{u_id:u_id1});
}

function goComment(){
	addPage("post_comment","Post Comment",{p_id:p_id});
}

Ti.App.addEventListener("post_detail:init",init);
