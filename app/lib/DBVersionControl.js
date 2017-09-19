/*********************
*** DB VERSION CONTROL ***
* 
* Current Version 1.1
* 
**********************/

// update user device token
exports.checkAndUpdate = function(e){
	var dbVersion = Ti.App.Properties.getString("dbVersion") || 1.2; 
	if (dbVersion == '1.0') {
	  	var panelList = Alloy.createCollection('updateChecker'); 
		panelList.addColumn("u_id", "INTEGER");
		dbVersion = '1.1';
	}
	if(dbVersion == "1.1"){
		var imageTable = Alloy.createCollection("images_table");
		imageTable.addColumn("media_type","TEXT");
		dbVersion = '1.2';
	}
	Ti.App.Properties.setString("dbVersion", dbVersion);
};

