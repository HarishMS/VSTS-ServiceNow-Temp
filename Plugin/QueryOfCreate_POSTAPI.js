// POST REST API
// Query status for a matching change request is present. Create new change request if not present
// Use vstsmetadata in the requestbody as key to match change requests with

(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
	var responseBody = { };
    var event = request.body;
	var metadataFromRequest = event.data.vstsmetadata;
	if (metadataFromRequest == null || metadataFromRequest == "")
		{
		response.setError(new sn_ws_err.BadRequestError("vsts release metadata must be passed for the API"));	
		}
	else
		{
		var change = ChangeManager.FindChangeNumberAndState(metadataFromRequest);
		if (change && change.number)
		{
			responseBody = change;
			responseBody.method = "matching change request was found for the vsts release metadata";			}
		else
		{
			var updatedRequestData = InputsManager.ParseInputAndCreateChangeObject(event.data);
			var newchange = ChangeManager.CreateChange(updatedRequestData);
			if (newchange && newchange.number)				
				{
					responseBody = newchange;
					responseBody.method = "a new change request was created for the vsts release metadata";		
				}
			else
				{
					response.setError(new sn_ws_err.ServiceError("New change could not be created for the request"));
				}
		}
			
		response.setBody(responseBody);	
		}    
})(request, response);