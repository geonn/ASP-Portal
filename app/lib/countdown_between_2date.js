// Countdown how long ago between in 2 date

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

exports.getTimePost = function (p){
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
			return (minutesDisplay.toFixed(0)+" minutes ago");
		}else{
			var hr = (minusSecond<=3600)?" hour ago":" hours ago";
			return (hourDisplay.toFixed(0)+hr);
		}
	}else if (dayOfDistance<-1) {
		return (postCreatedDate+"  "+postHour+":"+postMinute);
	}
};