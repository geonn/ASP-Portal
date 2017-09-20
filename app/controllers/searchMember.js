var offcount = 0;
var member = [];
var name = "";
var chk = true;
var args = arguments[0] || {};//args.g_id
var model = Alloy.createCollection("staff");
var arr = model.getDataForRenderStaffList(false,offcount);		

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
	setTimeout(function(){
		render(arr);		
	},1000);
}init();
function render(arr){
	if(offcount == 0) {
		$.mother_view.removeAllChildren();
	}
	for(var i=0;i<arr.length||show_MotherView();i++){
		var container = $.UI.create("View",{classes:['wfill','hsize','padding','toucha3a3a3'],top:0,staff:arr[i],check:false,id:arr[i].id,name:arr[i].name});
		var small_container = $.UI.create("View",{height:'65',width:"84%",left:"0",touchEnabled:false});
		var userImg = (arr[i].img_path != "")?arr[i].img_path:"/images/default_profile.png";
		var image = $.UI.create("ImageView",{classes:['padding'],left:5,width:45,height:45,image:userImg,touchEnabled:false});
		var title = $.UI.create("Label",{classes:['wfill','hsize'],left:'60',text:arr[i].name,touchEnabled:false});
		if(OS_ANDROID){
			title.ellipsize=true;
			title.wordWrap=false;
		}
		small_container.add(image);
		small_container.add(title);
		container.add(small_container);
		$.mother_view.add(container);
		container.addEventListener("click",function(e){	
			addPage("my_profile","My Profile",{u_id:e.source.staff.id});	
		});			
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
	var theEnd = $.mother_view.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd - 200;
	if (total >= nearEnd){
		var arr = model.getDataForRenderStaffList(false,offcount);			
		render(arr);	
	}
}

$.staffName.listener('change', function(e){
	if(e.source.value != "") {
		$.mother_view.removeAllChildren();
		offcount = 0;	
		var arr = model.searchStaff(e.source.value,false,offcount);
		render(arr);
	}
	else{
		//$.scrollview.scrollTo(0,0,[animation=false]);						
		$.mother_view.removeAllChildren();
		init();
	}
});