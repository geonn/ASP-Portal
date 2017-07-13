var list_title = ["My Profile", "Groups", "Apply Leave", "Calender", "Favourite", "Feed Back", "Log Out"];
var list_controller = ['','group_view','','','','',''];
init();
function init() {
	for(var i = 0; i <= list_title.length; i++) {
		var list_view = $.UI.create("View", {
			classes: ['horz', 'wfill', 'small-padding'],
			pageIndex:list_controller[i],
			pageTitle:list_title[i],
			bottom: 0,
			height: 40
		});
		var view_img = $.UI.create("View", {
			touchEnabled:false,
			left: 5,
			right: 5,
			width: 35,
			height: 35
		});
		var img = $.UI.create("ImageView", {
			image: "/images/more_page/" + i + ".png",
			classes: ['wsize', 'hfill'],
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
			//if(e.source.pageIndex == 1){
				addPage(e.source.pageIndex,e.source.pageTitle,{},true);			
			//}
		});
	}
}
