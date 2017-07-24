function doSubmit(e){
	Alloy.Globals.pageFlow.startLoading("Loading...");
	setTimeout(function(){
		Alloy.Globals.pageFlow.stopLoading();
		Alloy.Globals.pageFlow.back();		
	},3000);
}
