var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
  name:'CV Builder Server',
  description: 'The Node.js web server for the CV Builder application.',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  console.log('CV Builder Server successfully installed as a Windows Service.');
  console.log('Starting the service automatically...');
  svc.start();
});

// Listen for the "start" event
svc.on('start',function(){
  console.log('Service started successfully!');
  console.log('You can now access your application at http://localhost:3000');
});

// Install the script as a service.
console.log('Installing Windows Service...');
svc.install();
