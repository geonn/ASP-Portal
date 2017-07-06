function init(){
	$.email.ANIMATION_DOWN();
	$.password.ANIMATION_DOWN();
}
function forgetPassword(e){
	addPage("forgetPassword","Forget Password");
}
function doLogin(e){
	Alloy.Globals.pageFlow.startLoading("Loading...");
	setTimeout(function(){
		Alloy.Globals.pageFlow.stopLoading();
		Ti.App.fireEvent("index:homePage");				
	},3000);	
}
