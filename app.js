var forever = require('forever-monitor');

// Hello..
console.log('');
console.log('Windows DNS API (WinDnsApi)');
console.log('Version 0.1.0');
console.log('Simple Windows DNS Management');
console.log('');
console.log('Licensed under the Apache License, Version 2.0 (the "License"');
console.log('Copyright 2014 Dasix Labs <dasix.com> and Luke Chavers <lukechavers.com>.');
console.log('');
console.log('Licensed under the Apache License, Version 2.0 (the "License"');
console.log('you may not use this file except in compliance with the License.');
console.log('You may obtain a copy of the License at');
console.log('');
console.log('http://www.apache.org/licenses/LICENSE-2.0');
console.log('');
console.log('Unless required by applicable law or agreed to in writing, software');
console.log('distributed under the License is distributed on an "AS IS" BASIS,');
console.log('WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.');
console.log('See the License for the specific language governing permissions and');
console.log('limitations under the License.');
console.log('');
console.log('------------------------------------------------------------------------------');
console.log('');
console.log('');

// Define child process
var child = new (forever.Monitor)(__dirname + '/lib/server.js', {
	silent: true,
	options: [],
	watch: true,
	watchIgnoreDotFiles: true,
	watchIgnorePatterns: null,
	watchDirectory: '../'
});

child.on('start', function ( process, data ) {
	console.log('Launching Web Server..');
});
child.on('restart', function ( fever ) {
	console.log('Restarting Web Server..');
});
child.on('exit', function ( fever ) {
	console.log('Quitting..');
});
child.on('stdout', function ( data ) {
	console.log(" -> " + data.toString());
});
child.on('stderr', function ( data ) {
	console.log('');
	console.log('Error');
	console.log('-------');
	console.log(data.toString());
	console.log('');
	console.log('');
	console.log('');
	console.log('');
});

/*
child.on('stop', function ( process ) {
	//console.log('Quitting..');
	console.log("stop");
	console.log(arguments);
});
child.on('error', function ( error ) {
	//console.log('Quitting..');
	//console.log(arguments);
	console.log("err");
});
*/

child.start();