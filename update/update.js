const execSync = require("child_process").execSync;

let install = packages => {
  execSync(`npm install -g ${packages}`);
};

let update = () => {
  install("blix");
  process.exit();
};

module.exports = update;
