Alloy.Globals.pageFlow = $.pageflow;
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
		loginPage();
	}else{
		loadingPage();		
	}
}
function closeApp(){
	$.index.close();	
	$.destroy();
	var activity = Titanium.Android.currentActivity;
	activity.finish();	
	console.log("close lah");
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
	console.log(Alloy.Globals.pageFlow.countPages());
	if(Alloy.Globals.pageFlow.countPages() <=1){
		$.index.close();
	}
});

Ti.App.addEventListener("index:close",closeApp);
Ti.App.addEventListener("index:login",loginPage);
Ti.App.addEventListener("index:homePage",homePage);
Ti.App.addEventListener('app:loadingViewFinish', loadingViewFinish);

