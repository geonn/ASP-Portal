function init(){
	$.email.ANIMATION_DOWN();
	$.password.ANIMATION_DOWN();
}
function forgetPassword(e){
	Alloy.Globals.pageFlow.addChild({
	    controller: 'forgetPassword',
	    navBar: {
	        title: 'Forget Password'
	    }
	});
}
