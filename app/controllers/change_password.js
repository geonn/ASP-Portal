var args = arguments[0] || {};
var u_id = args.u_id || null;

function savePw(){
	pw1 = $.password1.getValue();
	pw2 = $.password2.getValue();
	pw3 = $.password3.getValue();
	console.log(u_id+": "+pw1+" "+pw2+" "+pw3);
	
	if(pw1 == "" || pw2 == "" || pw3 ==""){
		alert("Please fill in all text field!!!");
	}else{
		var params = {u_id:u_id, current_password:pw1, password:pw2, password2:pw3};
		API.callByPost({
			url: "changePassword",
			new: true,
			params: params
		},{
		onload: function(res){
			var res = JSON.parse(res);
			var arr = res.status || null;
			console.log("Change Password "+JSON.stringify(arr));
			if (arr == "error") {
				alert("Current password wrong or New password are not match");
			}else{
				alert("Password edit success");
				Alloy.Globals.pageFlow.back();	
			};
		},
		onerror: function(e){
			var res = JSON.parse(res);
			var arr = res.data || null;
			console.log("Edit Profile fail!");
			alert(arr);
			res = null;
			arr = null;
		}});	
	}
	
}
Ti.App.addEventListener("change_password:savePw",savePw);
