Alloy.Globals.pageFlow = $.pageflow;
function homePage(){
	$.pageflow.addChild({
	    controller: 'homepage',
	    navBar: {
	        title: 'Homepage',
	        androidTitleOptions: {
	            marginLeft: 14
	        }
	    }
	});	
}
function loginPage(){
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

	}
}
function closeApp(){
	var activity = Titanium.Android.currentActivity;
	activity.finish();	
}
$.index.open();	
Ti.App.addEventListener("index:init",init);
