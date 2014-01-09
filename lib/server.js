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

// DNS Updates
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

	var exec1 = exec('dnscmd /recordadd ' + ZoneName + ' ' + NodeName + ' ' + RRType + ' ' + IpAddress,
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		}
	);

	res.send({
		code: "RecordUpdated",
		zone: ZoneName,
		node: NodeName,
		type: RRType,
		ip: IpAddress,
		message: "The alias ('A') record '" + NodeName + "." + ZoneName + "' was successfully updated to '" + IpAddress + "'."
	});

}
server.get('/dns/:zone/:type/:node/set/:ip', doDnsSet);
server.head('/dns/:zone/:type/:node/set/:ip', doDnsSet);

// DNS Removal
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

	var exec1 = exec('dnscmd /recorddelete ' + ZoneName + ' ' + NodeName + ' ' + RRType,
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		}
	);

	res.send({
		code: "RecordRemoved",
		zone: ZoneName,
		node: NodeName,
		type: RRType,
		message: "The alias ('A') record '" + NodeName + "." + ZoneName + "' was successfully removed."
	});

}
server.get('/dns/:zone/:type/:node/remove', doDnsRemove);
server.head('/dns/:zone/:type/:node/remove', doDnsRemove);

// Start the server
server.listen(3111, function() {
	console.log('%s web server listening at %s', server.name, server.url);
});