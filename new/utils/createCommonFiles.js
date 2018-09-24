const fs = require("fs");
const path = require("path");
const helpers = require("../../helpers");
const execSync = require('child_process').execSync;
const name = process.argv[3];
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
  helpers.mkdirSync(`./${name}`);
  try {
    process.chdir(`./${name}`)
    execSync('git init')
    process.chdir('../')
  } catch (err) {
    if (store.env === 'development') {
      console.error(chalk.red`${err}`)
    }
    process.chdir('../')
  }
  helpers.writeFile(
    `./${name}/.gitignore`,
    loadFile("../files/common/gitIgnore.txt")
  );
  helpers.writeFile(
    `./${name}/README.md`,
    loadFile("../files/common/README.md")
  );
  helpers.writeFile(
    `./${name}/package.json`,
    loadFile("../files/common/package.json")
  );

  helpers.writeFile(`./${name}/.env`, "");
  helpers.mkdirSync(`./${name}/scripts`);
  helpers.mkdirSync(`./${name}/scripts/templates`);
  helpers.mkdirSync(`./${name}/test`);

  // synchronously adds key value pair of the project name in the name field to package.json
  // helpers.addKeytoPackageJSON("name", name, name)
};

module.exports = { createCommonFilesAndFolders };
