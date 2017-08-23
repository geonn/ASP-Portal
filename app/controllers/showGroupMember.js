var offcount = 0;
var member = [];
var name = "";
var chk = true;
var u_id = Ti.App.Properties.getString("u_id") || "";
var args = arguments[0] || {};//args.g_id
var g_id = args.g_id;
var checker = "/images/checkbox_checked.png";

function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
function init(){
	var offcount = 0;	
	Alloy.Globals.loading.stopLoading();	
	$.myInstance.show('',false);
	$.scrollview.scrollingEnabled = false;
	group_info();
}init();
function group_info(){
	var model = Alloy.createCollection("my_group");
	API.callByPost({url:"getGroupListMemberByGid",params:{g_id:g_id}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var data = res.data || {};
			model.saveArray(data);
			render(model.getMemberByG_id(g_id));
		}
	});
}
function render(arr){
	$.mother_view.removeAllChildren();
	console.log("group member:"+JSON.stringify(arr));
	for(var i=0;i<arr.length||show_MotherView();i++){
		var container = $.UI.create("View",{classes:['wfill','hsize','padding','toucha3a3a3'],top:0,u_id:arr[i].u_id});
		var small_container = $.UI.create("View",{classes:['hsize','horz'],width:"84%",left:"0",touchEnabled:false});
		var image = $.UI.create("ImageView",{classes:['padding'],left:5,width:45,height:45,image:arr[i].u_image,defaultImage:"/images/default_profile.png",touchEnabled:false});
		var title = $.UI.create("Label",{classes:['wfill','hsize'],text:arr[i].u_name,touchEnabled:false});
		var checkBox = $.UI.create("ImageView",{width:20,height:20,right:10,image:checker,touchEnabled:false});
		
		if(OS_ANDROID){
			title.ellipsize=true;
			title.wordWrap=false;
		}
		small_container.add(image);
		small_container.add(title);
		container.add(small_container);	
		container.add(checkBox);			
		container.addEventListener("click",function(e){
			addPage("my_profile","My Profile",{u_id:e.source.u_id});			
		});
		$.mother_view.add(container);		
	}	
}
function show_MotherView(){
	offcount+=20;
	$.mother_view.opacity = 1;		
	$.myInstance.hide();
	$.scrollview.scrollingEnabled = true;	
	return false;	
}
function scrollChecker(e){console.log(offcount);
	if(offcount != 0) {
		var theEnd = $.mother_view.rect.height;
		var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
		var nearEnd = theEnd - 200;
		if (total >= nearEnd){
			// var model = Alloy.createCollection("my_group");
			// render(model.getMemberByG_id(g_id));	
		}
	}
}
$.staffName.listener('change', function(e){
	if(e.source.value != "") {
		$.mother_view.removeAllChildren();
		offcount = 0;	
		var model = Alloy.createCollection("my_group");
		var arr = model.searchStaff(e.source.value,g_id, false);
		render(arr);
	}
	else{
		//$.scrollview.scrollTo(0,0,[animation=false]);						
		$.mother_view.removeAllChildren();
		init();
	}
});
exports.removeEventListeners = function() {
	console.log("onremove");
	Ti.App.removeEventListener("showGroupMember:init",init);
};
Ti.App.addEventListener("showGroupMember:init",init);
