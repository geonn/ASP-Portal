var args = arguments[0] || {};//u_id g_id date holiday
var c_bol = true;

function init() {
	Alloy.Globals.loading.stopLoading();
	$.win_calender.callback = 0;
	$.win_calender.getdatarender = true;
	getdatarender();
}

function getdatarender() {
	if($.win_calender.callback == 0) {
		$.win_calender.callback++;
		if(args.holiday != "noholiday") {
			var parent = $.UI.create("View", {
				classes: ['wfill', 'hsize'],
				top: 1,
				bottom: 1,
				backgroundColor: "#fff",
				time: "undefined - undefined",
				title: args.holiday[0].event_name,
				data: "",
				g_id: 0
			});
			var title = (OS_IOS) ? $.UI.create("Label", {
				classes: ['wsize', 'h5'],
				height: 19,
				top: 5,
				bottom: 5,
				left: 5,
				right: 5,
				color: "#000",
				text: args.holiday[0].event_name,
				touchEnabled: false
			}) : $.UI.create("Label", {
				classes: ['wsize', 'h5'],
				height: 19,
				top: 5,
				bottom: 5,
				left: 5,
				right: 5,
				ellipsize: true,
				wordWrap: false,
				color: "#000",
				text: args.holiday[0].event_name,
				touchEnabled: false
			});
			parent.addEventListener("click", detail);
			parent.add(title);
			$.festival.add(parent);
			parent = null;
			title = null;
			getdatarender();
		}else {
			getdatarender();
		}
	}else if($.win_calender.callback == 1) {
		$.win_calender.callback++;
		var model = Alloy.createCollection("my_eventslist");
		var date = args.date.split("/");
		date = date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]);
		var arr = model.getDataByDate(date);
		if(arr.length != 0) {
			add_list(arr);
		}else {
			getdatarender();
		}
	}else if($.win_calender.callback == 2) {
		removechild();
	}
}

function add_list(e) {
	e.forEach(function(entry) {
		var ss_time = entry.start_time.substring(11, 16);
		var ee_time = entry.end_time.substring(11, 16);
		var parent = $.UI.create("View", {
			classes: ['wfill', 'hsize'],
			top: 1,
			bottom: 1,
			backgroundColor: "#fff",
			time: ss_time + " - " + ee_time,
			title: entry.title,
			e_id: entry.id,
			u_id: entry.u_id,
			g_id: entry.g_id
		});
		var title = (OS_IOS) ? $.UI.create("Label", {
			classes: ['wsize', 'h5'],
			height: 19,
			top: 5,
			bottom: 5,
			left: 5,
			right: "25%",
			color: "#000",
			text: entry.title,
			touchEnabled: false
		}) : $.UI.create("Label", {
			classes: ['wsize', 'h5'],
			height: 19,
			top: 5,
			bottom: 5,
			left: 5,
			right: "25%",
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
			classes: ['wsize', 'hsize', 'h5'],
			color: "#000",
			text: ee_time,
			touchEnabled: false
		});
		parent.addEventListener("click", detail);
		if(entry.start_time != undefined && entry.end_time != undefined) {
			parent.add(list_time);
		}
		parent.add(title);
		list_time.add(s_time);
		list_time.add(to);
		list_time.add(e_time);
		if(entry.g_id != 0 || entry.g_id == -1) {
			$.group_todolist.add(parent);
		}else {
			$.personal_todolist.add(parent);
		}
		parent = null;
		title = null;
		list_time = null;
		s_time = null;
		to = null;
		e_time = null;
		ss_time = null;
		ee_time = null;
	});
	getdatarender();
}

function removechild() {
	if($.festival.getChildren().length >= 2) {
		$.festival.remove($.no_festival);
	}else if($.festival.getChildren().length == 0) {
		$.festival.add($.no_festival);
	}
	if($.personal_todolist.getChildren().length >= 2) {
		$.personal_todolist.remove($.p_event);
	}else if($.personal_todolist.getChildren().length == 0) {
		$.personal_todolist.add($.p_event);
	}
	if($.group_todolist.getChildren().length >= 2) {
		$.group_todolist.remove($.g_event);
	}else if($.group_todolist.getChildren().length == 0) {
		$.group_todolist.add($.g_event);
	}
}

function detail(e) {
	var user, group;
	if(e.source.g_id == -1) {
		var model = Alloy.createCollection("staff");
		user = model.getSmallDataById(e.source.u_id);
	}else if(e.source.g_id != 0) {
		var model = Alloy.createCollection("my_group");
		group = model.getGroupByGId(e.source.g_id);
	}
	var time = (e.source.title != undefined && e.source.time != "undefined - undefined") ? e.source.time : "Festival";
	var msg = (e.source.g_id == -1) ? "By " + user.name + "\n" + e.source.title : (e.source.g_id != 0) ? "By " + group.name + "\n" + e.source.title : e.source.title;
	var arr = {title: time, msg: msg, data:e.source};
	alert(arr);
	time = null;
	msg = null;
	arr = null;
	user = null;
	group = null;
}

function alert(e) {
	if(e.data.u_id == args.u_id){
		var bt_arr = (e.title == "Festival") ? ['Ok'] : ['Ok', 'Edit', 'Delete'];
		var alert = Titanium.UI.createAlertDialog({
			title: e.title,
			message: e.msg,
			buttonNames: bt_arr,
			data: e.data
		});
		alert.addEventListener("click", function(e2) {
			if(e2.index == 1 && e2.source.data.u_id == args.u_id) {
				addPage("editCalendarEvent", "Edit Event", {date:args.date, time:e2.source.data.time, title:e2.source.data.title, e_id:e2.source.data.e_id, u_id:e2.source.data.u_id, g_id:e2.source.data.g_id});
			}else if(e2.index == 2 && e2.source.data.u_id == args.u_id) {
				var params = {e_id:e2.source.data.e_id};
				API.callByPost({url:"deleteEvent", params:params}, {
					onload:function(responceText) {
						var res = JSON.parse(responceText);
						getDataAndRefresh();
					},onerror:function(err){
					}
				});
			}
		});
		alert.show();
		bt_arr = null;
		alert = null;		
	}else{
		COMMON.createAlert("Warning",'You are not a creator!\nSo you are not able to manage.',function(){
			
		});
	}
}

function getDataAndRefresh(){
	var params = {u_id: args.u_id};
	API.callByPost({url:"getMyEventsList", params:params},{
		onload:function(responceText){
			var res = JSON.parse(responceText);
			var e_model = Alloy.createCollection("my_eventslist");
			e_model.saveArray(res.events);
			var ee_model = Alloy.createCollection("event_member");
			ee_model.saveArray(res.data);
			refresh();
		},onerror:function(err){
		}
	});
	params = null;
}
Ti.App.addEventListener("todolist:getDataAndRefresh", getDataAndRefresh);

function addEvent(e) {
	var options = ["Personal", "Group"];
	var opts = {cancel: 5, options: options, destructive: 0, title: 'Add Type'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
		if(e.index == 0) {
			addPage("addCalendarEvent", "Add Event", {u_id:args.u_id, date:args.date, type:e.source.options[e.index]});
		}else if(e.index == 1) {
			var options2 = ["Select Group", "Select Staff"];
			var opts2 = {cancel: 5, options: options2, destructive: 0, title: 'Add Group By:'};
			var dialog2 = Ti.UI.createOptionDialog(opts2);
			
			dialog2.addEventListener("click", function(e2) {
				if(e2.index >= 0 && e2.index <= 1) {
					addPage("addCalendarEvent", "Add Event", {u_id:args.u_id, g_id:args.g_id, date:args.date, type:e2.source.options[e2.index]});
				}
			});
			dialog2.show();
		}
	});
	dialog.show();
}
Ti.App.addEventListener("todolist:addEvent", addEvent);

function refresh() {
	$.festival.removeAllChildren();
	$.personal_todolist.removeAllChildren();
	$.group_todolist.removeAllChildren();
	init();
}
Ti.App.addEventListener("todolist:refresh", refresh);

exports.removeEventListeners = function(e) {
	Ti.App.removeEventListener("todolist:addEvent", addEvent);
	Ti.App.removeEventListener("todolist:getDataAndRefresh", getDataAndRefresh);
};

init();