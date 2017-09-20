var args = arguments[0] || {};
var offset = 0;
var buttonsExpanded = false;
var post_index = 1;
var refreshName = args.refreshName||null;
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");
if (OS_IOS) {
	var control = Ti.UI.createRefreshControl({
    	tintColor:"#00CB85"
	});
	$.scrollview.refreshControl = control;
	control.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    setTimeout(function(e){
	        Ti.API.debug('Timeout');
	        $.scrollview.scrollTo(0,0,true);
			setTimeout(function(){
				refresh({});
			},500);	        
	        control.endRefreshing();
	    }, 1000);
	});	
};
function init(){
	offset = 0;
	addPostView();
}init();
function getData(){
	var model = Alloy.createCollection("post");
	var res = model.getData(false,offset);
	model = null;
	render_post(res);
}
function scrollChecker(e){
	var theEnd = $.mother_view.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd * 1.0;
	if(total >= nearEnd){
		getData();
	}	
}
function render_post(params){	
	params.forEach(function(entry){
		var imgArr = i_model.getImageByCateandPriId(true,undefined,2,entry.id);
		var videoArr = i_model.getVideoByCateandPriId(true,undefined,2,entry.id);		
		var container = $.UI.create("View",{classes:['view_class','vert','padding'],left:"0",right:"0",backgroundColor:"#fff",post_index:post_index});
		var title_container = $.UI.create('View',{classes:['wfill','horz'],height:80});
		var user_img = $.UI.create("ImageView",{classes:['padding'],width:55,height:55,image:(entry.u_img!="")?entry.u_img:"/images/my_profile_square.png",u_id:entry.u_id,defaultImage:"/images/asp_square_logo.png"});
		var title_child_container = $.UI.create("View",{classes:['wfill','hfill','padding'],left:0});
		var username = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],text:entry.u_name,left:"0",top:"0",u_id:entry.u_id});
		//var time_group = $.UI.create("View",{classes:['wsize','hsize','horz'],left:"0",bottom:"0"});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:'0',bottom:'0',color:"#7CC6FF",text:countdown.getTimePost(entry.created),p_id:entry.id});
		if (entry.id != 0) {
			var group_title = (entry.g_id > 0)?"Post in "+entry.title+" group":entry.title;
			var group = $.UI.create("Label",{classes:['h6'],width:'180',height:'20',color:"#23c281",left:'0',top:'22',text: group_title, g_id:entry.g_id});
			if(OS_ANDROID){
				group.ellipsize=true;
				group.wordWrap=false;
			}
		};
		var more_container = $.UI.create("View",{classes:['hfill'],width:"30",right:"0",u_id:entry.u_id,p_id:entry.id,post_index:post_index});
		var more = $.UI.create("ImageView",{right:"0",top:"0",image:'/images/btn-down.png',touchEnabled:false});
		var description = $.UI.create("Label",{classes:['wfill','hsize','padding'],maxLines:'4',top:"0",bottom:'0',text:entry.description,p_id:entry.id});
		// if(OS_ANDROID){
			// description.ellipsize=true;
			// description.wordWrap=false;
		// }
		var ctn_read = $.UI.create("Label",{classes:['wfill','hsize'],top:'0',left:'10',color:'#90949C',text:'Continue reading...',p_id:entry.id});
		var hr = $.UI.create("View",{classes:['hr']});
		var comment_container = (OS_IOS)?$.UI.create("View",{classes:['wfill','hsize'],left:"10",right:"10",p_id:entry.id}):$.UI.create("View",{classes:['wfill','hsize','padding'],p_id:entry.id});
		var comment_count = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:entry.comment_count+" comments",left:"0",p_id:entry.id,touchEnabled:false});
		var comment_button_container = $.UI.create("View",{classes:['wsize','hsize','horz'],right:0,p_id:entry.id,touchEnabled:false});
		var comment_img = $.UI.create("ImageView",{image:"/images/comment.png",touchEnabled:false});
		var comment_button = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:"Comment",touchEnabled:false});
		var img_container = $.UI.create("View",{classes:['wfill','hsize','padding'],top:10,backgroundColor:"#000"});
		var video_container = $.UI.create("View",{classes:['wfill','hsize','padding'],top:10,backgroundColor:"#000"});	
		container.add(title_container);
		container.add(description);
		container.add(ctn_read);
		container.add(video_container);		
		container.add(img_container);
		if(videoArr.length != 0){
			video_container.height = 250;
			var videoContainer = $.UI.create("ImageView",{classes:['wfill','hsize'],image:videoArr[0].img_thumb});
			var playImage = $.UI.create("ImageView",{width:220,height:130,image:"/images/play-button.png",videoUrl:videoArr[0].img_path,zIndex:10});
			video_container.add(videoContainer);
			video_container.add(playImage);
			playImage.addEventListener("click",function(e1){
				console.log("Video path:"+e1.source.videoUrl);
				addPage("zoomView","Video Preview",{img_path:e1.source.videoUrl,isVideo:true});
			});
		}
		if(imgArr.length != 0){
			var imglength = imgArr.length;
			var image_container = $.UI.create("ScrollableView",{classes:['wfill'],height:250,top:"0",scrollingEnabled:true});
			var imgcount_container = (imglength > 1) ? $.UI.create("View",{classes:['wsize','hsize','horz'],backgroundColor:"#99000000",imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"}) : $.UI.create("View",{classes:['wsize','hsize'],imglength:imglength,zIndex:10,right:10,top:10,borderRadius:"5"});
			var imgcount = (imglength > 1) ? $.UI.create("Label",{classes:['wsize','hsize'],left:5,right:5,color:"#fff",text:"1/"+imglength,imglength:imglength}) : $.UI.create("Label",{classes:['wsize','hsize',"padding"],top:5,bottom:5,right:5,imglength:imglength});
			//var img_icon = (imglength > 1) ? $.UI.create("ImageView", {image: "/images/img_icon.png", width:20, height:17, right:10}) :  $.UI.create("ImageView", {width:0, height:0});
			//(OS_ANDROID)?img_icon.right =0:img_icon.right=10;
			imgcount_container.add(imgcount);
			//imgcount_container.add(img_icon);
			imgArr.forEach(function(entry1){
				var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
				var image = $.UI.create("ImageView",{classes:['wfill','hsize'], defaultImage: "/images/loading.png",image:entry1.img_300thumb,imageBig:entry1.img_path});
				small_image_container.add(image);
				image_container.addView(small_image_container);		
				image.addEventListener("click",function(e){
					//try {
						addPage("zoomView","Image Preview",{img_path:e.source.imageBig});
					//}catch(e) {
						//alert("Image is not yet save to local!!!\nPlease Try Again !!");
					//}
				});
                image_container.addEventListener("scrollend",function(e){
                    if(e.currentPage != undefined && e.source.parent.children[1].children[0].imglength > 1) {
                        var count = (e.currentPage + 1) + "/" + e.source.parent.children[1].children[0].imglength;
                        e.source.parent.children[1].children[0].text = count;
                        count = undefined;
                    }
                });
				small_image_container = undefined;
				image = undefined;
			});
			img_container.add(image_container);
			img_container.add(imgcount_container);
			img_container=undefined;
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
		//time_group.add(time);
		title_child_container.add(group);
		if(entry.g_id != 0){
			group.addEventListener("click",function(e){
 				addPage("group_post", "Group Posts", {g_id: e.source.g_id});
			});
		};
		title_child_container.add(username);
		title_child_container.add(time);
		more_container.add(more);
		title_child_container.add(more_container); 
		title_container.add(title_child_container);
		$.mother_view.add(container);
		description.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id,comment_count:e.source.parent.children[4].children[0]});
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
		ctn_read.addEventListener("click",function(e){
			addPage("post_detail","Post Detail",{p_id:e.source.p_id});
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
		ctn_read=undefined;
		post_index++;	
	});
	params = undefined;
	show_MotherView();	
}
function refresh(e){
	$.mother_view.opacity = 0;	
	$.myInstance.show('',false);			
	var firename = e.refreshName || null;
	$.mother_view.removeAllChildren();	
	get_Data(firename);
}
function get_Data(firename){
	var checker = Alloy.createCollection('updateChecker'); 
	var u_id = Ti.App.Properties.getString("u_id")||undefined;	
	var isUpdate = checker.getCheckerById("2",u_id);
	API.callByPost({url:"getPostList",params:{last_updated: isUpdate, u_id: u_id}},{
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
			if(firename != null){
				Ti.App.fireEvent(firename);
			}
			init();		
			checker.updateModule(2,"post",currentDateTime(),u_id);		
//			Alloy.Globals.loading.stopLoading();			
		}
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
		//$.scrollview.scrollTo(0,0,[animation=false]);
		Alloy.Globals.loading.startLoading("Posting");		
		API.callByPost({url:"deletePost",params:{id:p_id,status:2}},{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				if(res.status != "success"){
					Alloy.Globals.loading.stopLoading();							
					alert("Something wrong right now please try again later.");
				}else{
					refresh({});			
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
			}
		});
	});
}
function show_MotherView(){
	offset+=10;
	$.mother_view.opacity = 1;		
	$.myInstance.hide();
	$.scrollview.scrollingEnabled = true;	
	return false;	
}
function addPostView(){
	console.log("add Post");
	var container = $.UI.create("View",{classes:['horz','wfill','toucha3a3a3','hsize','padding'],top:1,left:"0",right:"0",backgroundColor:"#fff"});
	var	image = $.UI.create("ImageView",{classes:['padding'],width:"45",height:"45",image:"/images/asp_square_logo.png",touchEnabled:false});
	var title = $.UI.create("Label",{classes:['hsize','h4'], width:"auto",text:"Posting something...",touchEnabled:false});
	container.add(image);
	container.add(title);
	$.mother_view.add(container);
	container.addEventListener("click",function(){
		addPage("post", "Post");
	});
	$.scrollview.scrollingEnabled = false;
	getData();	
}
function clickButtons(){
	var size;
	if(buttonsExpanded){
		size = 60;
		$.bounceView.height = 0;
	}else{
		size = 175;
		$.bounceView.height = Ti.UI.FILL;
	}
	buttonsExpanded = !buttonsExpanded;
	$.buttonsView.resize(size,size);
}
exports.removeEventListeners = function() {
	Ti.App.removeEventListener("discussion:refresh",refresh);
};
if(OS_ANDROID){
	$.swipeRefresh.addEventListener('refreshing',function(e){
		refresh({});
		e.source.setRefreshing(false);		
	});	
}

Ti.App.addEventListener("discussion:refresh",refresh);
function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
