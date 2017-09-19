exports.definition = {
	config: {
		columns: {
			"img_id": "INTEGER PRIMARY KEY",
			"img_uid": "INTEGER",
			"img_photoCate": "INTEGER",
			"img_photoCateID": "INTEGER",
			"img_caption":"TEXT",
			"img_path":"TEXT",
			"is_featured":"INTEGER",
			"img_status":"INTEGER",
			"created": "DATE",
			"updated": "DATE",
			"img_thumb": "TEXT",
			"img_300thumb":"TEXT",
			"media_type":"TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "images_table"
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
			getImageByCateandPriId: function(unlimit,offset,cate,priId){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var sql = "select img_id,img_path,img_300thumb from "+collection.config.adapter.collection_name+" where img_photoCate="+cate+" and img_photoCateID="+priId+" and media_type='image'";
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
                		img_id: res.fieldByName('img_id'),
                		img_path:res.fieldByName('img_path'),
                		img_300thumb:res.fieldByName('img_300thumb')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getVideoByCateandPriId: function(unlimit,offset,cate,priId){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var sql = "select img_id,img_path,img_300thumb,img_thumb from "+collection.config.adapter.collection_name+" where img_photoCate="+cate+" and img_photoCateID="+priId+" and media_type='video'";
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
                		img_id: res.fieldByName('img_id'),
                		img_path:res.fieldByName('img_path'),
                		img_300thumb:res.fieldByName('img_300thumb'),
                		img_thumb:res.fieldByName('img_thumb')
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},getData: function(unlimit,offset){
				var collection = this;
				var columns = collection.config.columns;
				
				var names = [];
				for (var k in columns) {
	                names.push(k);
	            }
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var sql = "select * from "+collection.config.adapter.collection_name+" where img_status = 1";
				db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                
                var eval_column = "";
            	for (var i=0; i < names.length; i++) {
					eval_column = eval_column+names[i]+": res.fieldByName('"+names[i]+"'),";
				};
                while (res.isValidRow()){
                	eval("arr[count] = {"+eval_column+"}");
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getDataById: function(id){
				var collection = this;
				var sql = "select staff.name as u_name,post.* from post left outer join staff on post.u_id=staff.id where post.status = 1 and post.id="+id;
				db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr;
				var count = 0;   
                if(res.isValidRow()){
                	arr = {
                		id: res.fieldByName('id'),
						u_id:res.fieldByName("u_id"),
						u_name:res.fieldByName('u_name'),
						title:res.fieldByName('title'),
						g_id:res.fieldByName('g_id'),
						description:res.fieldByName('description'),
						comment_count:res.fieldByName('comment_count'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated')
					};
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},saveArray:function(arr){
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
			},getDataForRenderStaffList:function(unlimit,offset){
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",20";
				var collection = this;
				var sql = "select id,name from "+collection.config.adapter.collection_name+" where status = 1 order by name"+sql_limit;
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
					    name: res.fieldByName('name'),
					};
                	res.next();
					count++;
                }
                res.close();
                db.close();
                collection.trigger('sync');
                return arr;				
			}
		});

		return Collection;
	}
};