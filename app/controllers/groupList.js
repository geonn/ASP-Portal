var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
var u_id = Ti.App.Properties.getString("u_id")||"";

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2));
}else{
	cell_width = Math.floor(pwidth / 2);
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
				init();
			},500);	        
	        control.endRefreshing();
	    }, 1000);
	});	
}

function init() {
	Alloy.Globals.loading.stopLoading();
	$.group_list.opacity = 0;		
	$.myInstance.show('',false);	
	$.group_list.removeAllChildren();	
	get_Data();			
}
function get_Data(){
	API.callByPost({url:"getMyGroupList",params:{u_id:u_id}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("my_group");
			var arrr = res.group;
			var modell = Alloy.createCollection("groups");
			model.saveArray(arr);
			modell.saveArray(arrr);			
			model = null;
			arr = null;
			res =null;				
			var model = Alloy.createCollection("my_group");
			var arr = model.getDataById(u_id);
			render_list(arr);			
		}
	});	
}
function render_list(e) {
	e.forEach(function(data) {
		var view_group = $.UI.create("View", {
			classes: ['vert',"hsize"],
			width: cell_width-10,
			left: '5',
			right: '5',
			g_id:data.g_id,
			g_name:data.g_name
		});
		var view_img = $.UI.create("View",{
			height: cell_width - 30,
			width: cell_width - 30,
			top: '15',
			left: '15',
			right: '15',
			borderRadius: (cell_width - 30) / 2,
			borderWidth: '5',
			borderColor: '#eff3f6',
			backgroundColor: "#eff3f6",
			g_id: data.g_id,
			g_name:data.g_name,
			touchEnabled:false
		});
		var img = $.UI.create("ImageView",{
			classes: ["wfill", "hsize"],
			defaultImage: "/images/group_picture_circle.png",
			image: data.g_image,
			g_id: data.g_id,
			g_name:data.g_name,
			touchEnabled:false
		});
		var group_title = (OS_ANDROID) ? $.UI.create("Label",{
			classes: ["wsize","h4"],
			text: data.g_name,
			top: '5',
			height: '24',
			bottom: '5',
			textAlign: 'center',
			ellipsize: true,
			wordWrap: false,
			touchEnabled:false
		}) : $.UI.create("Label",{
			classes: ["wsize","h4"],
			height: '22',
			text: data.g_name,
			top: '5',
			textAlign: 'center',
			touchEnabled:false
		});
		
		view_img.add(img);
		view_group.add(view_img);
		view_group.add(group_title);
		view_group.addEventListener("click", function(e){
			addPage("group_post", e.source.g_name, {motherView:$.group_list,childView:e.source,g_id: e.source.g_id,outsideimg:e.source.children[0].children[0]});
		});
		$.group_list.add(view_group);
	});
	$.group_list.opacity = 1;		
	$.myInstance.hide();	
}
Ti.App.addEventListener("groupList:init",init);
if(OS_ANDROID){
$.swipeRefresh.addEventListener('refreshing',function(e){
	init();
	e.source.setRefreshing(false);		
});	
}
function pixelToDp(px) {
	return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

init();