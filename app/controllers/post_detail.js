var args = arguments[0] || {};
var p_id = args.p_id || "";
var u_id1;
var u_id = Ti.App.Properties.getString('u_id')||undefined;
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");
Ti.App.Properties.setString('current_post_id', p_id);

function init(){
	Alloy.Globals.loading.stopLoading();	
	var model = Alloy.createCollection("post");
	console.log("P_id:"+p_id);
	var res = model.getDataById(p_id);
	if(res == undefined){
		alert("Post no longer exists!");
		setTimeout(function(){
			Alloy.Globals.pageFlow.back();			
		},1000);
		return;	
	}
	console.log(res);
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
		var imgcount_container = (imglength > 1) ? $.UI.create("View",{classes:['wsize','hsize','horz'],backgroundColor:"#99000000",imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"}) : $.UI.create("View",{classes:['wsize','hsize'],imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"});
		var imgcount = (imglength > 1) ? $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,right:5,color:"#fff",text:"1/"+imglength,imglength:imglength}) : $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,right:5,imglength:imglength});
		var img_icon = (imglength > 1) ? $.UI.create("ImageView", {image: "/images/img_icon.png", width:20, height: 17, right: 10}) :  $.UI.create("ImageView", {width:0, height:0});
		imgcount_container.add(imgcount);
		imgcount_container.add(img_icon);
		imgArr.forEach(function(entry1){
			var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
			var image = $.UI.create("ImageView",{classes:['wfill','hsize'],image:entry1.img_path, defaultImage: "/images/loading.png"});
			small_image_container.add(image);
			image_container.addView(small_image_container);
			image.addEventListener("click",function(e){
				//try {
					addPage("zoomView","Image Preview",{img_path:e.source.image});
				// }catch(e) {
					// //
				// }
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
	commentInit();
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

function goComment(e){
	addPage("post_comment","Post Comment",{p_id:p_id,comment_count:e.source.children[1].children[0],comment_count1:$.args.comment_count});
}
function commentInit() {
	if(p_id == null){
		Alloy.Globals.pageFlow.back();	
		Alloy.Globals.loading.stopLoading();			
		return;	
	}
	if(u_id == undefined){
		alert("User Id is null\nPlease Login Again");
		doLogout();
		return;
	}	
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("4");		
	var params = {p_id:p_id};
	API.callByPost({url:"getPostCommentList",params:params},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("post_comment");
			model.saveArray(arr);
			var data = model.getDataByP_id(p_id);
			render_comment(data);
		    checker.updateModule("4","post_comment",currentDateTime(),u_id);	
		    res = undefined;
		    arr = undefined;
		    model = undefined;		
		},
		onerror:function(err){
			
		}
	});	
}
function render_comment(params){
	$.list_comment.removeAllChildren();
	params.forEach(function(entry){
		var container = $.UI.create("View",{classes:['wfill','toucha3a3a3','hsize','horz'],u_id:entry.u_id,c_id:entry.id});
		var profileImg = $.UI.create("ImageView",{classes:['padding','touchRealEmpty'],u_id:entry.u_id,width:55,height:55,image:(entry.img_path != "")?entry.img_path:"/images/default_profile.png"});
		var small_container = $.UI.create("View",{classes:['wfill','hsize','vert'],touchEnabled:false,top:5});
		var name = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],left:0,top:0,text:entry.name});
		var comment = $.UI.create("Label",{classes:['wsize','hsize','h4'],left:0,right:10,touchEnabled:false,text:entry.comment});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:0,touchEnabled:false,color:"#7CC6FF",text:countdown.getTimePost(entry.created),bottom:10});	
		small_container.add(name);
		small_container.add(comment);
		small_container.add(time);
		container.add(profileImg);
		container.add(small_container);
		$.list_comment.add(container);		
		container.addEventListener("longclick",function(e){
			if(u_id == e.source.u_id){
				deleteOptions(true,e.source.c_id);
			}
		});
		profileImg.addEventListener("click",function(e){
			addPage("my_profile","My Profile",{u_id:e.source.u_id});
		});
		container = undefined;
		profileImg = undefined;
		small_container = undefined;
		name = undefined;
		comment = undefined;
		time = undefined;
	});
	setTimeout(function(){
		//$.scrollView.scrollToBottom();	
	},500);
	Alloy.Globals.loading.stopLoading();	
}
function deleteOptions(params,c_id){
	var options = (params)?['Delete','Cancel']:['Report','Cancel'];
	var opts = {cancel: 1,options:options,destructive: 0,title: 'More options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(params&&e.index == 0){
			deleteComment(c_id);
		}
	});	
	dialog.show();
	options = undefined;
	opts = undefined;
}
function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
function deleteComment(c_id){
	var params = {id:c_id};
	API.callByPost({url:"removePostComment",params:params},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			console.log("return data"+responseText);
			if(res.status == "success"){
				init();
				console.log("commentCount:"+JSON.stringify(res));
			}
			else{
				alert("Something wrong!!!");
			}
		},
		error:function(err){
			
		}		
	});
}
Ti.App.addEventListener("post_detail:init",init);
