var offset=0;
var args = arguments[0] || {};
var u_id = args.u_id || null;
var cell_width;
var post_index = 0;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var mod = require('bencoding.blur');
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id);
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");
if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
	var control = Ti.UI.createRefreshControl({
    	tintColor:"#00CB85"
	});
	$.mother_view.refreshControl = control;
	control.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    setTimeout(function(e){
	        Ti.API.debug('Timeout');
	        $.mother_view.scrollTo(0,0,true);	
			setTimeout(function(){
				refresh();
			},500);	        
	        control.endRefreshing();
	    }, 1000);
	});	
}

var img_blur = mod.createBasicBlurView({
	width:Ti.UI.FILL,
	height:"200%",
	blurRadius:10,
	image: (u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png"
});

$.testing.setHeight(cell_width);
$.testing1.setHeight(cell_width);
$.testing.add(img_blur);
$.img.setWidth(cell_width);
$.imgv.setBorderRadius((cell_width / 2) - 10);
$.imgv.setWidth(cell_width - 20);
$.imgv.setHeight(cell_width - 20);
$.user_name.setWidth(cell_width - 40);
$.user_email.setWidth(cell_width - 40);
$.user_contact.setWidth(cell_width - 40);
$.user_position.setWidth(cell_width - 40);

function pixelToDp(px) {
    return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

function init(){		
	if (u_res.gender == "m") {
		$.gender.image = "/images/icon_male.png";
	}else{
		$.gender.image = "/images/icon_female.png";
	};
	setData(u_res);
}
function setData(u_res){
	$.user_name.setText(u_res.name);
	$.user_email.setText(u_res.email);
	$.user_position.setText(u_res.position||"Not yet Assign");
	$.user_contact.setText(u_res.mobile||"Not yet Assign");	
	$.img.image = (u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png";
	offset = 0;
	var p_model = Alloy.createCollection("post");
	var p_res = p_model.getDataByU_id(false,offset,u_id);
	u_model = null;
	p_model = null;
	render_post(p_res);
}

function hower_name(){
	//alert(u_res.name);
	createMessage("Name",u_res.name);
}

function hower_email(){
	//alert(u_res.email);
	createMessage("Email",u_res.email);
}

function hower_mobile(){
	//alert(u_res.mobile);
	createMessage("Mobile",u_res.mobile);
}

function hower_position(){
	//alert(u_res.position);
	createMessage("Position",u_res.position);
}
refresh();
function refresh(e){
	if(u_id == null){
		alert("User Id no found!!!");
		Alloy.Globals.pageFlow.back();							
		return;
	}	
	Alloy.Globals.loading.startLoading("Refreshing...");	
	$.mother_post.removeAllChildren();	
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("2");
	API.callByPost({url:"getPostList",params:{last_updated: isUpdate.updated}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("post");
			model.saveArray(arr);
			init();	
			model = null;
			arr = null;
			res =null;	
			Alloy.Globals.loading.stopLoading();			
		}
	});	
}
function render_post(params){
	params.forEach(function(entry){
		var imgArr = i_model.getImageByCateandPriId(true,undefined,2,entry.id);
		var container = $.UI.create("View",{classes:['view_class','vert','padding'],left:"0",right:"0",backgroundColor:"#fff",post_index:post_index});
		var title_container = $.UI.create('View',{classes:['wfill','horz'],height:68});
		var user_img = $.UI.create("ImageView",{classes:['padding'],width:45,height:45,image:(u_res.img_path!="")?u_res.img_path:"/images/my_profile_square.png",u_id:entry.u_id,defaultImage:"/images/asp_square_logo.png"});
		var title_child_container = $.UI.create("View",{classes:['wfill','hfill','padding'],left:0});
		var username = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],text:entry.u_name,left:"0",top:"0"});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:"0",bottom:0,color:"#7CC6FF",text:countdown.getTimePost(entry.created),p_id:entry.id});
		var more_container = $.UI.create("View",{classes:['hfill'],width:"30",right:"0",u_id:entry.u_id,p_id:entry.id,post_index:post_index});
		var more = $.UI.create("ImageView",{right:"0",top:"0",image:'/images/btn-down.png',touchEnabled:false});
		var description = $.UI.create("Label",{classes:['wfill','hsize','padding'],top:"0",text:entry.description,p_id:entry.id});
		var hr = $.UI.create("View",{classes:['hr']});
		var comment_container = (OS_IOS)?$.UI.create("View",{classes:['wfill','hsize'],left:"10",right:"10",p_id:entry.id}):$.UI.create("View",{classes:['wfill','hsize','padding'],p_id:entry.id});
		var comment_count = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:entry.comment_count+" comments",left:"0",p_id:entry.id,touchEnabled:false});
		var comment_button_container = $.UI.create("View",{classes:['wsize','hsize','horz'],right:0,p_id:entry.id,touchEnabled:false});
		var comment_img = $.UI.create("ImageView",{image:"/images/comment.png",p_id:entry.id});
		var comment_button = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:"Comment",p_id:entry.id});
		container.add(title_container);
		container.add(description);
		if(imgArr.length != 0){
			var img_count = $.UI.create("View", {classes:['wfill', 'hsize'], left: 10, right: 10});
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
                if(e.currentPage != undefined && e.source.parent.children[1].children[0].imglength > 1) {
                    var count = (e.currentPage + 1) + "/" + e.source.parent.children[1].children[0].imglength;
                    e.source.parent.children[1].children[0].text = count;
                    count = undefined;
                }
            });
			img_count.add(image_container);
			img_count.add(imgcount_container);
			container.add(img_count);
		}
		container.add(hr);
		container.add(comment_container);
		comment_container.add(comment_count);
		comment_container.add(comment_button_container);
		comment_button_container.add(comment_img);
		comment_button_container.add(comment_button);
		title_container.add(user_img);
		title_child_container.add(username);
		title_child_container.add(time);
		more_container.add(more);
		title_child_container.add(more_container);
		title_container.add(title_child_container);
		$.mother_post.add(container);
		description.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id});
		});
		time.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id});
		});
		more_container.addEventListener("click",function(e){
 			postOptions({u_id:e.source.u_id,p_id:e.source.p_id,post_index:e.source.post_index});
		});
		comment_container.addEventListener("click",function(e){
			//Alloy.Globals.loading.startLoading("Loading...");			
			addPage("post_comment","Post Comment",{p_id:e.source.p_id,comment_count:e.source.children[0]});
		});
		imgArr=undefined;
		container=undefined;
		title_container=undefined;
		user_img=undefined;
		title_child_container=undefined;
		username=undefined;
		time=undefined;
		more_container=undefined;
		more=undefined;
		description=undefined;
		hr=undefined;
		comment_container=undefined;
		comment_count=undefined;
		comment_button_container=undefined;
		comment_img=undefined;
		comment_button=undefined;
		img_container=undefined;	
		post_index++;	
	});
}
function postOptions(params){
	var u_id = Ti.App.Properties.getString("u_id")||"";
	var options = (u_id == params.u_id)?['Edit','Delete','Cancel']:['Favourite','Report','Cancel'];
	var checking = (u_id == params.u_id)?true:false;
	var opts = {cancel: 2,options:options,destructive: 0,title: 'More options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(checking&&e.index == 0){
			addPage("post","Edit Post",{p_id: params.p_id,edit:true,refreshName:"my_profile:refresh"});
		}
		if(checking&&e.index == 1){
			deletePost(params.p_id,params.post_index);
		}
	});	
	dialog.show();
}
function deletePost(p_id,p_index){
	COMMON.createAlert("Warning","Are you sure want to delete this post?",function(e){
		Alloy.Globals.loading.startLoading("Delete...");		
		API.callByPost({url:"deletePost",params:{id:p_id,status:2}},{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				if(res.status != "success"){
					Alloy.Globals.loading.stopLoading();							
					alert("Something wrong right now please try again later.");
				}else{
					refresh();			
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
			}
		});
	});
}
if (OS_ANDROID) {
	$.swipeRefresh.addEventListener('refreshing',function(e){
		refresh();
		e.source.setRefreshing(false);		
	});
};
function createMessage(t,e){
	var box = Titanium.UI.createAlertDialog({
		title: t,
		message: e
	});
	box.show();
};

function scrollChecker(e){
	var theEnd = $.mother_list.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd - 200;
	if(total >= nearEnd){
		getData();
	}
}

function getData(){
	var model = Alloy.createCollection("post");
	offset += 10;
	var res = model.getDataByU_id(false,offset,u_id);
	model = null;
	render_post(res);
}

Ti.App.addEventListener("my_profile:refresh",refresh);
