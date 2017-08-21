init();
function init(){
	Alloy.Globals.pageFlow.stopLoading();		
	$.discussion.add(Alloy.createController("discussion").getView());
	$.notification.add(Alloy.createController('notification').getView());
	$.more.add(Alloy.createController("more").getView());
}

function scrollImage(page){
	if(page != undefined) {
		for(var i=0;i<$.bottomNavigation.getChildren().length;i++){
			$.bottomNavigation.getChildren()[i].children[0].image = "/images/navigationButton/"+i+"_grey.png";
		}
		$.bottomNavigation.getChildren()[page].children[0].image = "/images/navigationButton/"+page+"_green.png";
	}
}
function scrollto(e){
	var page = e.source.page || 0;
	$.scrollableView.scrollToView(page);
	scrollImage(page);
	Ti.App.Properties.setString("current_page", page);
}
Ti.App.addEventListener("scroll_page", scrollto);
function doScroll(e){
	scrollImage(e.currentPage);
}	

