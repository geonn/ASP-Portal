var list_title = ["My Profile","Edit Profile" , "Groups", "Apply Leave", "Calendar", "Favourite Post", "Feed Back", "Log Out"];
var list_controller = ['my_profile','edit_profile','group_view','','calendar','','group_post',''];
var u_id = Ti.App.Properties.getString("u_id")||"";
console.log("User's ID = "+u_id);

function init() {
	for(var i = 0; i < list_title.length; i++) {
		var list_view = $.UI.create("View", {
			classes: ['wfill', 'padding'],
			pageIndex:list_controller[i],
			pageTitle:list_title[i],
			titileIndex:list_title[i],
			bottom: 0,
			height: 40
		});
		var view_img = $.UI.create("View", {
			touchEnabled:false,
			left: 5,
			width: 38,
			height: 38
		});
		var img = $.UI.create("ImageView", {
			image: "/images/more_page/more" + i + ".png",
			classes: ['wfill', 'hfill'],
			touchEnabled:false
		});
		var list_label = $.UI.create("Label", {
			classes: ['wfill', 'hsize', 'h4'],
			left: 50,
			touchEnabled:false,
			text: list_title[i]
		});
		
		view_img.add(img);
		list_view.add(view_img);
		list_view.add(list_label);
		$.list_more.add(list_view);
		list_view.addEventListener("click",function(e){
			//if(e.source.pageIndex == 1){
				addPage(e.source.pageIndex,e.source.pageTitle,{u_id:u_id});			
			//}
		//	addPage(e.source.pageIndex,e.source.titileIndex);
		});
	}
}

init();