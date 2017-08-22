init();
var widthAnimate1 = Ti.UI.createAnimation({duration:200,width:"100%"});
var widthAnimate2 = Ti.UI.createAnimation({duration:200,width:0});
function init(){
	Alloy.Globals.pageFlow.stopLoading();		
	$.discussion.add(Alloy.createController("discussion").getView());
	$.notification.add(Alloy.createController('notification').getView());
	$.sideMenu1.add(Alloy.createController("more").getView());
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
	$.scrollableView.scrollToView(e.source.page);
	scrollImage(e.source.page);	
}
function doScroll(e){
	scrollImage(e.currentPage);
}	
var sideExpaned = false;
function sideMenu(){
	if(sideExpaned){
		$.sideMenu.animate(widthAnimate2);
	}
	else{
		$.sideMenu.animate(widthAnimate1);
	}
	sideExpaned = !sideExpaned;			
}
exports.removeEventListeners = function() {
	Ti.App.removeEventListener("sideMenu",sideMenu);
};
Ti.App.addEventListener("sideMenu",sideMenu);
