function init(){
	$.add_group.add(Alloy.createController("addGroup").getView());
}init();
function scrollto(e){
	$.scrollableView.scrollToView(e.source.page);
	scrollText(e.source.page);	
}
function scrollText(page){
	var arr = [0,1].filter(function(a){ return a!=page;});	
	$.groupNavigation.getChildren()[page].children[0].color = "#23c282";
	for(var i=0;i<$.groupNavigation.getChildren().length-1;i++){
		$.groupNavigation.getChildren()[arr[i]].children[0].color = "#E1E1E1";	
	}
	arr = null;
}
function doScroll(e){
	scrollText(e.currentPage);
}