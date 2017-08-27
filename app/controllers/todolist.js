var args = arguments[0] || {};//u_id date holiday
var c_bol = true;

function init() {
	if(args.holiday != "noholiday") {
		add_list(args.holiday);
	}
	if($.festival.getChildren().length <= 2) {
		$.festival.removeAllChildren();
		$.festival.top = 0;
		$.todolist.top = 0;
	}
	if($.todolist.getChildren().length <= 2) {
		$.todolist.removeAllChildren();
	}
}

function add_list(e) {
	e.forEach(function(entry) {
		var parent = $.UI.create("View", {
			classes: ['wfill', 'hsize'],
			top: 1,
			bottom: 1,
			backgroundColor: "#fff",
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
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
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
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
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		});
		
		var list_time = $.UI.create("View", {
			classes: ['wsize', 'hsize', 'horz'],
			top: 5,
			bottom: 5,
			right: 5,
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		});
		
		var s_time = $.UI.create("Label", {
			classes: ['wsize', 'hsize', 'h5'],
			color: "#000",
			text: entry.s_time
		});
		
		var to = $.UI.create("Label", {
			classes: ['wsize', 'hsize', 'h5'],
			color: "#000",
			text: " - "
		});
		
		var e_time = $.UI.create("Label", {
			classes: ['wsize', 'hsize', 'h5'],
			color: "#000",
			text: entry.e_time
		});
		
		parent.addEventListener("click", detail);
		if(entry.s_time != undefined && entry.e_time != undefined) {
			parent.add(list_time);
		}
		parent.add(title);
		list_time.add(s_time);
		list_time.add(to);
		list_time.add(e_time);
		if(entry.s_time != undefined && entry.e_time != undefined) {
			if($.todolist.getChildren().length == 0) {
				var label = $.UI.create("Label", {classes: ['wfill', 'hsize', 'h4'], text: " Event", backgroundColor: "#fff"});
				var hr = $.UI.create("View", {classes: ['hr'], backgroundColor: "#ccc"});
				$.todolist.add(label);
				$.todolist.add(hr);
				
				label = null;
				hr = null;
			}
			$.todolist.add(parent);
		}else {
			$.festival.add(parent);
		}
		
		parent = null;
		title = null;
		list_time = null;
		s_time = null;
		to = null;
		e_time = null;
	});
}

function detail(e) {
	var time = (e.source.title != undefined && e.source.time != "undefined - undefined") ? e.source.time : "Festival";
	var arr = {title: time, msg: e.source.title};
	alert(arr);
	
	arr = null;
}

function alert(e) {
	var alert = Titanium.UI.createAlertDialog({
		title: e.title,
		message: e.msg,
		ok: "ok"
	});
	alert.show();
	
	alert = null;
}

function addEvent(e) {
	var options = ["Personal", "Group"];
	var opts = {cancel: 5, options: options, destructive: 0, title: 'Add Type'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
		if(e.index >= 0 && e.index <= 1) {
			addPage("addCalendarEvent", "Add Event", {u_id:args.u_id, date:args.date, type:e.source.options[e.index], todolistview:$.todolist});
		}
	});
	dialog.show();
}
Ti.App.addEventListener("todolist:addEvent", addEvent);

function argsAddListData(e) {
	var arr = [{title: e.title, s_time: e.s_time, e_time: e.e_time}];
	add_list(arr);
}
Ti.App.addEventListener("todolist:argsAddListData", argsAddListData);

exports.removeEventListeners = function(e) {
	Ti.App.removeEventListener("todolist:addEvent", addEvent);
	Ti.App.removeEventListener("todolist:argsAddListData", argsAddListData);
};

init();