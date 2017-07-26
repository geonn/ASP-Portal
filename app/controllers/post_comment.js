var args = arguments[0] || {};
var p_id = args.p_id || null;
console.log("pid"+p_id);
function add_image(e) {
	
}

function init() {
	if(p_id == null){
		Alloy.Globals.pageFlow.back();	
		Alloy.Globals.loading.stopLoading();			
		return;	
	}
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("4");		
	var params = {p_id:p_id,last_updated:isUpdate.updated};
	API.callByPost({url:"getPostCommentList",params:params},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("post_comment");
			model.saveArray(arr);
			var data = model.getDataByP_id(p_id);
			render_comment(data);
		    checker.updateModule("4","post_comment",currentDateTime());			
		},
		onerror:function(err){
			
		}
	});	
}
function render_comment(params){
	console.log("comment:"+JSON.stringify(params));
	params.forEach(function(entry){
		var container = $.UI.create("View",{classes:['wfill','hsize','horz'],bottom:10,borderRadius:"5",backgroundColor:"#fff"});
		var profileImg = $.UI.create("ImageView",{classes:['padding'],width:55,height:55,backgroundColor:"#000"});
		var small_container = $.UI.create("View",{classes:['wfill','hsize','vert'],top:5});
		var name = $.UI.create("Label",{classes:['wsize','hsize','h4','bold'],left:0,top:0,text:entry.name});
		var comment = $.UI.create("Label",{classes:['wsize','hsize','h4'],left:0,text:entry.comment});
		var time = $.UI.create("Label",{classes:['wsize','hsize','h5','grey'],left:0,text:"10 mins"});	
		small_container.add(name);
		small_container.add(comment);
		small_container.add(time);
		container.add(profileImg);
		container.add(small_container);
		$.list_comment.add(container);		
	});
	Alloy.Globals.loading.stopLoading();	
}
function doSubmit(){
	var u_id = Ti.App.Properties.getString('u_id')||null;
	var comment = $.comment.value || null;
	if(u_id == null){
		alert("User Id is null\nPlease Login Again");
		doLogout();
		return;
	}
	if(comment == null){
		alert("Please type something on field box.");
		return;	
	}		
	var params = {u_id:u_id,p_id:p_id,comment:comment};
	API.callByPost({url:"doPostComment",params:params},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			console.log("comment:"+JSON.stringify(res));
		},onerror:function(err){}
	});
}
init();