let shell = require("shelljs");

let install = packages => {
  shell.exec(`npm install -g ${packages}`);
};

let update = () => {
  install("blix");
  process.exit();
};

module.exports = update;
