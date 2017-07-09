if(OS_ANDROID) {
	$.swipeRefresh.addEventListener('refreshing', function(e) {
		setTimeout(function(){
			$.swipeRefresh.setRefreshing(false);					
		},2000);
	});
};
function post_detail(e){
	console.log("go to post detail page!!!");
	addPage("post_detail","Post Detail");
}
function post(e) {
	addPage("post", "Post");
}