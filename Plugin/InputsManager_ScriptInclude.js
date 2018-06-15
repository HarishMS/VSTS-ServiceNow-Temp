// constant fields that are added in request body for VSTS integration
var vstsmetadatafieldname = 'x_mioms_vsts_integ_vsts_meta_data';
var vstsmetadatainput = 'vstsmetadata';
var additionalparamsinput = 'additionalparams';

// list of special fields that need query to get value from label, and the corresponding queries represented as json
var specialfieldslist = {"specialfields":[{"key":"assignment_group","value":{"tablename":"sys_user_group","queryitems":[{"field":"name","value":"inputval"}],"returnfield":"sys_id"}},{"key":"cmdb_ci","value":{"tablename":"cmdb_ci","queryitems":[{"field":"name","value":"inputval"}],"returnfield":"sys_id"}},{"key":"priority","value":{"tablename":"sys_choice","queryitems":[{"field":"label","value":"inputval"},{"field":"element","value":"priority"},{"field":"name","value":"change_request"}],"returnfield":"value"}},{"key":"impact","value":{"tablename":"sys_choice","queryitems":[{"field":"label","value":"inputval"},{"field":"element","value":"impact"}],"returnfield":"value"}},{"key":"risk","value":{"tablename":"sys_choice","queryitems":[{"field":"label","value":"inputval"},{"field":"element","value":"risk"},{"field":"name","value":"change_request"}],"returnfield":"value"}},{"key":"category","value":{"tablename":"sys_choice","queryitems":[{"field":"label","value":"inputval"},{"field":"element","value":"category"},{"field":"name","value":"change_request"},{"field":"inactive","op":"!=","value":"true"}],"returnfield":"value"}},{"key":"state","value":{"tablename":"sys_choice","queryitems":[{"field":"label","value":"inputval"},{"field":"element","value":"state"},{"field":"name","value":"change_request"}],"returnfield":"value"}}]};

var InputsManager = Class.create();
InputsManager.prototype = {
    initialize: function() {
    },

	//Get query representaiton if the key a special field
	findspecialfieldvalue: function(fieldkey){
		var matchingvalue = null;
		specialfieldslist.specialfields.forEach(function(item){if (item.key == fieldkey) {matchingvalue = item.value;}});
		return matchingvalue;
	},
	
	//In the query representation, replace "inputval" with the actual label value to use
	replaceinputval: function(searchquery, inputval){
		var returnVal = {};
		if (searchquery)
			{
				returnVal.tablename = searchquery.tablename;
				returnVal.queryitems = [];
				returnVal.returnfield = searchquery.returnfield;
				searchquery.queryitems.forEach(function(item){if (item.value == 'inputval'){item.value = inputval;} returnVal.queryitems.push(item);});
			}
		
		return returnVal;
	},
	
	// helper function to get the value to be used for the mentioned field
	// is same as the input value in all cases other than the special fields
	// if provided field name is in the list of special fields, then form a query to get value from label and use the value
	getValtoUseinQuery: function(key, value){
		var returnVal = value;
		var inputsManager = new InputsManager();
		var matchingValforspecialkey = inputsManager.findspecialfieldvalue(key);
		if (matchingValforspecialkey)
		{
			var updatedSearchQuery = inputsManager.replaceinputval(matchingValforspecialkey, value);
			var queryHelper = new x_mioms_vsts_integ.queryHelper();
			var queryResponse = queryHelper.executeQuery(updatedSearchQuery);	
			if (queryResponse)
			{
				returnVal = queryResponse[updatedSearchQuery.returnfield];
			}
		}
		
		return returnVal;
	},
	
    type: 'InputsManager'
};

//Parse the request body and form a flat list of fields to be used as change properties
//Perform additional processing (mostly label to value transform) for the fields that need one
InputsManager.ParseInputAndCreateChangeObject = function(requestInput)
{
	var returnObj = {};
	var inputsManager = new InputsManager();
	if (requestInput)
		{
			for (var key in requestInput)
			{			
				if (key == vstsmetadatainput)
					{
							returnObj[vstsmetadatafieldname] = requestInput[key];
					}
				else if (key == additionalparamsinput)
					{
						if (requestInput[key])
								{
									for(var additionalparam in requestInput[key])
									{	
										returnObj[additionalparam] = inputsManager.getValtoUseinQuery(additionalparam, requestInput[key][additionalparam]);
										//returnObj[additionalparam] = requestInput[key][additionalparam];
									}
								}
					}
				else 
					{
						returnObj[key] = inputsManager.getValtoUseinQuery(key, requestInput[key]);
						//returnObj[key] = requestInput[key];						
						//var matchingValforspecialkey = inputsManager.findspecialfieldvalue(key);
						//if (matchingValforspecialkey)
						//{
						//	var updatedSearchQuery = inputsManager.replaceinputval(matchingValforspecialkey, requestInput[key]);
						//	var queryHelper = new x_mioms_vsts_integ.queryHelper();
						//	var queryResponse = queryHelper.executeQuery(updatedSearchQuery);	
						//	if (queryResponse)
						//	{
						//		returnObj[key] = queryResponse[updatedSearchQuery.returnfield];
						//	}
						//}		
					}							
			}
		}
	
	return returnObj;	
};