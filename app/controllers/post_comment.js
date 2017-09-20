var args = arguments[0] || {};
var p_id = args.p_id || null;
var u_id = Ti.App.Properties.getString('u_id')||undefined;
var countdown = require("countdown_between_2date.js");
console.log("object comment"+JSON.stringify($.args.comment_count));
function add_image(){}
function init() {
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
		var container = $.UI.create("View",{classes:['wfill','toucha3a3a3','hsize','horz'],u_id:entry.u_id,c_id:entry.id,bottom:10});
		var profileImg = $.UI.create("ImageView",{classes:['padding','touchRealEmpty'],u_id:entry.u_id,width:55,height:55,image:(entry.img_path != "")?entry.img_path:"/images/default_profile.png",defaultImage:"/images/asp_square_logo.png"});
		var small_container = $.UI.create("View",{classes:['wfill','hsize','vert'],touchEnabled:false,top:5});
		var name = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],left:0,top:0,text:entry.name});
		var comment = $.UI.create("Label",{classes:['wsize','hsize','h4'],left:0,right:10,touchEnabled:false,text:entry.comment});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:0,touchEnabled:false,color:"#7CC6FF",text:countdown.getTimePost(entry.created)});	
		small_container.add(name);
		small_container.add(comment);
		small_container.add(time);
		container.add(profileImg);
		container.add(small_container);
		$.list_comment.add(container);		
		container.addEventListener("longpress",function(e){
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
		$.scrollView.scrollToBottom();	
	},500);
	Alloy.Globals.loading.stopLoading();	
}
function doSubmit(){
	Alloy.Globals.loading.startLoading("Loading...");		
	var u_id = Ti.App.Properties.getString('u_id')||null;
	var comment = $.comment.value || null;
	$.comment.setValue("");	
    if(OS_ANDROID){
         Ti.UI.Android.hideSoftKeyboard();
    }		
	if(u_id == undefined){
		Alloy.Globals.loading.stopLoading();			
		alert("User Id is null\nPlease Login Again");
		doLogout();			
		return;
	}
	if(comment == null){
		Alloy.Globals.loading.stopLoading();			
		alert("Please type something on field box.");
		return;	
	}		
	var params = {u_id:u_id,p_id:p_id,comment:comment};
	API.callByPost({url:"doPostComment",params:params},{
		onload:function(responseText){			
			var res = JSON.parse(responseText);
			console.log("comment:"+JSON.stringify(res));
			try{
			$.args.comment_count.text = res.data[0].total_comment+" comments";
			$.args.comment_count1.text = res.data[0].total_comment+" comments";
			}catch(e){}
			init();
			$.comment.setValue("");
		},onerror:function(err){}
	});
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
init();