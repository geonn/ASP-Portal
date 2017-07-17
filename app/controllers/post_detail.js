var args = arguments[0] || {};
var p_id = args.p_id || "";
var u_id1;
function init(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	setData(res);
}init();
function setData(params){
	$.user_name.text = params.u_name;
	u_id1 = params.u_id;
	$.desc.text = params.description;
	$.count_coment.text = params.comment_count+" comment";
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
Ti.App.addEventListener("post_detail:init",init);
