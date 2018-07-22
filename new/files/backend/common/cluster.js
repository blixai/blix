const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
require("dotenv").config();

if (cluster.isMaster) {
  console.clear();
  console.log(`Master ${process.pid} is running`);
  // make workers the numCPUs or whatever env variable your host provides
  const workers = process.env.WORKERS || numCPUs || 1;
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log("worker " + worker.process.pid + " died");
    cluster.fork();
  });
} else {
  require("./server.js");
}
