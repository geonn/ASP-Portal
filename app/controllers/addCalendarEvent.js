var args = $.args;//u_id g_id date type
var offcount = 0;
console.log(args.type+" heeree");
function init() {
	Alloy.Globals.loading.stopLoading();
	$.myInstance.show('',false);
	$.scroll_list.scrollcheck = true;
	if(args.type == "Select Group") {
		$.selectedList.addcheck = true;
		getData();
	}else if(args.type == "Select Staff") {
		getData();
	}else {
		$.search_bar.removeAllChildren();
		$.scroll_list.removeAllChildren();
		$.list_parent.removeAllChildren();
	}
}

function getData() {
	var model, arr;
	if(args.type == "Select Group") {
		model = Alloy.createCollection("my_group");
		arr = model.CalendarGetGroupById(args.u_id, false, offcount);
	}else if(args.type == "Select Staff") {
		model = Alloy.createCollection("staff");
		arr = model.getDataForRenderStaffList(false, offcount);
	}
	renderStaff(arr);
	model = null;
	arr = null;
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
	checker = null;
	bol = null;
	offcount += 20;
	$.scroll_list.scrollcheck = true;
	$.myInstance.hide();
}

function addselected(e) {
	if(e.source.bol) {
		if(args.type == "Select Group" && $.selectedList.addcheck) {
			$.selectedList.addcheck = false;
		}else if(args.type == "Select Group") {
			var arr = {title: "Alert", msg: "Group Select Is Limited."};
			alert(arr);
			arr = null;
			return;
		}
		e.source.bol = false;
		e.source.getChildren()[1].getChildren()[1].image = "/images/checkbox_checked.png";
		var selected_staff = $.UI.create("View",{classes:['small-padding'],height:40,width:40,borderRadius:20,backgroundImage:(e.source.data.img_path != "") ? e.source.data.img_path : "/images/default_profile.png", id: e.source.id, backgroundColor:"#23C282"});
		selected_staff.addEventListener('click', function(e) {
			$.selectedList.remove(e.source);
			$.selectedList.addcheck = true;
			var list_cr = children({name:"id", value:e.source.id}, $.staff_list);
			if(list_cr != undefined) {
				list_cr.bol = true;
				list_cr.getChildren()[1].getChildren()[1].image = "/images/checkbox_unchecked.png";
			}
		});
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
		
	if (OS_ANDROID) {
		picker.showTimePickerDialog({
			callback : function(time){
				try {
					var hour = (time.value.getHours().toString().length >= 2) ? time.value.getHours() : "0" + time.value.getHours();
					var minute = (time.value.getMinutes().toString().length >= 2) ? time.value.getMinutes() : "0" + time.value.getMinutes();
					e.source.text = hour + ':' + minute;
					hour = undefined;
					minute = undefined;
				}catch(e) {}
			}
		});
	}else{
		var view_vert = $.UI.create("View", {classes:['wfill','hfill'],backgroundColor:"66000000"});
		var view_vertt = $.UI.create("View", {classes:['wfill','hsize','vert']});
		var view_vert_ = $.UI.create("View", {classes:['wfill','hsize']});
		var ok_button = $.UI.create("Button", {classes:['h4'], width: "40%", top:20, right:24, color:"#fff", title: "Done", backgroundColor:"#00CB85"});
		var cancel_button = $.UI.create("Button", {classes:['h4'], width: "40%", left: 24, top:20, color:"#fff", title: "Cancel", backgroundColor:"#00CB85"});
		cancel_button.addEventListener("click", function(){ 
			$.win_calenderEvent.remove(view_vert);
			view_vert = view_vertt = view_vert_ = ok_button = cancel_button = undefined;
		});
		ok_button.addEventListener("click", function(){
			var hour = (picker.value.getHours().toString().length >= 2) ? picker.value.getHours() : "0" + picker.value.getHours();
			var minute = (picker.value.getMinutes().toString().length >= 2) ? picker.value.getMinutes() : "0" + picker.value.getMinutes();
			e.source.text = hour + ':' + minute;
			$.win_calenderEvent.remove(view_vert);
			view_vert = view_vertt = view_vert_ = ok_button = cancel_button = hour = minute = undefined;
		});
		view_vertt.add(picker);
		view_vert_.add(cancel_button);
		view_vert_.add(ok_button);
		view_vertt.add(view_vert_);
		view_vert.add(view_vertt);
		$.win_calenderEvent.add(view_vert);
	};
}

function submit(e) {
	$.scroll_list.dosubmit = false;
	var date = args.date.split("/");
	var s_time = date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]) + " " + $.s_time.getText() + ":00";
	var e_time = date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]) + " " + $.e_time.getText() + ":00";
	var params;

	if(args.type == "Personal") {
		if($.title.getValue() != "" && $.s_time.getText() != "" && $.e_time.getText() != "") {
			params = {u_id:args.u_id, g_id:"", event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]), title:$.title.getValue(), status:1 , start_time:s_time, end_time:e_time};
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please insert something"};
			alert(arr);
			arr = null;
			return;
		}
	}else if(args.type == "Select Staff") {
		if($.selectedList.getChildren().length > 0) {
			var staff_id = [];
			for(var i = 0; i < $.selectedList.getChildren().length; i++) {
				staff_id.push($.selectedList.getChildren()[i].id);
			}
			params = {u_id:args.u_id, g_id:-1, member:staff_id.join(), event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]), title:$.title.getValue(), status:1 , start_time:s_time, end_time:e_time};
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please select staff."};
			alert(arr);
			arr = null;
			return;
		}
		if($.title.getValue() == ""){
			var arr = {title: "Alert", msg: "Please insert something"};
			alert(arr);
			arr = null;
			return;
		}
	}else if(args.type == "Select Group") {
		if($.selectedList.getChildren().length > 0) {
			var g_id = $.selectedList.getChildren()[0].id;
			params = {u_id:args.u_id, g_id:g_id, event_date:date[0] + "-" + ((date[1].toString().length >= 2) ? date[1] : "0" + date[1]) + "-" + ((date[2].toString().length >= 2) ? date[2] : "0" + date[2]), title:$.title.getValue(), status:1 , start_time:s_time, end_time:e_time};
			$.scroll_list.dosubmit = true;
		}else {
			var arr = {title: "Alert", msg: "Please select group."};
			alert(arr);
			arr = null;
			return;
		}
		if($.title.getValue() == ""){
			var arr = {title: "Alert", msg: "Please insert something"};
			alert(arr);
			arr = null;
			return;
		}
	}

	if($.scroll_list.dosubmit) {
		API.callByPost({url:"addEvent", params:params}, {
			onload:function(responceText) {
				var res = JSON.parse(responceText);
				Alloy.Globals.loading.startLoading("Loading...");
				setTimeout(function(){
					getDataAndRefresh();
				},2000);
			},onerror:function(err){
			}
		});
	}else {
		var arr = {title: "Alert", msg: "Please try again later."};
		alert(arr);
		arr = null;
	}
	date = s_time = e_time = params = null;
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
			Ti.App.fireEvent("todolist:refresh");
		},onerror:function(err){
		}
	});
	params = null;
	var arr = {title: "Alert", msg: "Add Event Sucess!"};
	alert(arr);
	Alloy.Globals.loading.stopLoading();
	Alloy.Globals.pageFlow.back();
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
		if(args.type == "Select Group") {
			$.myInstance.show('',false);
			offcount = 0;
			model = Alloy.createCollection("my_group");
			arr = model.searchMyGroup(args.u_id, false, offcount, e.source.value);
		}else if(args.type == "Select Staff") {
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