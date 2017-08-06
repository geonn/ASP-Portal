Alloy.Globals.pageFlow = $.pageflow;
var my_group = Alloy.createCollection("my_group");
var group = Alloy.createCollection("groups");
var isExistPage = false;
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
		homePage();
	}
}
function closeApp(){
	var activity = Titanium.Android.currentActivity;
	activity.finish();	
}
$.index.addEventListener("android:back",function(e){
	Alloy.Globals.pageFlow.back();
	if(Alloy.Globals.pageFlow.countPages() <=1){
		closeApp();
	}
});
$.index.open();	

Ti.App.addEventListener("index:login",loginPage);
Ti.App.addEventListener("index:homePage",homePage);
