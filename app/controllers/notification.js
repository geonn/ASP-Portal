var args = arguments[0] || {};
var data;

function init(){
	var u_id = Ti.App.Properties.getString("u_id");
	API.callByPost({url:"getNotificationList", new: true, params:{u_id:u_id}},{
		onload:function(responseText){
			var res = JSON.parse(responseText);
			var arr = res.data || null;
			var model = Alloy.createCollection("notification");
			model.saveArray(arr);
			data = model.getData(u_id);
			render({});
		}
	});
}
init();

function render(param){
	$.motherView.removeAllChildren();
	for (var i=0; i < data.length; i++) {
		var container = $.UI.create("View",{classes:['wfill','hsize','horz'], record: data[i], backgroundColor:"#fff"});
		//var image = $.UI.create("ImageView",{width:50,height:50,classes:['padding'],image:"/images/asp_square_logo.png"});
		var detailContainer = $.UI.create("View",{classes:['wfill','hsize','padding','vert'], touchEnabled: false, left:0});
		var description = $.UI.create('Label',{classes:['wsize','hsize'],left:10, touchEnabled: false, text: data[i].title});
		var time = $.UI.create('Label',{classes:['wsize','hsize','h5','grey'], touchEnabled: false, left:10,text: data[i].updated});
		detailContainer.add(description);
		detailContainer.add(time);
		//container.add(image);
		container.add(detailContainer);
		container.addEventListener("click", navTo);
		$.motherView.add(container);
		container = undefined;
		image = undefined;
		detailContainer = undefined;
		description = undefined;
		time = undefined;
	};
}

function navTo(e){
	var row = e.source.record;
	if(row.type == "post_comment"){
		addPage("post_comment","Post Comment",{p_id:row.post_id});
	}else if(row.type == "post"){
		addPage("post_detail","Post Detail",{p_id:row.post_id});
	}
}
