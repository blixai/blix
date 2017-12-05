var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
require('dotenv').config()


if (cluster.isMaster) {
  process.stdout.write('\033c')
  console.log(`Master ${process.pid} is running`);
  // make workers the numCPUs or whatever env variable your host provides
  let workers =  process.env.WORKERS || numCPUs || 1 
  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork()
  });
} else {
  require('./server.js');
}