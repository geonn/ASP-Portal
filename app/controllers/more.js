var list_title = ["My Profile", "Groups", "Apply Leave", "Calender", "Favourite", "Feed Back", "Log Out"];

init();
function init() {
	for(var i = 0; i <= list_title.length; i++) {
		var list_view = $.UI.create("View", {
			classes: ['horz', 'wfill', 'padding'],
			height: 70
		});
		var view_img = $.UI.create("View", {
			classes: ['hfill'],
			width: 70
		});
		var img = $.UI.create("ImageView", {
			image: "/images/more_page/" + i + ".png",
			classes: ['wsize', 'hfill', 'padding'],
			borderRadius: 5,
		});
		var list_label = $.UI.create("Label", {
			classes: ['hsize', 'h4'],
			width: '75%',
			left: 10,
			text: list_title[i]
		});
		
		view_img.add(img);
		list_view.add(view_img);
		list_view.add(list_label);
		$.list_more.add(list_view);
	}
}
