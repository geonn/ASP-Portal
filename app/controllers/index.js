Alloy.Globals.pageFlow = $.pageflow;
Ti.App.Properties.setString("current_page", 0);
var my_group = Alloy.createCollection("my_group");
var group = Alloy.createCollection("groups");
var isExistPage = false;
var loadingView = Alloy.createController("loader");
function homePage(){
	Alloy.Globals.pageFlow.clear();		
	$.pageflow.addChild({
	    controller: 'homepage',
	    navBar: {
	    	logo:'images/asp_square_logo.png',
	    	height:"60",
	        title: '',
	        androidTitleOptions: {
	            marginLeft: 14
	        }
	        ,left:"menuButton",
	      	leftOptions:"sideMenu"
	    }
	});			
}
function loginPage(){
	Alloy.Globals.pageFlow.clear();	
	$.pageflow.addChild({
	    controller: 'loginPage',
	    navBar: {
	        title: 'Login Page',
	        androidTitleOptions: {
	            marginLeft: 14
	        }
	    }
	});			
}
init();
function init(){
	var u_id = Ti.App.Properties.getString("u_id") || "";
	if(u_id == ""){
		$.index.open();		
		loginPage();
	}else{
		loadingPage();		
		 //homePage();
	}
}
function closeApp(){
	$.index.close();	
	$.destroy();
}
function loadingPage(){
	loadingView.getView().open();
	loadingView.start();		
}	
function loadingViewFinish(){
	$.index.open();	
	homePage();	 
	Ti.App.removeEventListener('app:loadingViewFinish', loadingViewFinish);
	loadingView.finish();	
}
$.index.addEventListener("android:back",function(e){
	Alloy.Globals.pageFlow.back();
    if(Alloy.Globals.pageFlow.countPages() >1 && OS_ANDROID){
         Ti.UI.Android.hideSoftKeyboard();
    }
    
	if(Ti.App.Properties.getString("current_page") == 0 && Alloy.Globals.pageFlow.countPages() == 1){
		$.index.close();
	}else if(Alloy.Globals.pageFlow.countPages() == 1) {
		Ti.App.fireEvent("scroll_page");
	}
});
Ti.App.addEventListener("index:close",closeApp);
Ti.App.addEventListener("index:login",loginPage);
Ti.App.addEventListener("index:homePage",homePage);
Ti.App.addEventListener('app:loadingViewFinish', loadingViewFinish);

