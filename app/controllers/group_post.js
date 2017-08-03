var args = arguments[0] || {};//args.g_id
var model = Alloy.createCollection("groups");
var arr = model.getData(args.g_id);
var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var i_model = Alloy.createCollection("images_table");
var countdown = require("countdown_between_2date.js");
var offset=0;
var post_index = 1;

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
}
$.img_view.setHeight(cell_width);

function init(){
	Alloy.Globals.loading.startLoading("Loading...");
	$.group_img.setImage(arr[0].image);
	$.group_name.setText(arr[0].name);
	
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
			var model_p = Alloy.createCollection("post");
			var res = model_p.getData(false,offset,args.g_id);	
			model_p = null;
			render_post(res);console.log(JSON.stringify(res));
		}
	});
}
init();	

function render_post(params){
	params.forEach(function(entry){
		var imgArr = i_model.getImageByCateandPriId(true,undefined,2,entry.id);
		var container = $.UI.create("View",{classes:['view_class','vert','padding'],left:"0",right:"0",backgroundColor:"#fff",post_index:post_index});
		var title_container = $.UI.create('View',{classes:['wfill','horz'],height:68});
		var user_img = $.UI.create("ImageView",{classes:['padding'],width:45,height:45,image:entry.u_img,u_id:entry.u_id});
		var title_child_container = $.UI.create("View",{classes:['wfill','hfill','padding'],left:0});
		var username = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],text:entry.u_name,left:"0",top:"0",u_id:entry.u_id});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:"0",bottom:0,color:"#7CC6FF",text:countdown.getTimePost(entry.created),p_id:entry.id});
		var more_container = $.UI.create("View",{classes:['hfill'],width:"30",right:"0",u_id:entry.u_id,p_id:entry.id,post_index:post_index});
		var more = $.UI.create("ImageView",{right:"0",top:"0",image:'/images/btn-down.png',touchEnabled:false});
		var description = $.UI.create("Label",{classes:['wfill','hsize','padding'],top:"0",text:entry.description,p_id:entry.id});
		var hr = $.UI.create("View",{classes:['hr']});
		var comment_container = $.UI.create("View",{classes:['wfill','hsize','padding']});
		var comment_count = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:entry.comment_count+" comments",left:"0",p_id:entry.id});
		var comment_button_container = $.UI.create("View",{classes:['wsize','hsize','horz'],right:0,p_id:entry.id});
		var comment_img = $.UI.create("ImageView",{image:"/images/comment.png",touchEnabled:false});
		var comment_button = $.UI.create("Label",{classes:['wsize','hsize','h6'],color:"#90949C",text:"Comment",touchEnabled:false});
		var img_container = $.UI.create("View",{classes:['wfill','hsize','padding'],backgroundColor:"#000"});
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
				var image = $.UI.create("ImageView",{classes:['wfill','hsize'], defaultImage: "/images/loading.png",image:entry1.img_path});		
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
                if(e.currentPage != undefined && e.source.parent.children[1].children[0].imglength > 1) {
                    var count = (e.currentPage + 1) + "/" + e.source.parent.children[1].children[0].imglength;
                    e.source.parent.children[1].children[0].text = count;
                    count = undefined;
                }
            });
			img_container.add(image_container);
			img_container.add(imgcount_container);
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
		comment_count.addEventListener("click",function(e){
			Alloy.Globals.loading.startLoading("Loading...");			
			addPage("post_comment","Post Comment",{p_id:e.source.p_id});
		});	
		comment_button_container.addEventListener("click",function(e){
			Alloy.Globals.loading.startLoading("Loading...");			
			addPage("post_comment","Post Comment",{p_id:e.source.p_id});
		});	
		post_index++;	
	});
	Alloy.Globals.loading.stopLoading();
}

function scrollChecker(e){
	var theEnd = $.mother_view.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd - 200;
	if (total >= nearEnd){
		render();
	}
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
					refresh({});			
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
			}
		});
	});
}

function group_info(){
	console.log("Group info");
	var father = $.UI.create("View",{classes:['wfill','hfill'],backgroundColor:'#66999999',zIndex:'4'});
	var info_view = $.UI.create("View",{height:cell_width*2,width:cell_width*1.8,backgroundColor:'#fff',zIndex:'5'});
	var title = $.UI.create("Label",{classes:['h4'],textAlign:'center',color:"#fff",height:'50',width:cell_width*1.8,backgroundColor:'#00CB85',top:'0',text:'Group Info'});
	var scrollView = $.UI.create("ScrollView",{classes:['wfill','vert','contwfill','conthsize'],height:cell_width*2-100,top:'50'});
	var g_name = (OS_IOS)?$.UI.create("Label",{classes:['wfill','h4'],height:'22',text:"Group name: "+arr[0].name,textAlign:'left',top:'5',left:'10',right:'10'}):$.UI.create("Label",{classes:['wfill','h3','bold'],height:'22',text:arr[0].name,textAlign:'left',top:'5',left:'10',right:'10',ellipsize:true,
			wordWrap: false});
	var member = $.UI.create("Label",{classes:['wfill','h4'],height:'22',text:"Member:",textAlign:'left',top:'10',left:'10'});
	var ok_button = $.UI.create("Label",{classes:['h3'],textAlign:'center',height:'50',width:cell_width*1.8,backgroundColor:'#fff',bottom:'0',text:'ok'});
	var hr = $.UI.create("View",{classes: ['hr'],backgroundColor: '#EDF3F6',bottom:'50'});
	
	info_view.add(title);
	scrollView.add(g_name);
	scrollView.add(member);
	for (var i=0;i<20;i++) {
		scrollView.add(member);
	};
	info_view.add(scrollView);
	info_view.add(hr);
	info_view.add(ok_button);
	father.add(info_view);
	ok_button.addEventListener("click",function(e){
		$.grandmother.remove(father);
	});
	$.grandmother.add(father);
}
