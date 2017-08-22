var args = arguments[0] || {};//u_id date holiday
var c_bol = true;

function init() {
	if(args.holiday != "noholiday") {
		add_list(args.holiday);
	}
	if($.festival.getChildren().length <= 2) {
		$.festival.removeAllChildren();
		$.festival.top = 0;
	}
	if($.todolist.getChildren().length <= 2) {
		$.todolist.removeAllChildren();
	}
}

function timepicker(id) {
	var picker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_TIME
	});

	picker.showTimePickerDialog({
		callback : function(time){
			try{
				id.source.text = time.value.getHours() + ':' + (time.value.getMinutes().lenght >= 1) ? time.value.getMinutes() : "0" + time.value.getMinutes();
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
	var arr;
	if($.title.getValue() != "" && $.s_time.getText() != "" && $.e_time.getText() != "") {
		arr = [{title: $.title.getValue(), s_time: $.s_time.getText(), e_time: $.e_time.getText()}];
		add_list(arr);
	}else {
		arr = {title: "Alert", msg: "Please insert something"};
		alert(arr);
	}
	
	$.title.setValue("");
	$.s_time.setText("00:00");
	$.e_time.setText("00:00");
	arr = null;
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

function alert(e) {console.log(JSON.stringify(e)+e.title);
	var alert = Titanium.UI.createAlertDialog({
		title: e.title,
		message: e.msg,
		ok: "ok"
	});
	alert.show();
	
	alert = null;
}
init();
