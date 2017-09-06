// Include Restify REST framework
// http://mcavage.me/node-restify/
var restify = require('restify');

// Child process module
var exec = require('child_process').exec;

// Create the server object
var server = restify.createServer({
	name: 'WinDnsApi'
});

// Special logic for CURL's keep-alive behavior
server.pre(restify.pre.userAgentConnection());

// DNS Record Creates/Updates
function doDnsSet(req, res, next) {

	var RRType = req.params.type.toUpperCase(),
		ZoneName = req.params.zone,
		NodeName = req.params.node,
		IpAddress = req.params.ip;

	// Validate RRType
	if( RRType != "A" ) {
		return next(new restify.InvalidArgumentError("You specified an invalid record type ('" + RRType + "'). Currently, only the 'A' (alias) record type is supported.  e.g. /dns/my.zone/A/.."));
	}

	// Validate Zone Name
	if( ZoneName.match(/[^A-Za-z0-9\.-]+/g) !== null ) {
		return next(new restify.InvalidArgumentError("Invalid zone name ('" + ZoneName + "'). Zone names can only contain letters, numbers, dashes (-), and dots (.)."));
	}

	// Validate Node Name
	if( NodeName.match(/[^A-Za-z0-9\.-]+/g) !== null ) {
		return next(new restify.InvalidArgumentError("Invalid node name ('" + NodeName + "'). Node names can only contain letters, numbers, dashes (-), and dots (.)."));
	}

	// Validate IP Address
	if( IpAddress.match(/^(([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)$/g) == null ) {
		return next(new restify.InvalidArgumentError("Invalid IP address ('" + IpAddress + "'). Currently, only IPv4 addresses are accepted."));
	}

	// Execute the Command
	var execRemove = exec('dnscmd /recorddelete ' + ZoneName + ' ' + NodeName + ' ' + RRType + ' /f',
		function (error, stdout, stderr) {
			if (error !== null) {

				var RespCode = "RecordUpdateFailed";
				var RespMessage = "An error occurred while trying to remove any existing records for the alias ('A') record '" + NodeName + "." + ZoneName + "'.  The operation was aborted.";

				res.send({
					code: RespCode,
					zone: ZoneName,
					node: NodeName,
					type: RRType,
					message: RespMessage
				});

				console.log( RespCode + ': ' + RespMessage );

			} else {

				var execSet = exec('dnscmd /recordadd ' + ZoneName + ' ' + NodeName + ' ' + RRType + ' ' + IpAddress,
					function (error, stdout, stderr) {
						if (error !== null) {

							var RespCode = "RecordUpdateFailed";
							var RespMessage = "There was a problem creating or updating the alias ('A') record '" + NodeName + "." + ZoneName + "' to '" + IpAddress + "'.  The operation was aborted.";


						} else {

							var RespCode = "RecordUpdated";
							var RespMessage = "The alias ('A') record '" + NodeName + "." + ZoneName + "' was successfully updated to '" + IpAddress + "'.";

						}

						res.send({
							code: RespCode,
							zone: ZoneName,
							node: NodeName,
							type: RRType,
							ip: IpAddress,
							message: RespMessage
						});

						console.log( RespCode + ': ' + RespMessage );

					}
				);


			}
		}
	);





}

// DNS Record Removal
function doDnsRemove(req, res, next) {

	var RRType = req.params.type.toUpperCase(),
		ZoneName = req.params.zone,
		NodeName = req.params.node;

	// Validate RRType
	if( RRType != "A" ) {
		return next(new restify.InvalidArgumentError("You specified an invalid record type ('" + RRType + "'). Currently, only the 'A' (alias) record type is supported.  e.g. /dns/my.zone/A/.."));
	}

	// Validate Zone Name
	if( ZoneName.match(/[^A-Za-z0-9\.-]+/g) !== null ) {
		return next(new restify.InvalidArgumentError("Invalid zone name ('" + ZoneName + "'). Zone names can only contain letters, numbers, dashes (-), and dots (.)."));
	}

	// Validate Node Name
	if( NodeName.match(/[^A-Za-z0-9\.-]+/g) !== null ) {
		return next(new restify.InvalidArgumentError("Invalid node name ('" + NodeName + "'). Node names can only contain letters, numbers, dashes (-), and dots (.)."));
	}

	// Execute
	var execRemove = exec('dnscmd /recorddelete ' + ZoneName + ' ' + NodeName + ' ' + RRType + ' /f',
		function (error, stdout, stderr) {
			if (error !== null) {

				var RespCode = "RecordRemoveFailed";
				var RespMessage = "There was a problem removing the alias ('A') record '" + NodeName + "." + ZoneName + "'.  The operation was aborted.";

			} else {

				var RespCode = "RecordRemoved";
				var RespMessage = "The alias ('A') record '" + NodeName + "." + ZoneName + "' was successfully removed.";

			}

			res.send({
				code: RespCode,
				zone: ZoneName,
				node: NodeName,
				type: RRType,
				message: RespMessage
			});

			console.log( RespCode + ': ' + RespMessage );

		}
	);

}

// Register Restify routes
// - For 'set'
server.get('/dns/:zone/:type/:node/set/:ip', doDnsSet);
server.head('/dns/:zone/:type/:node/set/:ip', doDnsSet);

// - For 'remove'
server.get('/dns/:zone/:type/:node/remove', doDnsRemove);
server.head('/dns/:zone/:type/:node/remove', doDnsRemove);

// Start the server
server.listen(3111, function() {
	console.log('%s web server listening at %s', server.name, server.url);
});
