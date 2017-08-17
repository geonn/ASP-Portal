var args = arguments[0] || {};//u_id date holiday
var c_bol = true;

function init() {
	if(args.holiday != "noholiday") {
		add_list(args.holiday);
	}
}

function timepicker(id) {
	var picker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_TIME
	});

	picker.showTimePickerDialog({
		callback : function(time){
			try{
				id.source.text = time.value.getHours() + ':' + time.value.getMinutes();
			}catch(e) {
				//
			}
		}
	});
}

$.s_time.addEventListener('click', function(e) {
	timepicker(e);
});

$.e_time.addEventListener('click', function(e) {
	timepicker(e);
});

function submit(e) {
	var arr = [{title: $.title.getValue(), s_time:$.s_time.getText(), e_time:$.e_time.getText()}];
	add_list(arr);
	
	$.title.setValue("");
	$.s_time.setText("");
	$.e_time.setText("");
}

function add_list(e) {
	e.forEach(function(entry) {
		var parent = $.UI.create("View", {
			classes: ['wfill', 'hsize', 'vert'],
			bottom: 1,
			backgroundColor: "#fff",
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		});
		
		var title = (OS_IOS) ? $.UI.create("Label", {
			classes: ['wfill', 'small-padding'],
			height: 19,
			color: "#000",
			text: entry.title,
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		}) : $.UI.create("Label", {
			classes: ['wfill', 'small-padding'],
			height: 19,
			ellipsize: true,
			wordWrap: false,
			color: "#000",
			text: entry.title,
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		});
		
		var list_time = $.UI.create("View", {
			classes: ['wfill', 'hsize', 'horz', 'small-padding'],
			top: 0,
			time: entry.s_time + " - " + entry.e_time,
			title: entry.title
		});
		
		var s_time = $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			color: "#000",
			text: entry.s_time
		});
		
		var to = $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			color: "#000",
			text: " - "
		});
		
		var e_time = $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			color: "#000",
			text: entry.e_time
		});
		
		parent.addEventListener("click", detail);
		parent.add(title);
		if(entry.s_time != undefined && entry.e_time != undefined) {
			parent.add(list_time);
		}else {
			parent.setBackgroundColor("#FFD300");
			title.setFont({fontSize: 18});
			title.setHeight(22);
		}
		list_time.add(s_time);
		list_time.add(to);
		list_time.add(e_time);
		$.todolist.add(parent);
		
		parent = null;
		title = null;
		list_time = null;
		s_time = null;
		to = null;
		e_time = null;
	});
}

function detail(e) {
	if(e.source.title != undefined) {
		if(e.source.time != "undefined - undefined") {
			var alert = Titanium.UI.createAlertDialog({
				title: e.source.time,
				message: e.source.title,
				ok: "ok"
			});
			alert.show();
		}else {
			var alert = Titanium.UI.createAlertDialog({
				title: "Holiday",
				message: e.source.title,
				ok: "ok"
			});
			alert.show();
		}
	}
}

init();
