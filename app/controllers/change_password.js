var args = arguments[0] || {};
var u_id = args.u_id || null;
var u_model = Alloy.createCollection("staff");
var u_res = u_model.getDataById(u_id);
var currentPW = u_res.password;
console.log(currentPW);

function savePw(){
	pw1 = $.password1.getValue;
	pw2 = $.password1.getValue;
	pw3 = $.password1.getValue;
	if (pw1 == currentPW) {
		console.log(pw1+" "+pw2+" "+pw3);	
	};
}
Ti.App.addEventListener("change_password:savePw",savePw);
