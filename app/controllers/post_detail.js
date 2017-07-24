var args = arguments[0] || {};
var p_id = args.p_id || "";
var u_id1;
var i_model = Alloy.createCollection("images_table");

function init(){
	var model = Alloy.createCollection("post");
	var res = model.getDataById(p_id);
	setData(res);
}init();

function setData(params){
	$.user_name.text = params.u_name;
	u_id1 = params.u_id;
	$.desc.text = params.description;
	$.count_coment.text = params.comment_count+" comment";
	$.date_time.setText(getTimePost(params.created));
	var imgArr = i_model.getImageByCateandPriId(true,undefined,2,p_id);
	if(imgArr.length != 0){
		var image_container = $.UI.create("ScrollableView",{classes:['wfill','padding'],height:250,backgroundColor:"#000",top:"0",scrollingEnabled:true});
		imgArr.forEach(function(entry1){
			var small_image_container = $.UI.create("View",{classes:['wfill','hsize']});
			var image = $.UI.create("ImageView",{classes:['wfill','hsize'],image:entry1.img_path});
			small_image_container.add(image);
			image_container.addView(small_image_container);
			image.addEventListener("click",function(e){
			COMMON.openWindow(Alloy.createController("zoomView",{img_path:e.source.image}).getView());
			});
		});
		$.p_img.add(image_container);
	}
}

function postOptions(){
	var u_id = Ti.App.Properties.getString("u_id")||"";
	var options = (u_id == u_id1)?['Edit','Delete','Cancel']:['Favourite','Report','Cancel'];
	var checking = (u_id == u_id1)?true:false;
	var opts = {cancel: 2,options:options,destructive: 0,title: 'More options'};	
	var dialog = Ti.UI.createOptionDialog(opts);	
	dialog.addEventListener("click",function(e){
		if(checking&&e.index == 0){
			addPage("post","Edit Post",{p_id:p_id,edit:true,refreshName:"post_detail:init"});
		}
		if(checking&&e.index == 1){
			deletePost(p_id);
		}
	});	
	dialog.show();
}

function parseDate(str) {
    var mdy = str.split('-');
    return new Date(mdy[0], mdy[1]-1, mdy[2]);
}

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

function parseToSecond(hh,mm,ss) {
	return (Math.floor(hh)*60+Math.floor(mm))*60+Math.floor(ss);
}

function getTimePost(p){
	var toTime = new Date();
	var dd = toTime.getDate();
	var mm = toTime.getMonth()+1; //January is 0!
	var yyyy = toTime.getFullYear();
	if(dd<10) {
	    dd='0'+dd;
	} 
	if(mm<10) {
	    mm='0'+mm;
	} 
	var today = yyyy+'-'+mm+'-'+dd;
	var hh = toTime.getHours();
	var mi = +toTime.getMinutes();
	var ss = toTime.getSeconds();
	if(hh<10) {
	    hh='0'+hh;
	} 
	if(mi<10) {
	    mi='0'+mi;
	}
	if(ss<10) {
		ss='0'+ss;
	}
	var nowTime = hh+":"+mi+":"+ss;
	var postYear = Math.floor(p.substring(0,4));
	var postMonth = Math.floor(p.substring(5,7));
	var postDate = Math.floor(p.substring(8,10));
	if(postDate<10) {
	    postDate='0'+postDate;
	} 
	if(postMonth<10) {
	    postMonth='0'+postMonth;
	}
	var postCreatedDate = postYear+"-"+postMonth+"-"+postDate;
	var postHour = Math.floor(p.substring(11,13));
	var postMinute = Math.floor(p.substring(14,16));
	var postSecond = Math.floor(p.substring(17,19));
	if (postHour<10) {
		postHour='0'+postHour;
	}
	if (postMinute<10) {
		postMinute='0'+postMinute;
	}
	if (postSecond<10) {
		postSecond='0'+postSecond;	
	}
	var postTime = +postHour+":"+postMinute+":"+postSecond;
	var postSecond = parseToSecond(postHour,postMinute,postSecond);
	var nowSecond = parseToSecond(hh,mi,ss);
	var minusSecond = nowSecond-postSecond;
	var hourDisplay = minusSecond/60/60;
	var minutesDisplay = minusSecond/60;
	var dayOfDistance = daydiff(parseDate(today), parseDate(postCreatedDate));
	if (dayOfDistance==-1) {
		return ("Yesterday"+"  "+postHour+":"+postMinute);
	}else if (dayOfDistance==0) {
		if (minusSecond<900) {
			return ("Just now");	
		}else if (minusSecond<3600) {
			return (minutesDisplay.toFixed(0)+" mins");
		}else{
			var hr = (minusSecond<7200)?" hr":" hrs";
			return (hourDisplay.toFixed(0)+hr);
		}
	}else if (dayOfDistance<-1) {
		return (postCreatedDate+"  "+postHour+":"+postMinute);
	}
}

function deletePost(){
	COMMON.createAlert("Warning","Are you sure want to delete this post?",function(e){
		Alloy.Globals.loading.startLoading("Delete...");		
		API.callByPost({url:"deletePost",params:{id:p_id,status:2}},{
			onload:function(responceText){
				var res = JSON.parse(responceText);
				if(res.status != "success"){
					Ti.App.fireEvent("discussion:refresh");
					Alloy.Globals.pageFlow.back();							
					Alloy.Globals.loading.stopLoading();							
					alert("Something wrong right now please try again later.");
				}else{
					Alloy.Globals.pageFlow.back();				
					Alloy.Globals.loading.stopLoading();		
					alert("Success to delete post.");
				}
			}
		});
	});
}

Ti.App.addEventListener("post_detail:init",init);
