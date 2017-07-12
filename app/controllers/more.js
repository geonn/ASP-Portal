var list_title = ["My Profile", "Groups", "Apply Leave", "Calender", "Favourite", "Feed Back", "Log Out"];
var list_controller = ['','group_view','','','','',''];
init();
function init() {
	for(var i = 0; i <= list_title.length; i++) {
		var list_view = $.UI.create("View", {
			classes: ['horz', 'wfill', 'padding'],
			pageIndex:list_controller[i],
			height: 70
		});
		var view_img = $.UI.create("View", {
			classes: ['hfill'],touchEnabled:false,
			width: 70,
		});
		var img = $.UI.create("ImageView", {
			image: "/images/more_page/" + i + ".png",
			classes: ['wsize', 'hfill', 'padding'],
			touchEnabled:false,
			borderRadius: 5,
		});
		var list_label = $.UI.create("Label", {
			classes: ['hsize', 'h4'],
			width: '75%',
			touchEnabled:false,
			left: 10,
			text: list_title[i]
		});
		
		view_img.add(img);
		list_view.add(view_img);
		list_view.add(list_label);
		$.list_more.add(list_view);
		list_view.addEventListener("click",function(e){
			addPage(e.source.pageIndex,"Groups");
		});
	}
}
