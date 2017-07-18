var date = new Date();
var num_to_name = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var day_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var title_num = 0;
var title_color = ["#B91E79", "#6B62A1", "#82A062", "#C1D58E", "#62A228", "#9FC22A", "#B7BB1E", "#DCA918", "#D28A28", "#812A16", "#3B4791", "#455056"];
var change_color = "";
var cell_width;
var pwidth = Titanium.Platform.displayCaps.platformWidth;

if(OS_ANDROID){
	cell_width = Math.floor((pixelToDp(pwidth) - 8) / 7);
}else{
	cell_width = Math.floor(pwidth - 8) / 7;
}

function pixelToDp(px) {
	return ( parseInt(px) / (Titanium.Platform.displayCaps.dpi / 160));
}

function init() {
	title();
	days();
	render_calendar();
}

function title(e) {
	$.title.setBackgroundColor(title_color[date.getMonth() + 1]);
	var title_month = $.UI.create("Label", {
		classes: ['wsize', 'hsize', 'h4'],
		left: 15,
		color: "#fff",
		text: num_to_name[date.getMonth() + 1],
		num: date.getMonth() + 1
	});
	
	title_num = date.getMonth() + 1;
	
	title_month.addEventListener("click", function(e) {
		change_month();
	});
	
	$.title.add(title_month);
}

function change_month(e) {
	var options = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Cancel"];
	var opts = {cancel: 12, options: options, destructive: 0, title: 'Month'};
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e) {
	if(e.index >= 1 && e.index <= 11) {
		var cr = $.title.getChildren();
		cr[0].setText(options[e.index]);
		cr[0].num = e.index + 1;
			
		if(cr[0].num != title_num) {
			$.title.setBackgroundColor(title_color[e.index]);
			var cr = $.add_days.getChildren();
			$.add_days.remove(cr[0]);
			render_calendar();
		}
	}
	});
	
	dialog.show();
}

function days(e) {	
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
}

function render_calendar(e) {
	var cr = $.title.getChildren();
	var lastDay = new Date(date.getFullYear(), cr[0].num);
	lastDay.setDate(1);
	lastDay.setHours(-1);
	lastDay.setHours(23);
	lastDay.setMinutes(59);
	lastDay.setSeconds(59);
	
	var list_date = $.UI.create("View", {
		classes: ['horz', 'wfill', 'hfill'],
		backgroundColor: "#fff"
	});
	
	var t = true;
	for(var i = 1; i <= lastDay.getDate(); i++) {
		if(t) {
			var day = new Date(date.getFullYear() + "-" + cr[0].num + "-" + i);
			i -= day.getDay();
			t = false;
		}
		
		var label_date = $.UI.create("Label", {
			width: cell_width,
			height: cell_width,
			borderRadius: cell_width / 2,
			color: (i == date.getDate()) ? "#fff" : "#000",
			backgroundColor: (i == date.getDate()) ? $.title.getBackgroundColor() : "#fff",
			left: 1,
			top: 1,
			textAlign: "center",
			text: (i <= 0) ? "" : i
		});
		
		if(i == date.getDate()) {
			change_color = i + day.getDay();
		}
		
		if(i >= 1) {
			label_date.addEventListener("click", function(e) {
				selected_date(e.source);
			});
		}
		
		list_date.add(label_date);
	}
	
	$.add_days.add(list_date);
}

function selected_date(e) {
	var cr_view = $.add_days.getChildren();
	var cr_lb = cr_view[0].getChildren();
	cr_lb[change_color - 1].setBackgroundColor("#fff");
	cr_lb[change_color - 1].setColor("#000");
	e.setBackgroundColor($.title.getBackgroundColor());
	e.setColor("#fff");
	var day = new Date(date.getFullYear() + "-" + $.title.getChildren()[0].num + "-1");
	change_color = e.text + day.getDay();
}

init();