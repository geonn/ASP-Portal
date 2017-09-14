/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "www.aspportal.freejini.com.my";
// APP authenticate user and key
var USER  = 'portal';
var KEY   = '73x853043s1014532l49f721ccf546933';

var doLogin = "http://"+API_DOMAIN+"/api/doLogin?user="+USER+"&key="+KEY;
var getStaffList = "http://"+API_DOMAIN+"/api/getStaffList?user="+USER+"&key="+KEY;
var getPostList = "http://"+API_DOMAIN+"/api/getPostList?user="+USER+"&key="+KEY;
var addGroup = "http://"+API_DOMAIN+"/api/addGroup?user="+USER+"&key="+KEY;
var doPost = "http://"+API_DOMAIN+"/api/doPost?user="+USER+"&key="+KEY;
var doPostImage = "http://"+API_DOMAIN+"/api/doPostImage?user="+USER+"&key="+KEY;
var deletePost = "http://"+API_DOMAIN+"/api/deletePost?user="+USER+"&key="+KEY;
var editPost = "http://"+API_DOMAIN+"/api/editPost?user="+USER+"&key="+KEY;
var doPostComment = "http://"+API_DOMAIN+"/api/doPostComment?user="+USER+"&key="+KEY;
var getPostCommentList = "http://"+API_DOMAIN+"/api/getPostCommentList?user="+USER+"&key="+KEY;
var removePostComment = "http://"+API_DOMAIN+"/api/removePostComment?user="+USER+"&key="+KEY;
var getMyGroupList = "http://"+API_DOMAIN+"/api/getMyGroupList?user="+USER+"&key="+KEY;
var getGroupListMemberByGid = "http://"+API_DOMAIN+"/api/getGroupListMemberByGid?user="+USER+"&key="+KEY;
var addGroupMember = "http://"+API_DOMAIN+"/api/addGroupMember?user="+USER+"&key="+KEY;
var deleteGroupMember = "http://"+API_DOMAIN+"/api/deleteGroupMember?user="+USER+"&key="+KEY;
var updateGroupPhoto = "http://"+API_DOMAIN+"/api/updateGroupPhoto?user="+USER+"&key="+KEY;
//API that call in sequence
var APILoadingList = [
 {url: "getStaffList", type: "api_model", model: "staff", checkId: "1"},
 {url: "getPostList", type: "api_model", model: "post", checkId: "2"},
 {url: "getMyGroupList", type: "api_model", model: "my_group", checkId: "3"}
];
var defaultRetryTimes = 5;

/*********************
**** API FUNCTION*****
**********************/

// call API by post method
exports.callByPost = function(e, handler){	 
	var url = (typeof e.new != "undefined")?"http://"+API_DOMAIN+"/api/"+e.url+"?user="+USER+"&key="+KEY:eval(e.url);
	console.log(url);
	var _result = contactServerByPost(url, e.params || {});   
	_result.onload = function(ex) {  
		try{
			console.log(this.responseText);
			JSON.parse(this.responseText);
		}
		catch(e){
			COMMON.createAlert("Error", e.message, handler.onexception);
			return;
		}
		_.isFunction(handler.onload) && handler.onload(this.responseText); 
	};
	
	_result.onerror = function(ex) {
		if(ex.code == "-1009"){		
			return;
		}
		if(_.isNumber(e.retry_times)){
			e.retry_times --;
			if(e.retry_times > 0){
				API.callByPost(e, handler);
			}	
		}else{
			e.retry_times = 2;
			API.callByPost(e, handler);
		}
	};
};
exports.callByPostVoice = function(e, onload, onerror){
	var retryTimes = (typeof e.retryTimes != "undefined")?e.retryTimes: defaultRetryTimes;
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){  
		
		var url = (typeof e.new != "undefined")?"http://"+API_DOMAIN+"/api/"+e.url+"?user="+USER+"&key="+KEY:eval(e.url);
		console.log(url); 
		console.log(e.type+"  e.type");
		if(e.type == "voice"){
			var _result = contactServerByPostVideo(url, e.params || {});  
		}else{
			var _result = contactServerByPost(url, e.params || {});  
		}
		_result.onload = function(ex) {  
			onload && onload(this.responseText); 
		};
		
		_result.onerror = function(ex) {  
			console.log(ex);
			if(retryTimes !== 0 && Titanium.Network.online){
				retryTimes --;
				_.extend(e, {retryTimes: retryTimes});
				API.callByPost(e, onload, onerror); 
			}else{
				if(!callByPost_error_popup){
					callByPost_error_popup = true;
					common.createAlert("Error", "Unable connect to the server. Please try again later.", function(){
						callByPost_error_popup = false;
					});
				}
				onload('{"status":"error","error_message":"No internet connection."}');
			}
		};
	}
};
exports.callByGet  = function(e, onload, onerror){
	var url =  eval(e.url) + "?"+e.params;
	console.log(url);
	var _result = contactServerByGet(encodeURI(url));   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
	};	
};


exports.checkAppVersion = function(callback_download){
	var appVersion = Ti.App.Properties.getString("appVersion");
	var url = checkAppVersionUrl + "&appVersion="+appVersion+"&appPlatform="+Titanium.Platform.osname;
	console.log(url);
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			var result = JSON.parse(this.responseText); 
			if(result.status == "error"){  
				callback_download && callback_download(result);
			}
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			console.log("error check version");
		},
		timeout : 60000  // in milliseconds
	}); 
	client.open("GET", url); 
	client.send(); 
};


// call API by post method
exports.callByPostWithJson = function(e, onload, onerror){
	
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){  
		var url = eval(e.url);
		console.log(url);
		var _result = contactServerByPostWithJson(url, e.params || {});   
		_result.onload = function(ex) { 
			console.log('success callByPost');
			console.log(this.responseText);
			onload && onload(this.responseText); 
		};
		
		_result.onerror = function(ex) {
			console.log('failure callByPost');
			console.log(ex);
			//API.callByPost(e, onload, onerror); 
		};
	}
};

// call API by post method
exports.callByPostImage = function(e, onload, onerror) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 50000
	});
	 
	var url = eval(e.url);
	var item_id = e.params.item_id || "";
	 
	var itemStr = "";
	if(item_id != "" && typeof item_id != 'undefined'){
		itemStr =  "&item_id="+item_id;
	}
	// console.log(url+"&u_id="+e.params.u_id+itemStr);return false;
	var _result = contactServerByPostImage(url+"&u_id="+e.params.u_id+itemStr,e.img);
	_result.onload = function(e) { 
		console.log('success');
		onload && onload(this.responseText); 
	};
	
	_result.onerror = function(ex) { 
		console.log("onerror");
		API.callByPostImage(e, onload);
		//onerror && onerror();
	};
	
};

// update user device token
exports.updateNotificationToken = function(e){
	
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){ 
		var records = {};
		records['version'] =  Ti.Platform.version;
		records['os'] =  Ti.Platform.osname;
		records['model'] =  Ti.Platform.model;
		records['macaddress'] =  Ti.Platform.macaddress;  
		records['token'] =  deviceToken;    
		var url = updateTokenUrl ;
		var _result = contactServerByPost(url,records);   
		_result.onload = function(e) {  
		};
		
		_result.onerror = function(ex) { 
		};
	}
};

// send notification as message to other user
exports.sendNotification = function(e){
	var records = {};
	var u_id = Ti.App.Properties.getString('user_id') || 0;
	records['message'] = e.message;
	records['to_id'] = e.to_id;  
	records['u_id'] = u_id; 
	var url = sendNotificationUrl+"?message="+e.message+"&to_id="+e.to_id+"&u_id="+u_id+"&target="+e.target;
	var _result = contactServerByGet(url);   
	_result.onload = function(ex) {
		console.log(ex);
	};
	
	_result.onerror = function(ex) { 
		console.log(ex);
	};
};

exports.loadAPIBySequence = function (e){ //counter,
	var counter = (typeof e.counter == "undefined")?0:e.counter;
	if(counter >= APILoadingList.length){
		Ti.App.fireEvent('app:loadingViewFinish');
		return false;
	}
	var u_id = Ti.App.Properties.getString("u_id")||undefined;	
	var api = APILoadingList[counter];
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(api['checkId']);
	var params ="";
	var total_item = APILoadingList.length;
	if(isUpdate != "" && last_update_on){
		params = {last_updated: isUpdate.updated};
	}
	
	var url = api['url'];
	if(api['url'] == "getMyGroupList"){
		if(u_id == undefined){
			doLogout();
			return;
		}		
		params={u_id:u_id};
	}
	console.log(url);
	API.callByPost({
		url: url,
		params: params
	},{
		onload: function(responseText){
			if(api['type'] == "api_function"){
				eval("_.isFunction("+api['method']+") && "+api['method']+"(responseText)");
			}else if(api['type'] == "api_model"){
				var res = JSON.parse(responseText);
				if(res.images != undefined){
					var img_model = Alloy.createCollection("images_table");
					img_model.saveArray(res.images);
					img_model = undefined;
				}
				if(res.group != undefined){
					var g_model =Alloy.createCollection("groups");
					g_model.saveArray(res.group);
					g_model = undefined;
				}
				var arr = res.data; 
		       	var model = Alloy.createCollection(api['model']);
		        model.saveArray(arr);			        	
		        checker.updateModule(APILoadingList[counter]['checkId'],APILoadingList[counter]['model'],currentDateTime1(),u_id);					
				arr = undefined;
				model = undefined;
				res = undefined;
			}
			Ti.App.fireEvent('app:update_loading_text', {text: ((counter+1)/total_item*100).toFixed()+"% loading..."});
			counter++;
			API.loadAPIBySequence({counter: counter});
		},
		onerror: function(err){
			Ti.App.fireEvent('app:update_loading_text', {text: ((counter+1)/total_item*100).toFixed()+"% loading..."});
			counter++;
			API.loadAPIBySequence({counter: counter});
		}
	});
};

function currentDateTime1(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var sec = today.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes;
	} 
	if (sec < 10){
		sec = "0" + sec;
	} 
	if(dd<10) {
	    dd='0'+dd;
	} 
	
	if(mm<10) {
	    mm='0'+mm;
	} 
	
	datetime = yyyy+'-'+mm+'-'+dd + " "+ hours+":"+minutes+":"+sec;
	today = undefined;
	dd = undefined;
	mm = undefined;
	yyyy = undefined;
	hours = undefined;
	minutes = undefined;
	sec = undefined;
	return datetime ;
}

/*********************
 * Private function***
 *********************/
function contactServerByGet(url) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	client.open("GET", url);
	client.send(); 
	return client;
};

function contactServerByPost(url,records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 60000
	});
	if(OS_ANDROID){
	 	client.setRequestHeader('ContentType', 'application/x-www-form-urlencoded'); 
	 }
	console.log(records);
	client.open("POST", url);
	client.send(records);
	return client;
};

function contactServerByPostWithJson(url,records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	
	client.setRequestHeader('ContentType', 'application/json');
	//client.setRequestHeader('processData', false);
	console.log(records);
	client.open("POST", url);
	client.send(records);
	return client;
};
function contactServerByPostVideo(url,params) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 150000
	});
	 
	//client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	client.open("POST", url);
	client.onsendstream = function(e) {
		console.log("still running");
	    console.log( Math.floor(e.progress * 100) + "%");
	};
	client.send(params); 
	return client;
};

function contactServerByPostImage(url, img) { 
 
	var client = Ti.Network.createHTTPClient({
		timeout : 50000
	});
	 
	//client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	client.open("POST", url);
	client.send({Filedata: img.photo}); 
	return client;
	
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};

function doLogout(){
	Alloy.Globals.loading.startLoading("Logout...");	
	Ti.App.Properties.removeAllProperties();
	setTimeout(function(e){
		Ti.App.fireEvent('index:login');
		Alloy.Globals.loading.stopLoading();		
	},2000);
}
