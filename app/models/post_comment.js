exports.definition = {
	config: {
		columns: {
			id: "INTEGER PRIMARY KEY",
			u_id: "INTEGER",
			p_id: "INTEGER",
			comment: "TEXT",
			status: "INTEGER",
			created: "DATE",
			updated: "DATE"
		},
		adapter: {
			type: "sql",
			collection_name: "post_comment"
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
				offset = offset || 0;
				var sql_limit = (unlimit)?"":" limit "+offset+",10";
				var collection = this;
				var sql = "select * from post_comment where status = 1 order by updated";
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
			},getDataByP_id: function(p_id){
				var collection = this;
				var sql = "select staff.name,post_comment.* from post_comment left outer join staff on staff.id=post_comment.u_id where post_comment.p_id="+p_id;
				db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
					db.file.setRemoteBackup(false);
				}
                var res = db.execute(sql);
                var arr = [];
				var count = 0;   
                while (res.isValidRow()){
                	arr[count] = {
						name:res.fieldByName("name"),
						id:res.fieldByName("id"),
						u_id:res.fieldByName("u_id"),
						comment:res.fieldByName("comment"),
						updated:res.fieldByName("updated")
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