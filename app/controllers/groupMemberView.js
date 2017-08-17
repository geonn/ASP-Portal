var args = arguments[0] || {};
var g_id = args.g_id || undefined;
var g_member = Alloy.createController("showGroupMember",{g_id:g_id});
function init(){
	$.group_list.add(Alloy.createController("addGroupMember",{g_id:g_id}).getView());
	$.add_group.add(g_member.getView());
	setTimeout(function(){
		Alloy.Globals.pageFlow.getCurrentPage().hideNavRight();			
	},500);
}
init();
function scrollto(e){
	$.scrollableView.scrollToView(e.source.page);
	scrollText(e.source.page);	
}
function scrollText(page){
	if (page != undefined) {
		var arr = [0,1].filter(function(a){ return a!=page;});	
		$.groupNavigation.getChildren()[page].children[0].color = "#23c282";
		for(var i=0;i<$.groupNavigation.getChildren().length-1;i++){
			$.groupNavigation.getChildren()[arr[i]].children[0].color = "#E1E1E1";	
		}
		arr = null;	
	};
}
exports.removeEventListeners = function() {
	console.log("onremove");
	g_member.removeEventListeners();
};
function doScroll(e){
	scrollText(e.currentPage);
	console.log(Alloy.Globals.pageFlow.getCurrentPage().showNavRight());
	if(e.currentPage == 0){
		Alloy.Globals.pageFlow.getCurrentPage().hideNavRight();
	}else{
		Alloy.Globals.pageFlow.getCurrentPage().showNavRight();
	}
}
