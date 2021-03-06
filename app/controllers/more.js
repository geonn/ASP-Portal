function init() {
var list_title = ["My Profile","Edit Profile","Groups","Apply Leave","Calendar","Favourite Post","Feed Back","Log Out"];
var list_controller = ['my_profile','edit_profile','group_view','','calendar','','group_post',''];
var list_button = [,"edit_profile","addGroup",,,,,];
var u_id = Ti.App.Properties.getString("u_id")||"";	
	$.list_more.removeAllChildren();
	var u_model = Alloy.createCollection("staff");
	var u_res = u_model.getDataById(u_id);
	for(var i = 0; i < list_title.length; i++) {
		var list_view = $.UI.create("View", {
			classes:['wfill', 'padding','toucha3a3a3'],
			pageIndex:list_controller[i],
			pageButton:list_button[i],
			pageTitle:list_title[i],
			titileIndex:list_title[i],
			u_id:u_id,
			bottom: 0,
			height: 40
		});
		var view_img = $.UI.create("View", {
			touchEnabled:false,
			left: 5,
			width: 38,
			height: 38
		});
		if(i == 0){
			var user_img = (u_res.img_path != "")?u_res.img_path:"/images/more_page/more" + i + ".png";
			console.log(u_res.img_path+"userimg");
		}else{
			var user_img = "/images/more_page/more" + i + ".png";
		}
		var img = $.UI.create("ImageView", {
			image: user_img,
			classes: ['wfill', 'hfill'],
			touchEnabled:false
		});
		var list_label = $.UI.create("Label", {
			classes: ['wfill', 'hsize', 'h4'],
			left: 50,
			touchEnabled:false,
			text: list_title[i]
		});
		var hr = $.UI.create("View",{
			classes: ['hr'],
			top: '10',
			right: '10',
			left: '10',
			backgroundColor: '#EDF3F6'
		});
		
		view_img.add(img);
		list_view.add(view_img);
		list_view.add(list_label);
		if (i != 3 && i != 5 && i != 6) {
			$.list_more.add(list_view);
		};
		(i == 0)?$.list_more.add(hr):"";
		
		if (i != 7) {
			list_view.addEventListener("click",function(e){
				addPage(e.source.pageIndex,e.source.pageTitle,{u_id:e.source.u_id});
			});	
		}else{
			list_view.addEventListener("click",function(e){
				Alloy.Globals.loading.startLoading("Logout...");	
				Ti.App.Properties.removeAllProperties();
				setTimeout(function(e){
					Ti.App.fireEvent('index:login');
					Alloy.Globals.loading.stopLoading();		
				},2000);
			});
		};
		list_view = undefined;
		view_img = undefined;
		img = undefined;
		list_label = undefined;
		hr = undefined;
	}
	list_title = undefined;
	list_container = undefined;
	u_id = undefined;
	list_button = undefined;
	u_model = null;
	u_res - null;
}
Ti.App.addEventListener("more:init",init);
init();