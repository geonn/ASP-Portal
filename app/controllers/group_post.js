var args = arguments[0] || {};//args.g_id
var model = Alloy.createCollection("groups");
var g_id = args.g_id || undefined;
var g_name;
var arr = model.getData(args.g_id);
var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");
var offset=0;
var post_index = 1;
var offset1 = 0;
var u_id = Ti.App.Properties.getString("u_id") || undefined;
if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
	var control = Ti.UI.createRefreshControl({
    	tintColor:"#00CB85"
	});
	$.scrollView.refreshControl = control;
	control.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    setTimeout(function(e){
	        Ti.API.debug('Timeout');
	        $.scrollView.scrollTo(0,0,true);	
			setTimeout(function(){
				init();
			},500);	        
	        control.endRefreshing();
	    }, 1000);
	});	
}
$.img_view.setHeight(cell_width);

function init(){
	Alloy.Globals.loading.stopLoading();
	//$.scrollView.scrollTo(0,0,[animation=false]);	
	$.mother_view.opacity = 0;	
	$.myInstance.show('',false);	
	$.group_img.setImage(arr[0].image);
	$.group_name.setText(arr[0].name);
	g_name = arr[0].name;
	$.mother_view.removeAllChildren();	
	addPostView();	
}
init();	

function render_post(params){
	params.forEach(function(entry){
		var imgArr = i_model.getImageByCateandPriId(true,undefined,2,entry.id);
		var container = $.UI.create("View",{classes:['view_class','vert','padding'],left:"0",right:"0",backgroundColor:"#fff",post_index:post_index});
		var title_container = $.UI.create('View',{classes:['wfill','horz'],height:68});
		var user_img = $.UI.create("ImageView",{classes:['padding'],width:45,height:45,image:entry.u_img,u_id:entry.u_id,defaultImage:"/images/asp_square_logo.png"});
		var title_child_container = $.UI.create("View",{classes:['wfill','hfill','padding'],left:0});
		var username = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],text:entry.u_name,left:"0",top:"0",u_id:entry.u_id});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:"0",bottom:0,color:"#7CC6FF",text:countdown.getTimePost(entry.created),p_id:entry.id});
		var more_container = $.UI.create("View",{classes:['hfill'],width:"30",right:"0",u_id:entry.u_id,p_id:entry.id,post_index:post_index});
		var more = $.UI.create("ImageView",{right:"0",top:"0",image:'/images/btn-down.png',touchEnabled:false});
		var description = $.UI.create("Label",{classes:['wfill','hsize','padding'],top:"0",text:entry.description,p_id:entry.id});
		var hr = $.UI.create("View",{classes:['hr']});
		var comment_container = (OS_ANDROID)?$.UI.create("View",{classes:['wfill','hsize','padding'],p_id:entry.id}):$.UI.create("View",{classes:['wfill','hsize'],left:"10",right:"10",p_id:entry.id});
		var comment_count = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:entry.comment_count+" comments",left:"0",p_id:entry.id});
		var comment_button_container = $.UI.create("View",{classes:['wsize','hsize','horz'],right:0,p_id:entry.id});
		var comment_img = $.UI.create("ImageView",{image:"/images/comment.png",touchEnabled:false});
		var comment_button = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:"Comment",touchEnabled:false});
		var img_container = $.UI.create("View",{classes:['wfill','hsize','padding']});
		container.add(title_container);
		container.add(description);
		container.add(img_container);
		if(imgArr.length != 0){
			var imglength = imgArr.length;
			var image_container = $.UI.create("ScrollableView",{classes:['wfill'],height:250,top:"0",scrollingEnabled:true});
			var imgcount_container = (imglength > 1) ? $.UI.create("View",{classes:['wsize','hsize','horz'],backgroundColor:"#99000000",imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"}) : $.UI.create("View",{classes:['wsize','hsize'],imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"});
			var imgcount = (imglength > 1) ? $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,right:5,color:"#fff",text:"1/"+imglength,imglength:imglength}) : $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,right:5,imglength:imglength});
			var img_icon = (imglength > 1) ? $.UI.create("ImageView", {image: "/images/img_icon.png", width:20, height: 17, right: 10}) :  $.UI.create("ImageView", {width:0, height:0});
			imgcount_container.add(imgcount);
			imgcount_container.add(img_icon);
			imgArr.forEach(function(entry1){
				var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
				//var image = $.UI.create("ImageView",{classes:['wfill','hsize'], defaultImage: "/images/loading.png",image:entry1.img_300thumb,imageBig:entry1.img_path});		
				var image = $.UI.create("ImageView",{classes:['wfill','hsize'],image:entry1.img_300thumb,imageBig:entry1.img_path, defaultImage: "/images/loading.png"});
				small_image_container.add(image);
				image_container.addView(small_image_container);		
				image.addEventListener("click",function(e){	
					//try {
						addPage("zoomView","Image Preview",{img_path:e.source.imageBig});
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
				small_image_container = undefined;
				image = undefined;                
            });
			img_container.add(image_container);
			img_container.add(imgcount_container);
			imglength=undefined;
			image_container=undefined;
			imgcount_container=undefined;
			imgcount=undefined;			
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
		$.mother_view.add(container);
		description.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id});
		});
		more_container.addEventListener("click",function(e){
 			postOptions({u_id:e.source.u_id,p_id:e.source.p_id,post_index:e.source.post_index});
		});
		user_img.addEventListener("click",function(e){
			addPage("my_profile","My Profile",{u_id:e.source.u_id});
		});
		username.addEventListener("click",function(e){
			addPage("my_profile","My Profile",{u_id:e.source.u_id});
		});
		time.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id});
		});
		comment_container.addEventListener("click",function(e){
		//	Alloy.Globals.loading.startLoading("Loading...");
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
	offset += 10;
	$.mother_view.opacity = 1;		
	$.myInstance.hide();
}

function scrollChecker(e){
	var theEnd = $.scrollView.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd - 200;
	if (total >= nearEnd){
		get_data_local();
	}
	theEnd = undefined;
	total = undefined;
	nearEnd = undefined;
}

function postOptions(params){
	var u_id = Ti.App.Properties.getString("u_id")||"";
	var options = (u_id == params.u_id)?['Edit','Delete','Cancel']:['Favourite','Report','Cancel'];
	var checking = (u_id == params.u_id)?true:false;
	var opts = {cancel: 2,options:options,destructive: 0,title: 'More options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(checking&&e.index == 0){
			addPage("post","Edit Post",{p_id: params.p_id,edit:true});		
		}
		if(checking&&e.index == 1){
			deletePost(params.p_id,params.post_index);
		}
	});	
	dialog.show();
}

function deletePost(p_id,p_index){
	COMMON.createAlert("Warning","Are you sure want to delete this post?",function(e){
		Alloy.Globals.loading.startLoading("Posting");
		API.callByPost({url:"deletePost",params:{id:p_id,status:2}},{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				if(res.status != "success"){
					Alloy.Globals.loading.stopLoading();							
					alert("Something wrong right now please try again later.");
				}else{
					init();			
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
				res = undefined;
			}
		});
	});
}

function group_info(){
	setTimeout(function(){
		$.grandmother.add(Alloy.createController("groupInfo",{motherView:$.args.motherView,childView:$.args.childView,mother:$.grandmother,g_id:g_id,arr:arr[0],GroupImg:$.group_img,outsideImg:$.args.outsideimg}).getView());			
	},300);
}
function addMember(){			
	addPage("groupMemberView","Group Member",{g_id:g_id});	
}
function addPostView(){
	console.log("add Post");
	var container = $.UI.create("View",{classes:['horz','wfill','toucha3a3a3','hsize','padding'],top:10,left:"0",right:"0",backgroundColor:"#fff"});
	var	image = $.UI.create("ImageView",{classes:['padding'],width:"45",height:"45",image:"/images/asp_square_logo.png",touchEnabled:false});
	var title = $.UI.create("Label",{classes:['hsize','h4'], width:"auto",text:"Posting something in group...",touchEnabled:false});
	container.add(image);
	container.add(title);
	$.mother_view.add(container);
	container.addEventListener("click",function(){
		addPage("post", g_name+" Post",{post_group:true,g_id:g_id,g_name:g_name,refreshName:"group_post_init"});
	});
	get_Data();
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
exports.removeEventListeners = function() {
	Ti.App.removeEventListener("group_post_init",init);
};
Ti.App.addEventListener("group_post_init",init);

function get_Data(){
	var checker = Alloy.createCollection('updateChecker');
	var isUpdate = checker.getCheckerById("2");
	API.callByPost({url:"getPostList",params:{g_id: args.g_id, last_updated: isUpdate.updated}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("post");
			model.saveArray(arr);
			if(res.images != undefined){
				i_model.saveArray(res.images);	
			}
			model = null;
			arr = null;
			res =null;
			Alloy.Globals.loading.stopLoading();
			offset = 0;
			setTimeout(function(){
				get_data_local();
			},1000);
		}
	});	
}

function get_data_local(){
	var model_p = Alloy.createCollection("post");
	var res = model_p.getData(false,offset,args.g_id);	
	model_p = null;
	render_post(res);
}

if(OS_ANDROID){
	$.swipeRefresh.addEventListener('refreshing',function(e){
		init();
		e.source.setRefreshing(false);		
	});	
}

