var args = arguments[0] || {};
var data;
var offcount = 0;
var u_id = Ti.App.Properties.getString("u_id");
var countdown = require("countdown_between_2date.js");
var pwidth = Titanium.Platform.displayCaps.platformWidth;
if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2)) - 2;
}else{
	cell_width = Math.floor(pwidth / 2) - 2;
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

function init(){
	offcount = 0;
	$.motherView.removeAllChildren();		
	$.motherView.opacity = 0;	
	if (OS_IOS) {
		$.motherView.setBottom(50);
	};
	$.myInstance.show('',false);	
	getDataFromServer();
}
init();
function getDataFromServer(){
	API.callByPost({url:"getNotificationList", new: true, params:{u_id:u_id}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("notification");
			model.saveArray(arr);
			model = undefined;
			res = undefined;
			arr = undefined;
			getDataFromLocal();
		}
	});	
}
function getDataFromLocal(){
	var model = Alloy.createCollection("notification");
	data = model.getDataByU_id(u_id,false,offcount);
	console.log(JSON.stringify(data));
	render();
	model = undefined;
}
function render(){
	for (var i=0; i < data.length||showMotherView(); i++) {
		var container = $.UI.create("View",{classes:['wfill','hsize','horz','toucha3a3a3'], record: data[i], backgroundColor:"#fff"});
		var image = $.UI.create("ImageView",{width:50,height:50,classes:['padding'],image:data[i].u_image,defaultImage:"/images/asp_square_logo.png"});
		var detailContainer = $.UI.create("View",{classes:['wfill','hsize','padding','vert'], touchEnabled: false, left:0});
		var description = $.UI.create('Label',{width:cell_width*2-90,height:30,left:10, touchEnabled: false, text: data[i].title});
		if(OS_ANDROID){
				description.ellipsize=true;
				description.wordWrap=false;
			}
		var time = $.UI.create('Label',{classes:['wsize','hsize','h5','grey'], touchEnabled: false, left:10,text: countdown.getTimePost(data[i].updated)});
		detailContainer.add(description);
		detailContainer.add(time);
		container.add(image);
		container.add(detailContainer);
		container.addEventListener("click", navTo);
		$.motherView.add(container);
		container = undefined;
		image = undefined;
		detailContainer = undefined;
		description = undefined;
		time = undefined;
	};
	offcount+=20;
}
if(OS_ANDROID){
	$.swipeRefresh.addEventListener('refreshing',function(e){
		init();
		e.source.setRefreshing(false);		
	});	
}
function showMotherView(){
	$.motherView.opacity = 1;		
	$.myInstance.hide();
	return false;	
}
function navTo(e){
	var row = e.source.record;
	if(row.type == "post_comment"){
		addPage("post_comment","Post Comment",{p_id:row.post_id});
	}else if(row.type == "post"){
		addPage("post_detail","Post Detail",{p_id:row.post_id});
	}
}
function scrollChecker(e){
	var theEnd = $.motherView.rect.height;
	var total = (OS_ANDROID)?pixelToDp(e.y)+e.source.rect.height: e.y+e.source.rect.height;
	var nearEnd = theEnd - 200;
	if(total >= nearEnd){
		getDataFromLocal();
	}	
}
