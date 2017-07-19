var offset=0;
var args = arguments[0] || {};
var u_id = args.u_id || null;
var cell_width;
var post_index = 0;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var mod = require('bencoding.blur');
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id); 

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
}

var vwTest = mod.createBasicBlurView({
	width:Ti.UI.FILL,
	height:"200%",
	blurRadius:10,
	image: '/images/profile_example.jpg'
});

$.testing.setHeight(cell_width);
$.testing1.setHeight(cell_width);
$.testing.add(vwTest);
console.log(cell_width);
$.img.setBorderRadius((cell_width / 2) - 10);
$.img.setWidth(cell_width - 20);
$.img.setHeight(cell_width - 20);
$.user_name.setWidth(cell_width - 40);
$.user_email.setWidth(cell_width - 40);
$.user_contact.setWidth(cell_width - 40);
$.user_position.setWidth(cell_width - 40);

function pixelToDp(px) {
    return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

function init(){	
	setData(u_res);
	var p_model = Alloy.createCollection("post");
	var p_res = p_model.getDataByU_id(false,offset,u_id);
	u_model = null;
	p_model = null;
	render_post(p_res,[]);
	Alloy.Globals.loading.startLoading("Loading...");	
}
function setData(u_res){
	$.user_name.setText(u_res.name);
	$.user_email.setText(u_res.email);
	$.user_position.setText(u_res.position||"Not yet Assign");
	$.user_contact.setText(u_res.mobile||"Not yet Assign");	
}

function hower_name(){
	alert(u_res.name);
}

function hower_email(){
	alert(u_res.email);
}

function hower_mobile(){
	alert(u_res.mobile);
}

function hower_position(){
	alert(u_res.position);
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
function render_post(params,params_img){
	params.forEach(function(entry){
		var container = $.UI.create("View",{classes:['view_class','vert','padding'],left:"0",right:"0",backgroundColor:"#fff",post_index:post_index});
		var title_container = $.UI.create('View',{classes:['wfill','horz'],height:68});
		var user_img = $.UI.create("ImageView",{classes:['padding'],width:45,height:45,image:"/images/user.png",u_id:entry.u_id});
		var title_child_container = $.UI.create("View",{classes:['wfill','hfill','padding'],left:0});
		var username = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],text:entry.u_name,left:"0",top:"0"});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:"0",bottom:0,text:"50 minutes ago"});
		var more_container = $.UI.create("View",{classes:['hfill'],width:"30",right:"0",u_id:entry.u_id,p_id:entry.id,post_index:post_index});
		var more = $.UI.create("ImageView",{right:"0",top:"0",image:'/images/btn-down.png',touchEnabled:false});
		var description = $.UI.create("Label",{classes:['wfill','hsize','padding'],top:"0",text:entry.description,p_id:entry.id});
		var hr = $.UI.create("View",{classes:['hr']});
		var comment_container = $.UI.create("View",{classes:['wfill','hsize','padding']});
		var comment_count = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:entry.comment_count+" comments",left:"0"});
		var comment_button_container = $.UI.create("View",{classes:['wsize','hsize','horz'],right:0});
		var comment_img = $.UI.create("ImageView",{image:"/images/comment.png"});
		var comment_button = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:"Comment"});
		container.add(title_container);
		container.add(description);
		if(params_img.length != 0){
			var image_container = $.UI.create("ScrollableView",{classes:['wfill','padding'],height:250,backgroundColor:"#000",top:"0",scrollingEnabled:true});
			params_img.forEach(function(entry1){
				var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
				var image = $.UI.create("ImageView",{classes:['wfill','hsize'],image:"/images/image_example.png"});		
				small_image_container.add(image);		
				image_container.addView(small_image_container);							
			});	
			container.add(image_container);
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
		more_container.addEventListener("click",function(e){
 			postOptions({u_id:e.source.u_id,p_id:e.source.p_id,post_index:e.source.post_index});
		});
		user_img.addEventListener("click",function(e){
			Alloy.Globals.loading.startLoading("Loading...");
			addPage("my_profile","My Profile",{u_id:e.source.u_id});
		});
		comment_button_container.addEventListener("click",function(e){
			addPage("post_comment","Post Comment");
		});	
		post_index++;	
	});
	Alloy.Globals.loading.stopLoading();
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
Ti.App.addEventListener("my_profile:refresh",refresh);
