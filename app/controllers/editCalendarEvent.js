var args = $.args;//date time title e_id u_id g_id
var offcount = 0;

function init() {
	Alloy.Globals.loading.stopLoading();
	$.myInstance.show('',false);
	$.scroll_list.scrollcheck = true;
	$.scroll_list.firstcheck = true;
	$.scroll_list.staff_id = [];
	$.title.setValue(args.title);
	$.s_time.setText(args.time.substring(0, 5));
	$.e_time.setText(args.time.substring(8, 13));
	if(args.g_id != 0) {
		getData();
	}else {
		$.search_bar.removeAllChildren();
		$.scroll_list.removeAllChildren();
		$.list_parent.removeAllChildren();
	}
}

function getData() {
	var model, arr;
	if(args.g_id != -1) {
		model = Alloy.createCollection("my_group");
		arr = model.CalendarGetGroupById(args.u_id, false, offcount);
	}else if(args.g_id == -1) {
		model = Alloy.createCollection("staff");
		arr = model.getDataForRenderStaffList(false, offcount);
		var smodel = Alloy.createCollection("event_member");
		$.scroll_list.staff_id = smodel.getMemberByEId(args.e_id);
	}
	renderStaff(arr);
	model = null;
	arr = null;
}

function renderStaff(arr) {
	$.scroll_list.staffcheck = false;
	var bol = true;
	var checker = "/images/checkbox_unchecked.png";
	if(offcount == 0) {
		$.staff_list.removeAllChildren();
	}
	arr.forEach(function(entry) {//id name img_path
		if($.selectedList.getChildren().length > 0 || $.scroll_list.firstcheck) {
			if($.scroll_list.firstcheck) {
				for(var i = 0; i < $.scroll_list.staff_id.length; i++) {
					if($.scroll_list.staff_id[i].id == entry.id && $.scroll_list.staff_id[i].id != args.u_id) {
						$.scroll_list.staffcheck = true;
					}
				}
			}
			var list_cr = children({name:"id", value:entry.id}, $.selectedList);
			if(list_cr != undefined || entry.id == args.g_id || $.scroll_list.staffcheck) {
				if((entry.id == args.g_id || $.scroll_list.staffcheck) && $.scroll_list.firstcheck) {
					var selected_staff = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:(entry.img_path != "") ? entry.img_path : "/images/default_profile.png", id: entry.id, backgroundColor:"#23C282"});
					selected_staff.addEventListener('click', removeselected);
					$.selectedList.add(selected_staff);
					selected_staff = null;
				}
				bol = false;
				checker = "/images/checkbox_checked.png";
			}else {
				bol = true;
				checker = "/images/checkbox_unchecked.png";
			}
			list_cr = null;
		}
		var parent = $.UI.create("View", {
			classes: ['wfill', 'hsize'],
			backgroundColor: "#fff",
			data: entry,
			id: entry.id,
			bol: bol
		});
		var img = $.UI.create("ImageView", {
			classes: ['padding'],
			width: 45,
			height: 45,
			image: entry.img_path,
			defaultImage: "/images/default_profile.png",
			touchEnabled: false
		});
		var view_name = $.UI.create("View", {
			classes: ['wfill', 'hsize'],
			left: 65,
			touchEnabled: false
		});
		var name = (OS_ANDROID) ? $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			left: 10,
			right: 40,
			ellipsize: true,
			wordWrap: false,
			text: entry.name,
			touchEnabled: false
		}) : $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			left: 10,
			right: 40,
			text: entry.name,
			touchEnabled: false
		});
		var checkBox = $.UI.create("ImageView",{
			width: 20,
			height: 20,
			right: 10,
			image: checker,
			touchEnabled: false
		});
		parent.addEventListener('click', addselected);
		if(entry.id != args.u_id) {
			$.staff_list.add(parent);
		}
		parent.add(img);
		parent.add(view_name);
		view_name.add(name);
		view_name.add(checkBox);
		parent = null;
		img = null;
		view_name = null;
		name = null;
		checkBox = null;
	});
	if($.selectedList.getChildren().length < $.scroll_list.staff_id.length - 1 && $.scroll_list.firstcheck) {
		for(var i = 0; i < $.scroll_list.staff_id.length; i++) {
			if($.scroll_list.staff_id[i].id != args.u_id) {
				var selected_staff = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:($.scroll_list.staff_id[i].img_path != "") ? $.scroll_list.staff_id[i].img_path : "/images/default_profile.png", id: $.scroll_list.staff_id[i].id, backgroundColor:"#23C282"});
				selected_staff.addEventListener('click', removeselected);
				$.selectedList.add(selected_staff);
				selected_staff = null;
			}
		}
	}
	checker = null;
	bol = null;
	offcount += 20;
	$.scroll_list.scrollcheck = true;
	$.scroll_list.firstcheck = false;
	$.myInstance.hide();
}

function addselected(e) {
	if(e.source.bol) {
		if(args.g_id != -1 && args.g_id != 0 && $.selectedList.addcheck) {
			$.selectedList.addcheck = false;
		}else if(args.g_id != -1 && args.g_id != 0) {
			var arr = {title: "Alert", msg: "Group Select Is Limited."};
			alert(arr);
			arr = null;
			return;
		}
		e.source.bol = false;
		e.source.getChildren()[1].getChildren()[1].image = "/images/checkbox_checked.png";
		var selected_staff = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:(e.source.data.img_path != "") ? e.source.data.img_path : "/images/default_profile.png", id: e.source.id, backgroundColor:"#23C282"});
		selected_staff.addEventListener('click', removeselected);
		$.selectedList.add(selected_staff);
		selected_staff = null;
	}else {
		$.selectedList.addcheck = true;
		e.source.bol = true;
		e.source.getChildren()[1].getChildren()[1].image = "/images/checkbox_unchecked.png";
		var list_cr = children({name:"id", value:e.source.id}, $.selectedList);
		if(list_cr != undefined) {
			$.selectedList.remove(list_cr);
		}
	}
}

function removeselected(e) {
	$.selectedList.remove(e.source);
	$.selectedList.addcheck = true;
	var list_cr = children({name:"id", value:e.source.id}, $.staff_list);
	if(list_cr != undefined) {
		list_cr.bol = true;
		list_cr.getChildren()[1].getChildren()[1].image = "/images/checkbox_unchecked.png";
	}
}

function scrollChecker(e) {
	var theEnd = $.staff_list.rect.height;
	var nearEnd = theEnd - 200;
	var total = (OS_ANDROID) ? pixelToDp(e.y) + e.source.rect.height : e.y + e.source.rect.height;
	if(total >= nearEnd && $.scroll_list.scrollcheck) {
		$.scroll_list.scrollcheck = false;
		getData();
	}
	theEnd = null;
	nearEnd = null;
	total = null;
}

function timepicker(e) {
	var picker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_TIME
	});

	picker.showTimePickerDialog({
		callback : function(time){
			try {
				var hour = (time.value.getHours().toString().length >= 2) ? time.value.getHours() : "0" + time.value.getHours();
				var minute = (time.value.getMinutes().toString().length >= 2) ? time.value.getMinutes() : "0" + time.value.getMinutes();
				e.source.text = hour + ':' + minute;
				hour = null;
				minute = null;
			}catch(e) {}
		}
	});
}

function submit(e) {
	$.scroll_list.dosubmit = false;
	var date = args.date.split("/");
	var s_time = date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]) + " " + $.s_time.getText() + ":00";
	var e_time = date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]) + " " + $.e_time.getText() + ":00";
	var params = {e_id:args.e_id, event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]), title:$.title.getValue(), start_time:s_time, end_time:e_time, status:1};

	if(args.g_id == 0) {
		if($.title.getValue() != "" && $.s_time.getText() != "" && $.e_time.getText() != "") {
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please insert something"};
			alert(arr);
			arr = null;
		}
	}else if(args.g_id == -1) {
		if($.selectedList.getChildren().length > 0) {
			var u_id = [];
			var staff_id = JSON.parse(JSON.stringify($.scroll_list.staff_id));
			$.scroll_list.remove_staff = [];
			for(var i = 0; i < $.selectedList.getChildren().length; i++) {
				$.scroll_list.check_id = true;
				for(var j = 0; j < staff_id.length; j++) {
					if($.selectedList.getChildren()[i].id == staff_id[j].id) {
						$.scroll_list.check_id = false;
						staff_id[j].id = "";
					}
					if(staff_id[j].id == args.u_id) {
						staff_id[j].id = "";
					}
				}
				if($.scroll_list.check_id) {
					u_id.push($.selectedList.getChildren()[i].id);
				}
			}

			for(var j = 0; j < staff_id.length; j++) {
				if(staff_id[j].id != "") {
					$.scroll_list.remove_staff.push(staff_id[j].id);
				}
			}
			var p;
			if($.scroll_list.remove_staff.length > 0 && u_id > 0) {
				p = {e_id:args.e_id, member:u_id.join(), delete_member:$.scroll_list.remove_staff.join(), event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2])};
				$.scroll_list.dosubmit = true;
			}else if($.scroll_list.remove_staff.length > 0 && u_id <= 0) {
				p = {e_id:args.e_id, delete_member:$.scroll_list.remove_staff.join(), event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2])};
				$.scroll_list.dosubmit = true;
			}else if($.scroll_list.remove_staff.length <= 0 && u_id > 0) {
				p = {e_id:args.e_id, member:u_id.join(), event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2])};
				$.scroll_list.dosubmit = true;
			}
			if($.scroll_list.dosubmit) {
				API.callByPost({url:"addEventsMember", params:p},{
					onload:function(responceText){
						var res = JSON.parse(responceText);
					},onerror:function(err){
					}
				});
			}
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please select staff."};
			alert(arr);
			arr = null;
		}
	}else if(args.g_id != -1) {
		if($.selectedList.getChildren().length > 0) {
			var g_id = $.selectedList.getChildren()[0].id;
			if(g_id != args.g_id) {
				var p = {e_id:args.e_id, g_id:g_id};
				API.callByPost({url:"addEventsMember", params:p},{
					onload:function(responceText){
						var res = JSON.parse(responceText);
					},onerror:function(err){
					}
				});
				p = null;
			}
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please select group."};
			alert(arr);
			arr = null;
		}
	}

	if($.scroll_list.dosubmit) {
		API.callByPost({url:"editEvent", params:params}, {
			onload:function(responceText) {
				var res = JSON.parse(responceText);
				Ti.App.fireEvent("todolist:getDataAndRefresh");
				var arr = {title: "Alert", msg: "Edit Event Sucess!"};
				alert(arr);
				$.title.setValue("");
				$.s_time.setText("00:00");
				$.e_time.setText("00:00");
				res = null;
				arr = null;
			},onerror:function(err){
			}
		});
	}else {
		var arr = {title: "Alert", msg: "Please try again."};
		alert(arr);
		arr = null;
	}
	date = s_time = e_time = params = null;
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

$.search.listener('change', function(e){
	if(e.source.value != "") {
		var model, arr;
		if(args.g_id != -1) {
			$.myInstance.show('',false);
			offcount = 0;
			model = Alloy.createCollection("my_group");
			arr = model.searchMyGroup(args.u_id, false, offcount, e.source.value);
		}else if(args.g_id == -1) {
			$.myInstance.show('',false);
			offcount = 0;
			model = Alloy.createCollection("staff");
			arr = model.searchStaff(e.source.value, false, offcount);
		}
		renderStaff(arr);
		model = null;
		arr = null;
	}else {
		$.myInstance.show('',false);
		offcount = 0;
		getData();
	}
});

init();