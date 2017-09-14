exports.definition = {
	config: {
		columns: {
			id: "INTEGER PRIMARY KEY",
			g_id: "INTEGER",
			u_id: "INTEGER",
			status: "INTEGER",
			created: "DATE",
			updated: "DATE"
		},
		adapter: {
			type: "sql",
			collection_name: "my_group"
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
			getMemberByG_id:function(g_id){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				// offset = offset || 0;
				// var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select staff.id,staff.name,staff.img_path,my_group.status from " + collection.config.adapter.collection_name +" join staff on my_group.u_id = staff.id where my_group.status = 1 and my_group.g_id="+g_id;
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
                		u_id: res.fieldByName('id'),
						u_name: res.fieldByName("name"),
						u_image: res.fieldByName('img_path'),
						status: res.fieldByName('status')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;				
			},
			getMemberCountByG_id:function(g_id){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				// offset = offset || 0;
				// var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select count(u_id) as memberCount from " + collection.config.adapter.collection_name +" where status = 1 and g_id="+g_id;
				db = Ti.Database.open(collection.config.adapter.db_name);
				
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr = [];
				var count = 0;
				
                if(res.isValidRow()){
                	var row_count = res.fieldCount;
                	arr = {
                		memberCount: res.fieldByName('memberCount'),
					};
                	// res.next();
					// count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;				
			},			
			searchStaff:function(name,g_id,unlimit,offset){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				// offset = offset || 0;
				// var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select staff.id,staff.name,staff.img_path from " + collection.config.adapter.collection_name +" join staff on my_group.u_id = staff.id where my_group.status = 1 and my_group.g_id="+g_id+" and staff.name like '%"+name+"%' order by staff.name";
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
                		u_id: res.fieldByName('id'),
						u_name: res.fieldByName("name"),
						u_image: res.fieldByName('img_path'),
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;					
			},
			getU_idByG_id:function(g_id){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				// offset = offset || 0;
				// var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select u_id from " + collection.config.adapter.collection_name +" where status = 1 and g_id="+g_id;
				db = Ti.Database.open(collection.config.adapter.db_name);
				
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr = [];
				var count = 0;
				
                while (res.isValidRow()){
                	var row_count = res.fieldCount;
                	arr.push(res.fieldByName('u_id'));
                	res.next();
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;				
			},			
			saveArray:function(arr){
				var collection = this;
				var columns = collection.config.columns;
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
                arr.forEach(function(entry) {
                	var keys = [];
                	var questionmark = [];
                	var eval_values = [];
                	var update_questionmark = [];
                	var update_value = [];
                	for(var k in entry){
	                	if (entry.hasOwnProperty(k)){
	                		_.find(names, function(name){
	                			if(name == k){
	                				keys.push(k);
			                		questionmark.push("?");
			                		eval_values.push("entry."+k);
			                		update_questionmark.push(k+"=?");
	                			}
	                		});
	                	}
                	}
                	var without_pk_list = _.rest(update_questionmark);
	                var without_pk_value = _.rest(eval_values);
	                var sql_query =  "INSERT OR REPLACE INTO "+collection.config.adapter.collection_name+" ("+keys.join()+") VALUES ("+questionmark.join()+")";
	                eval("db.execute(sql_query, "+eval_values.join()+")");
				});
				db.execute("COMMIT");
				//console.log(db.getRowsAffected()+" affected row");
	            db.close();
	            collection.trigger('sync');			
			},
			getData: function(u_id, unlimit,offset){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select * from " + collection.config.adapter.collection_name + " mg JOIN groups g on mg.g_id = g.id WHERE mg.status = 1";
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
                		g_id: res.fieldByName('g_id'),
						g_name: res.fieldByName("name"),
						g_image: res.fieldByName('image')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},getDataById: function(u_id, unlimit,offset){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }				
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select * from " + collection.config.adapter.collection_name + " mg JOIN groups g on mg.g_id = g.id WHERE mg.status = 1 AND mg.u_id = "+u_id;
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
                		g_id: res.fieldByName('g_id'),
						g_name: res.fieldByName("name"),
						g_image: res.fieldByName('image')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},CalendarGetGroupById: function(u_id, unlimit,offset){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",15";
				var collection = this;
				var sql = "select * from " + collection.config.adapter.collection_name + " mg JOIN groups g on mg.g_id = g.id WHERE mg.status = 1 AND mg.u_id = "+u_id+sql_limit;
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
                		id: res.fieldByName('g_id'),
						name: res.fieldByName("name"),
						img_path: res.fieldByName('image')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},searchMyGroup: function(u_id, unlimit, offset, value){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",15";
				var collection = this;
				var sql = "select * from " + collection.config.adapter.collection_name + " mg JOIN groups g on mg.g_id = g.id WHERE mg.status = 1 AND mg.u_id = "+u_id+" AND g.name like '%"+value+"%' order by g.name"+sql_limit;
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
                		id: res.fieldByName('g_id'),
						name: res.fieldByName("name"),
						img_path: res.fieldByName('image')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},getGroupByGId: function(g_id){
				var collection = this;
				var sql = "select * from " + collection.config.adapter.collection_name + " mg JOIN groups g on mg.g_id = g.id WHERE mg.status = 1 AND mg.g_id = "+g_id;
				db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr;
                if(res.isValidRow()){
                	arr = {
                		id: res.fieldByName('g_id'),
						name: res.fieldByName("name")
					};
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