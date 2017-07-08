function doSubmit(e){
	console.log("doSubmit");
	Alloy.Globals.pageFlow.startLoading("Loading...");
	setTimeout(function(){
		Alloy.Globals.pageFlow.stopLoading();
		Alloy.Globals.pageFlow.back();		
	},3000);
}
