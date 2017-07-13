var count = 1;
var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;
if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) - 15) / 2);
}else{
	cell_width = Math.floor(pwidth - 15) / 2;
}

function init() {
	for(var i = 0; i <= 11; i++) {
		render_list();
	}
}

function render_list(e) {
	var view_group = $.UI.create("View", {
		classes: ['vert', 'hsize'],
		width: cell_width,
		left: 5,
		top: 5
	});
	
	var view_img = $.UI.create("View", {
		classes: ['wfill', 'hsize', 'vert']
	});
	
	var img_radius = $.UI.create("View", {
		width: cell_width * 0.60,
		height: cell_width * 0.60,
		borderRadius: cell_width * 2,
		borderWidth: 2,
		borderColor: "#000",
		zIndex: 1,
		top: 10,
		bottom: 10
	});
	
	var img = $.UI.create("ImageView", {
		classes: ['wfill', 'hfill'],
		image: "/images/asp_square_logo.png"
	});
	
	var title = (OS_ANDROID) ? $.UI.create("Label", {
		classes: ['wfill', 'h4', 'padding'],
		height: 25,
		ellipsize: true,
		wordWrap: false,
		text: "abcdefghijklmnopqrstuvw",
		top: 0
	}) : $.UI.create("Label", {
		classes: ['wfill', 'h4', 'padding'],
		height: 25,
		text: "abcdefghijklmnopqrstuvw",
		top: 0
	});
	
	$.group_list.add(view_group);
	view_group.add(view_img);
	view_group.add(title);
	view_img.add(img_radius);
	img_radius.add(img);
}

function pixelToDp(px) {
	return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

init();