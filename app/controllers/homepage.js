init();
var widthAnimate1 = Ti.UI.createAnimation({duration:200,width:"100%"});
var widthAnimate2 = Ti.UI.createAnimation({duration:200,width:0});
var opaAnimate1 = Ti.UI.createAnimation({duration:200,opacity:1});
var opaAnimate2 = Ti.UI.createAnimation({duration:200,opacity:0});
var time = 0;
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
	var page = e.source.page || 0;
	$.scrollableView.scrollToView(page);
	scrollImage(page);
	if(page == 0){
		console.log("page 0");
		time++;
		if(time > 1){
			$.discussion.children[0].children[0].scrollTo(0,0,true);
		}
	}else{
		console.log("page 1");
		time = 0;
	}
	Ti.App.Properties.setString("current_page", page);
}
Ti.App.addEventListener("scroll_page", scrollto);
function doScroll(e){
	scrollImage(e.currentPage);
}	

var sideExpaned = false;
function sideMenu(){
	if(sideExpaned){
		(OS_ANDROID)?$.sideMenu.animate(widthAnimate2):$.sideMenu.setWidth(0);
		$.sideMenu.animate(opaAnimate2);
	}
	else{
		(OS_ANDROID)?$.sideMenu.animate(widthAnimate1):$.sideMenu.setWidth("100%");
		$.sideMenu.animate(opaAnimate1);		
	}
	sideExpaned = !sideExpaned;		
}
exports.removeEventListeners = function() {
	Ti.App.removeEventListener("sideMenu",sideMenu);
	Ti.App.removeEventListener("scroll_page", scrollto);
};
Ti.App.addEventListener("sideMenu",sideMenu);
