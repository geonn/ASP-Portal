var args = $.args;
var offcount = 0;

function init() {
	$.myInstance.show('',false);
	if(args.type == "Group") {
		$.scroll_list.scrollcheck = true;
		getStaffData();
	}else {
		$.search_bar.removeAllChildren();
	}
}

function getStaffData() {
	var model = Alloy.createCollection("staff");
	var arr = model.getDataForRenderStaffList(false,offcount);
	renderStaff(arr);
}

function renderStaff(arr) {
	var bol = true;
	var checker = "/images/checkbox_unchecked.png";
	if(offcount == 0) {
		$.staff_list.removeAllChildren();
	}
	arr.forEach(function(entry) {//id name img_path
		if($.selectedList.getChildren().length > 0) {
			var list_cr = children({name:"id", value:entry.id}, $.selectedList);
			if(list_cr != undefined) {
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
			touchEnabled:false
		});
		var view_name = $.UI.create("View", {
			classes: ['wfill', 'hsize'],
			left: 65,
			touchEnabled: false
		});
		var name = $.UI.create("Label", {
			classes: ['wsize', 'hsize'],
			left: 10,
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
		parent.addEventListener('click', addselectstaff);
		$.staff_list.add(parent);
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
	checker = null;
	bol = null;
	offcount += 20;
	$.scroll_list.scrollcheck = true;
	$.myInstance.hide();
}

function addselectstaff(e) {
	if(e.source.bol) {
		e.source.bol = false;
		e.source.getChildren()[1].getChildren()[1].image = "/images/checkbox_checked.png";
		var selected_staff = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:(e.source.data.img_path != "") ? e.source.data.img_path : "/images/default_profile.png", id: e.source.id, backgroundColor:"#23C282"});
		selected_staff.addEventListener('click', function(e) {
			$.selectedList.remove(e.source);
			var list_cr = children({name:"id", value:e.source.id}, $.staff_list);
			if(list_cr != undefined) {
				list_cr.bol = true;
				list_cr.getChildren()[1].getChildren()[1].image = "/images/checkbox_unchecked.png";
			}
		});
		$.selectedList.add(selected_staff);
		selected_staff = null;
	}else {
		e.source.bol = true;
		e.source.getChildren()[1].getChildren()[1].image = "/images/checkbox_unchecked.png";
		var list_cr = children({name:"id", value:e.source.id}, $.selectedList);
		if(list_cr != undefined) {
			$.selectedList.remove(list_cr);
		}
	}
}

function scrollChecker(e) {
	var theEnd = $.staff_list.rect.height;
	var nearEnd = theEnd - 200;
	var total = (OS_ANDROID) ? pixelToDp(e.y) + e.source.rect.height : e.y + e.source.rect.height;
	if(total >= nearEnd && $.scroll_list.scrollcheck) {
		$.scroll_list.scrollcheck = false;
		getStaffData();
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
				var hour = (time.value.getHours().toString.length >= 1) ? time.value.getHours() : "0" + time.value.getHours();
				var minute = (time.value.getMinutes().toString.length >= 1) ? time.value.getMinutes() : "0" + time.value.getMinutes();
				e.source.text = hour + ':' + minute;
				hour = null;
				minute = null;
			}catch(e) {}
		}
	});
}

function submit(e) {
	if(args.type == "Personal") {
		if($.title.getValue() != "" && $.s_time.getText() != "" && $.e_time.getText() != "") {
			//API $.title.getValue() $.s_time.getText() $.e_time.getText()
			Ti.App.fireEvent("todolist:argsAddListData", {title: $.title.getValue(), s_time: $.s_time.getText(), e_time: $.e_time.getText()});
		}else {
			var arr = {title: "Alert", msg: "Please insert something"};
			alert(arr);
			arr = null;
		}
	}else if(args.type == "Group") {
		var list_cr = $.selectedList.getChildren();
		if(list_cr.length > 0) {
			//API 
		}else {
			var arr = {title: "Alert", msg: "Please select staff"};
			alert(arr);
			arr = null;
		}
	}
	$.title.setValue("");
	$.s_time.setText("00:00");
	$.e_time.setText("00:00");
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

$.staffName.listener('change', function(e){
	if(e.source.value != "") {
		$.myInstance.show('',false);
		offcount = 0;
		var model = Alloy.createCollection("staff");
		var arr = model.searchStaff(e.source.value, false, offcount);
		renderStaff(arr);
		model = null;
		arr = null;
	}else {
		$.myInstance.show('',false);
		getStaffData();
	}
});

init();