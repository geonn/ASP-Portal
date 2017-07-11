var buttonsExpanded = false;
function init(){
	$.discussion.add(Alloy.createController("discussion").getView());
}
init();
function scrollImage(page){
	var arr = [0,1,2].filter(function(a){ return a!=page;});	
	$.bottomNavigation.getChildren()[page].children[0].image = "/images/navigationButton/"+page+"_green.png";
	for(var i=0;i<$.bottomNavigation.getChildren().length-1;i++){
		$.bottomNavigation.getChildren()[arr[i]].children[0].image = "/images/navigationButton/"+arr[i]+"_grey.png";	
	}
	arr = null;
}
function scrollto(e){
	$.scrollableView.scrollToView(e.source.page);
	scrollImage(e.source.page);	
}
function doScroll(e){
	scrollImage(e.currentPage);
}
function clickButtons(){
	var size;
	if(buttonsExpanded){
		size = 60;
		$.bounceView.height = 0;
	}else{
		size = 175;
		$.bounceView.height = Ti.UI.FILL;
	}
	buttonsExpanded = !buttonsExpanded;
	$.buttonsView.resize(size,size);
}	