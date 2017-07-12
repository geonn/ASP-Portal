exports.definition = {
	config: {
		columns: {
			"id": "INTEGER PRIMARY KEY",
			"username": "TEXT",
			"name": "TEXT",
			"empno": "INTEGER",
			"corpcode": "TEXT",
			"ic_no": "INTEGER",
			"gender": "TEXT",
			"dob": "INTEGER",
			"email": "TEXT",
			"mobile": "INTEGER",
			"password": "TEXT",
			"position": "TEXT",
			"last_login": "TEXT",
			"join_date": "TEXT",
			"deviceToken": "TEXT",
			"status": "INTEGER",
			"created": "TEXT",
			"updated": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "staff"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}  
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			},
			getData: function(unlimit){
				var sql_limit = (unlimit)?"":"limit 0,6";
				var collection = this;
				var sql = "select * from "+collection.config.adapter.collection_name+" where status = 1;";
				db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr = [];
				var count = 0;   
                while (res.isValidRow()){
                	var row_count = res.fieldCount;
                	arr[count] = {
                		id: res.fieldByName('id'),
					    username: res.fieldByName('username'),
					    name: res.fieldByName('name'),
					    empno: res.fieldByName('empno'),
					    corpcode: res.fieldByName('corpcode'),
					    ic_no: res.fieldByName('ic_no'),
					    gender: res.fieldByName('gender'),
					    dob: res.fieldByName("dob"),
					    email: res.fieldByName("email"),
					    mobile: res.fieldByName("mobile"),
					    password: res.fieldByName("password"),
					    position: res.fieldByName('position'),
					    last_login: res.fieldByName('last_login'),
					    join_date: res.fieldByName('join_date'),
					    deviceToken: res.fieldByName('deviceToken'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
		});

		return Collection;
	}
};