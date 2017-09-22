var gender = "";
Alloy.Globals.pageFlow.stopLoading();
function init(){
	$.email.ANIMATION_DOWN();
	$.password.ANIMATION_DOWN();
	$.name.ANIMATION_DOWN();
	$.mobile.ANIMATION_DOWN();
}

function gender_chkbox(e){
	gender = e.source.value;
	eval("$."+e.source.id+".image = '/images/checkbox_checked.png'");
	eval("$."+e.source.opposite+".image = '/images/checkbox_unchecked.png'");
}

function doSignup(e){
	Alloy.Globals.pageFlow.startLoading("Loading...");
	console.log({email:$.email.getValue()||"", name:$.name.getValue()||"", mobile:$.mobile.getValue()||"", gender: gender, password:$.password.getValue()||"",device_token: Ti.App.Properties.getString('deviceToken')||"", });
	API.callByPost({url:"doSignUp", new: true, params:{email:$.email.getValue()||"", name:$.name.getValue()||"", mobile:$.mobile.getValue()||"", gender: gender, password:$.password.getValue()||"",device_token: Ti.App.Properties.getString('deviceToken')||"", }},
	{onload:function(responceText){
		var res = JSON.parse(responceText);
		var arr = res.data || null;
		if(res.status != "error" && res.status == "success"){
			var u_model = Alloy.createCollection("staff");
			u_model.saveArray(arr);
			API.loadAPIBySequence({});		
			console.log(arr.id+" arr.id here");
			Ti.App.Properties.setString("u_id",arr[0].id);
			Ti.App.Properties.setString("username",arr[0].username);
			Ti.App.Properties.setString("u_name",arr[0].name);
			Ti.App.Properties.setString("empno",arr[0].empno);	
			Ti.App.Properties.setString("email",arr[0].email);	
			Ti.App.Properties.setString("contact",arr[0].mobile);	
			Ti.App.Properties.setString("deviceToken",arr[0].deviceToken);
			Ti.App.fireEvent("index:homePage");					
		}		
		else{
			Alloy.Globals.pageFlow.stopLoading();			
			alert(arr[0]);
		}		
	},onerror:function(err){
	
	}});
}
