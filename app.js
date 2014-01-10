var forever = require('forever-monitor');
var os = require('os')

// Hello..
console.log(os.EOL);
console.log('Windows DNS API (WinDnsApi)' + os.EOL);
console.log('Version 0.1.0' + os.EOL);
console.log('Simple Windows DNS Management' + os.EOL);
console.log(os.EOL);
console.log('Licensed under the Apache License, Version 2.0 (the "License"' + os.EOL);
console.log('Copyright 2014 Dasix Labs <dasix.com> and Luke Chavers <lukechavers.com>.' + os.EOL);
console.log(os.EOL);
console.log('Licensed under the Apache License, Version 2.0 (the "License"' + os.EOL);
console.log('you may not use this file except in compliance with the License.' + os.EOL);
console.log('You may obtain a copy of the License at' + os.EOL);
console.log(os.EOL);
console.log('http://www.apache.org/licenses/LICENSE-2.0' + os.EOL);
console.log(os.EOL);
console.log('Unless required by applicable law or agreed to in writing, software' + os.EOL);
console.log('distributed under the License is distributed on an "AS IS" BASIS,' + os.EOL);
console.log('WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.' + os.EOL);
console.log('See the License for the specific language governing permissions and' + os.EOL);
console.log('limitations under the License.' + os.EOL);
console.log(os.EOL);
console.log('------------------------------------------------------------------------------' + os.EOL);
console.log(os.EOL);

var WebServerPath = __dirname + "\\lib\\server.js";
console.log('Web Server Path: ' + WebServerPath + os.EOL);
console.log(os.EOL);
console.log(os.EOL);


// Define child process
var child = new (forever.Monitor)(['node',WebServerPath], {
	silent: true,
	options: []
	
	/* 
	watch: true,
	watchIgnoreDotFiles: true,
	watchIgnorePatterns: null,
	watchDirectory: '../'
	*/

});

child.on('start', function ( process, data ) {
	console.log('Launching Web Server..' + os.EOL);
});
child.on('restart', function ( fever ) {
	console.log('Restarting Web Server..' + os.EOL);
});
child.on('exit', function ( fever ) {
	console.log('Quitting..' + os.EOL);
});
child.on('stdout', function ( data ) {
	console.log(" -> " + data.toString() + os.EOL);
});
child.on('stderr', function ( data ) {
	console.log(os.EOL);
	console.log('Error' + os.EOL);
	console.log('-------' + os.EOL);
	console.log(data.toString() + os.EOL);
	console.log(os.EOL);
	console.log(os.EOL);
	console.log(os.EOL);
	console.log(os.EOL);
});

/* 
child.on('stop', function ( process ) {
	console.log("stop" + os.EOL);
	console.log(arguments + os.EOL);
});
child.on('error', function ( error ) {
	//console.log(arguments + os.EOL);
	console.log("err" + os.EOL);
});
*/

child.start();