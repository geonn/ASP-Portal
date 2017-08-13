/*********************
*** DB VERSION CONTROL ***
* 
* Current Version 1.1
* 
**********************/

// update user device token
exports.checkAndUpdate = function(e){
	var dbVersion = Ti.App.Properties.getString("dbVersion") || 1.0; 
	if (dbVersion == '1.0') {
	  	var panelList = Alloy.createCollection('updateChecker'); 
		panelList.addColumn("u_id", "INTEGER");
		dbVersion = '1.1';
	}
	Ti.App.Properties.setString("dbVersion", dbVersion);
};

