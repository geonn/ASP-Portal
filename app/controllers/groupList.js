var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) / 2));
}else{
	cell_width = Math.floor(pwidth / 2);
}

function init() {
	for(var i = 0; i <= 11; i++) {
		render_list();
	}
}

function render_list(e) {
	var view_group = $.UI.create("View", {
		classes: ['vert',"hsize"],
		width: cell_width
	});
	var view_img = $.UI.create("View",{
		height: cell_width - 30,
		width: cell_width - 30,
		top: '15',
		left: '15',
		right: '15',
		borderRadius: (cell_width - 30) / 2,
		backgroundColor: "#000"
	});
	var img = $.UI.create("ImageView",{
		classes: ["wfill","hsize"],
		image: "/images/image_example1.png"
	});
	var group_title = $.UI.create("Label",{
		classes: ["hsize","wsize","h4"],
		text: "IT Department",
		top: '5'
	});
	view_img.add(img);
	view_group.add(view_img);
	view_group.add(group_title);
	$.group_list.add(view_group);
}

function pixelToDp(px) {
	return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

init();