function init(){
	$.email.ANIMATION_DOWN();
	$.password.ANIMATION_DOWN();
}
function forgetPassword(e){
	addPage("forgetPassword","Forget Password");
}
function doLogin(e){
	Alloy.Globals.pageFlow.startLoading("Loading...");
	console.log("login: "+ Ti.App.Properties.getString('deviceToken'));
	API.callByPost({url:"doLogin",params:{username:$.email.getValue()||"",password:$.password.getValue()||"", device_token: Ti.App.Properties.getString('deviceToken') }},
	{onload:function(responceText){
		var res = JSON.parse(responceText);
		var arr = res.data || null;
		if(res.status != "error" && res.status == "success"){
			Alloy.Globals.pageFlow.stopLoading();	
			Ti.App.Properties.setString("u_id",arr.id);
			Ti.App.Properties.setString("username",arr.username);
			Ti.App.Properties.setString("u_name",arr.name);
			Ti.App.Properties.setString("empno",arr.empno);	
			Ti.App.Properties.setString("email",arr.email);	
			Ti.App.Properties.setString("contact",arr.mobile);	
			Ti.App.fireEvent("index:homePage");					
		}		
		else{
			Alloy.Globals.pageFlow.stopLoading();			
			alert(arr[0]);
		}		
	},onerror:function(err){
		
	}});
}
