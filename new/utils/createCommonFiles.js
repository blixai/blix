const fs = require("fs");
const path = require("path");
const helpers = require("../../helpers");
const execSync = require('child_process').execSync;
// const name = process.argv[3];
const store = require('../store')
const chalk = require('chalk')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

/// create things like .gitignore, scripts folder, scripts templates folder, README.md, .env, and package.json
const createCommonFilesAndFolders = () => {
  console.log(
    "Creating the project and downloading packages, this may take a moment"
  );
  // creates new project folder first, this is important for all new projects
  helpers.mkdirSync(``);
  try {
    process.chdir(`./${store.name}`)
    execSync('git init')
    process.chdir('../')
  } catch (err) {
    if (store.env === 'development') {
      console.error(chalk.red`${err}`)
    }
    process.chdir('../')
  }
  helpers.writeFile(
    `.gitignore`,
    loadFile("../files/common/gitIgnore.txt")
  );
  helpers.writeFile(
    `README.md`,
    loadFile("../files/common/README.md")
  );
  helpers.writeFile(
    `package.json`,
    loadFile("../files/common/package.json")
  );

  helpers.writeFile(`.env`, "");
  helpers.mkdirSync(`scripts`);
  helpers.mkdirSync(`scripts/templates`);
  helpers.mkdirSync(`test`);
};

module.exports = { createCommonFilesAndFolders };
