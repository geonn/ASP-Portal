var args = arguments[0] || {};//u_id g_id
var date = new Date();
var num_to_name = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var day_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var month_num = 0;
var year_text = "";
var title_color = ["#B91E79", "#6B62A1", "#82A062", "#C1D58E", "#62A228", "#9FC22A", "#B7BB1E", "#DCA918", "#D28A28", "#812A16", "#3B4791", "#455056"];
var change_color = "";

var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) - 16) / 7);
}else{
	cell_width = Math.floor(pwidth - 16) / 7;
}

function pixelToDp(px) {
	return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

function init() {
	Alloy.Globals.loading.stopLoading();
	var params = {u_id: args.u_id};
	API.callByPost({url:"getMyEventsList", params:params},{
		onload:function(responceText){
			var res = JSON.parse(responceText);
			var e_model = Alloy.createCollection("my_eventslist");
			e_model.saveArray(res.events);
			var ee_model = Alloy.createCollection("event_member");
			ee_model.saveArray(res.data);
			res = e_model = ee_model = null;
			title();
		},onerror:function(err){
		}
	});
	params = null;
}

function title(e) {
	$.title.setBackgroundColor(title_color[date.getMonth()]);
	var title_month = $.UI.create("Label", {
		classes: ['hsize', 'h4'],
		width: "50%",
		left: 15,
		color: "#fff",
		text: num_to_name[date.getMonth() + 1],
		num: date.getMonth() + 1
	});
	
	var title_year = $.UI.create("Label", {
		classes: ['hsize', 'h4'],
		width: "50%",
		right: 15,
		textAlign: "right",
		color: "#fff",
		text: date.getFullYear()
	});
	
	month_num = date.getMonth() + 1;
	year_text = date.getFullYear();
	
	title_month.addEventListener("click", function(e) {
		change_month();
	});
	
	title_year.addEventListener("click", function(e) {
		change_year();
	});
	
	$.title.add(title_month);
	$.title.add(title_year);
	
	title_month = null;
	title_year = null;
	
	days_bar();
}

function change_month(e) {
	var options = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var opts = {cancel: 12, options: options, destructive: 0, title: 'Month'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
		if(e.index >= 0 && e.index <= 11) {
			var cr = $.title.getChildren();
			cr[0].setText(e.source.options[e.index]);
			cr[0].num = e.index + 1;
			
			if(cr[0].num != month_num) {
				month_num = cr[0].num;
				$.title.setBackgroundColor(title_color[e.index]);
				var cr2 = $.add_days.getChildren();
				$.add_days.remove(cr2[0]);
				var lastDay = new Date($.title.getChildren()[1].getText(), $.title.getChildren()[0].num);
				lastDay.setDate(1);
				lastDay.setHours(-1);
				lastDay.setHours(23);
				lastDay.setMinutes(59);
				lastDay.setSeconds(59);
				var month = ($.title.getChildren()[0].num.toString().length >= 2) ? $.title.getChildren()[0].num : "0" + $.title.getChildren()[0].num;
				var f_date = $.title.getChildren()[1].getText() + "-" + month + "-01";
				var l_date = $.title.getChildren()[1].getText() + "-" + month + "-" + lastDay.getDate();
				var model = Alloy.createCollection("holiday");
				var hlday = model.getDataByDate(f_date, l_date);
				render_calendar(hlday);
				lastDay = null;
				f_date = null;
				l_date = null;
				model = null;
				cr2 = null;
				hlday = null;
			}
			
			cr = null;
		}
	});
	
	dialog.show();
	
	options = null;
	opts = null;
	dialog = null;
}

function change_year(e) {
	var options = [];
	var y_count = -2;
	
	for(var i = 0; i <= 4; i++) {
		options[i] = date.getFullYear() + y_count;
		y_count++;
	}
	
	var opts = {cancel: 5, options: options, destructive: 0, title: 'Year'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
		if(e.index >= 0 && e.index <= 4) {
			var cr = $.title.getChildren();
			cr[1].setText(e.source.options[e.index]);
			
			if(cr[1].text != year_text) {
				year_text = cr[1].text;
				var cr2 = $.add_days.getChildren();
				$.add_days.remove(cr2[0]);
				var lastDay = new Date($.title.getChildren()[1].getText(), $.title.getChildren()[0].num);
				lastDay.setDate(1);
				lastDay.setHours(-1);
				lastDay.setHours(23);
				lastDay.setMinutes(59);
				lastDay.setSeconds(59);
				var month = ($.title.getChildren()[0].num.toString().length >= 2) ? $.title.getChildren()[0].num : "0" + $.title.getChildren()[0].num;
				var f_date = $.title.getChildren()[1].getText() + "-" + month + "-01";
				var l_date = $.title.getChildren()[1].getText() + "-" + month + "-" + lastDay.getDate();
				var model = Alloy.createCollection("holiday");
				var hlday = model.getDataByDate(f_date, l_date);
				render_calendar(hlday);
				lastDay = null;
				f_date = null;
				l_date = null;
				model = null;
				cr2 = null;
				hlday = null;
			}
			cr = null;
		}
	});
	
	dialog.show();
	
	options = null;
	y_count = null;
	opts = null;
	dialog = null;
}

function days_bar(e) {	
	for(var i = 0; i < day_of_week.length; i++) {
		var label_day = $.UI.create("Label", {
			classes: ['hsize', 'h4'],
			width: cell_width,
			color: (i == 0 || i == 6) ? "gray" : "#000",
			left: 1,
			top: 1,
			bottom: 1,
			textAlign: "center",
			text: day_of_week[i]
		});
		
		$.days.add(label_day);
		
		label_day = null;
	}
	var lastDay = new Date($.title.getChildren()[1].getText(), $.title.getChildren()[0].num);
	lastDay.setDate(1);
	lastDay.setHours(-1);
	lastDay.setHours(23);
	lastDay.setMinutes(59);
	lastDay.setSeconds(59);
	var month = ($.title.getChildren()[0].num.toString().length >= 2) ? $.title.getChildren()[0].num : "0" + $.title.getChildren()[0].num;
	var f_date = $.title.getChildren()[1].getText() + "-" + month + "-01";
	var l_date = $.title.getChildren()[1].getText() + "-" + month + "-" + lastDay.getDate();
	var model = Alloy.createCollection("holiday");
	var hlday = model.getDataByDate(f_date, l_date);
	render_calendar(hlday);
	lastDay = null;
	f_date = null;
	l_date = null;
	model = null;
	hlday = null;
}

function render_calendar(e) {
	var cr = $.title.getChildren();
	var lastDay = new Date(cr[1].text, cr[0].num);
	lastDay.setDate(1);
	lastDay.setHours(-1);
	lastDay.setHours(23);
	lastDay.setMinutes(59);
	lastDay.setSeconds(59);
	
	var list_date = $.UI.create("View", {
		classes: ['horz', 'wfill', 'hsize'],
		backgroundColor: "#fff"
	});
	
	var t = true;
	var first_day;
	
	for(var i = 1; i <= lastDay.getDate(); i++) {
		var day = new Date(cr[1].text + "/" + cr[0].num + "/" + i);
		var chk_hlday = [];
		if(t) {
			first_day = day.getDay();
			i -= first_day;
			t = false;
		}
		
		if(e != undefined) {
			e.forEach(function(entry) {
				var chk_date = entry.event_date.split("-");
				if(chk_date[0] == day.getFullYear() && chk_date[1] == cr[0].num && chk_date[2] == i) {
					chk_hlday.push(entry);
				}
				chk_date = null;
			});
		}
		
		var label_date = $.UI.create("Label", {
			width: cell_width,
			height: cell_width,
			borderRadius: cell_width / 2,
			color: (i == date.getDate() && cr[0].getText() == num_to_name[date.getMonth() + 1] && cr[1].getText() == date.getFullYear()) ? "#fff" : (day.getDay() == 0 || day.getDay() == 6 || chk_hlday != "") ? "gray" : "#000",
			backgroundColor: (i == date.getDate() && cr[0].getText() == num_to_name[date.getMonth() + 1] && cr[1].getText() == date.getFullYear()) ? $.title.getBackgroundColor() : "#fff",
			left: 2,
			top: 2,
			textAlign: "center",
			text: (i <= 0) ? "" : i,
			date: day.getFullYear() + "/" + cr[0].num + "/" + i,
			day: day.getDay(),
			holiday: (chk_hlday.length != 0) ? chk_hlday : "noholiday"
		});
		
		if(i == date.getDate()) {
			change_color = i + first_day;
		}
		
		if(i >= 1) {
			label_date.addEventListener("click", function(e) {
				selected_date(e.source);
			});
		}
		
		list_date.add(label_date);
		
		day = null;
		chk_hlday = null;
		label_date = null;
	}
	
	$.add_days.add(list_date);
	
	cr = null;
	lastDay = null;
	list_date = null;
	t = null;
	first_day = null;
	
	var d = (date.getDate().toString().length >= 2) ? date.getDate() : "0" + date.getDate();
	var m = (date.getMonth().toString().length >= 2) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
	var y = date.getFullYear();
	var model = Alloy.createCollection("my_eventslist");
	var data = model.getDataToday(y + "-" + m + "-" + d);
	var arr = [];
	data.forEach(function(e) {
		arr[e.event_date] = arr[e.event_date] || {};
		arr[e.event_date].title = e.event_date;
		arr[e.event_date].child = arr[e.event_date].child || [];
		arr[e.event_date].child.push(e);
	});
	$.holidays.removeAllChildren();
	todolist(arr);
	data = null;
	arr = null;
}

function selected_date(e) {
	var cr_view = $.add_days.getChildren();
	var cr_lb = cr_view[0].getChildren();
	cr_lb[change_color - 1].setBackgroundColor("#fff");
	
	var cl = (cr_lb[change_color - 1].day == 0 || cr_lb[change_color - 1].day == 6 || cr_lb[change_color - 1].holiday != "noholiday") ? "gray" : "#000";
	cr_lb[change_color - 1].setColor(cl);
	
	var t = $.title.getChildren() ;	
	e.setBackgroundColor($.title.getBackgroundColor());
	e.setColor("#fff");
	var day = new Date(t[1].text + "/" + $.title.getChildren()[0].num + "/1");
	change_color = e.text + day.getDay();
	
	addPage("todolist", e.date, {u_id:args.u_id, g_id:args.g_id, date:e.date, holiday:e.holiday}, {pageName: "addEventButton", eventName: "todolist:addEvent"});
	
	cr_view = null;
	cr_lb = null;
	cl = null;
	t = null;
	day = null;
}

function todolist(e) {
	for(key in e) {
		var date = $.UI.create("Label", {
			classes: ['wfill', 'hsize', 'small-padding'],
			color: "#000",
			text: e[key].title
		});
		
		e[key].child.forEach(function(entry) {
			var ss_time = entry.start_time.substring(11, 16);
			var ee_time = entry.end_time.substring(11, 16);
			var parent = $.UI.create("View", {
				classes: ['wfill', 'hsize'],
				top: 1,
				bottom: 1,
				backgroundColor: "#fff",
				time: ss_time + " - " + ee_time,
				title: entry.title
			});
	
			var title = (OS_IOS) ? $.UI.create("Label", {
				classes: ['size', 'h5'],
				top: 5,
				bottom: 5,
				left: 5,
				right: "25%",
				height: 19,
				color: "#000",
				text: entry.title,
				touchEnabled: false
			}) : $.UI.create("Label", {
				classes: ['wsize', 'h5'],
				top: 5,
				bottom: 5,
				left: 5,
				right: "25%",
				height: 19,
				ellipsize: true,
				wordWrap: false,
				color: "#000",
				text: entry.title,
				touchEnabled: false
			});
			
			var list_time = $.UI.create("View", {
				classes: ['wsize', 'hsize', 'horz'],
				top: 5,
				bottom: 5,
				right: 5,
				touchEnabled: false
			});
			
			var s_time = $.UI.create("Label", {
				classes: ['wsize', 'hsize', 'h5'],
				color: "#000",
				text: ss_time,
				touchEnabled: false
			});
			
			var to = $.UI.create("Label", {
				classes: ['wsize', 'hsize', 'h5'],
				color: "#000",
				text: " - ",
				touchEnabled: false
			});
			
			var e_time = $.UI.create("Label", {
				classes: ['wsize', 'hsize'],
				color: "#000",
				text: ee_time,
				touchEnabled: false
			});
			
			parent.addEventListener("click", detail);
			parent.add(title);
			parent.add(list_time);
			list_time.add(s_time);
			list_time.add(to);
			list_time.add(e_time);
			$.holidays.add(date);
			$.holidays.add(parent);
			
			parent = null;
			title = null;
			list_time = null;
			s_time = null;
			to = null;
			e_time = null;
			date = null;
		});
		
		date = null;
	}
}

function detail(e) {
	var alert = Titanium.UI.createAlertDialog({
		title: e.source.time,
		message: e.source.title,
		ok: "ok"
	});
	alert.show();
	
	alert = null;
}

init();