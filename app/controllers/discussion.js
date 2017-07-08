if(OS_ANDROID) {
	$.swipeRefresh.addEventListener('refreshing', function(e) {
		setTimeout(function(){
			$.swipeRefresh.setRefreshing(false);					
		},2000);
	});
};