var queryHelper = Class.create();
queryHelper.prototype = {
    initialize: function() {
    },

	executeQuery: function(searchObject)
	{
		if (searchObject)
			{
				var query = new GlideRecord(searchObject.tablename);
				searchObject.queryitems.forEach(
					function(queryitem){
						if (!queryitem.op)
							{
								queryitem.op = '=';
							}
						
						query.addQuery(queryitem.field, queryitem.op ,queryitem.value);
					}
				);
		
				query.query();
				if (query.next())
				{
					return query;
				}
			}
		
		return null;
	},
	
	createRecord: function(tablename, requestObj)
	{
		if (tablename && requestObj)
			{
				var returnObj = new GlideRecord(tablename);
				returnObj.initialize();
				for (var key in requestObj)
				{			
					returnObj[key] = requestObj[key];			
				}

				returnObj.insert();
				return returnObj;
			}
		
		return null;
	},
	
	updateRecord: function(tablename, originalObj, requestObj)
	{
		if (tablename && originalObj && requestObj)
			{
				var returnObj = new GlideRecord(tablename);
				
				for (var key in requestObj)
				{			
					originalObj[key] = requestObj[key];			
				}

				returnObj = originalObj.update();
				return returnObj;
			}
		
		return null;
	},
	
    type: 'queryHelper'
};