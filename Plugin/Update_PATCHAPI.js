// PATCH REST API
// Update a matching change request. Error is change does not exist
// Use vstsmetadata in request body as key to match the change request with

(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
	var responseBody = { };
    var event = request.body;
	var metadataFromRequest = event.data.vstsmetadata;
	if (!metadataFromRequest)
		{
		response.setError(new sn_ws_err.BadRequestError("vsts release metadata must be passed for the API"));	
		}
	else
		{
			var updateRequestData = InputsManager.ParseInputAndCreateChangeObject(event.data);
			var updatedchange = ChangeManager.UpdateChange(metadataFromRequest, updateRequestData);
			if (updatedchange && updatedchange.number)				
				{
					responseBody.number = updatedchange.number;
					responseBody.message = 'successful';
					responseBody.method = "Change was successfully updated";		
				}
			else
				{
					response.setError(new sn_ws_err.ServiceError("Update change failed"));
				}
		
		response.setBody(responseBody);	
		}    
})(request, response);