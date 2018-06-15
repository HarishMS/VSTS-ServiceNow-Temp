var ChangeManager = Class.create();
var vstsmetadatafieldname = 'x_mioms_vsts_integ_vsts_meta_data';
ChangeManager.prototype = {
    initialize: function() {
    },
	
	// Find a change request that matches with the supplied VSTS metadata
	findChange: function(releasemetadata){	
	if (releasemetadata)
	{	
		var changequery = {"tablename":"change_request","queryitems": [{"field":"","value":""}]};
		changequery.queryitems[0].field = vstsmetadatafieldname;
		changequery.queryitems[0].value = releasemetadata;
		var queryHelper = new x_mioms_vsts_integ.queryHelper();
		return queryHelper.executeQuery(changequery);		
	}

	return null;
	},

    type: 'ChangeManager'
};

// Static function to get number and state of the change request that matches with the supplied VSTS metadata
// Input: metadata: VSTSMetadata to match the change request with
// Output: Json object of the type { "result": { "number": "CHG0030115", "state": "New" } } 
ChangeManager.FindChangeNumberAndState = function(metadata)
{
	var returnObj = {};
	var changeManager = new ChangeManager();
	var change = changeManager.findChange(metadata);
	if (change)
		{
			returnObj.number = change.getDisplayValue("number");
			returnObj.state = change.getDisplayValue("state");		
		}
	else
		{
			returnObj.number = "";
			returnObj.state = "";
		}
	
	return returnObj;		
};

// Static function to create a new change request
// Input: a flat json with each property matching the corresponding field in change request by name
// Output: Json object of the type { "result": { "number": "CHG0030115", "state": "New" } } 
ChangeManager.CreateChange = function(requestObj)
{
	var returnObj = {};
	if (requestObj)
		{
			var queryHelper = new x_mioms_vsts_integ.queryHelper();
			var change = queryHelper.createRecord('change_request', requestObj);
			if (change)
				{
					returnObj.number = change.getDisplayValue("number");
					returnObj.state = change.getDisplayValue("state");
				}
		}
	
	return returnObj;	
};

// Static function to update the change request that matches the supplied metadata
// Input: metadata: VSTSMetadata to match the change request with
// Input: a flat json with each property matching the corresponding field in change request by name
// Output: Json object of the type { "result": { "number": "CHG0030115", "state": "New" } }
ChangeManager.UpdateChange = function(metadata, requestObj)
{
	var returnObj = {};
	var changeManager = new ChangeManager();
	var change = changeManager.findChange(metadata);
	
	if (change && requestObj)
		{
			var queryHelper = new x_mioms_vsts_integ.queryHelper();
			var updatedchange = queryHelper.updateRecord('change_request', change, requestObj);
			if (updatedchange)
				{
					returnObj.number = change.getDisplayValue("number");
					returnObj.state = change.getDisplayValue("state");
				}
		}
	
	return returnObj;	
};