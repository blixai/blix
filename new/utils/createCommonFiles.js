const fs = require("fs");
const path = require("path");
const helpers = require("../../helpers");
const execSync = require('child_process').execSync;
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

/// create things like .gitignore, scripts folder, scripts templates folder, README.md, .env, and package.json
const createCommonFilesAndFolders = () => {
  console.log(
    "Creating the project and downloading packages, this may take a moment"
  );
  // creates new project folder first, this is important for all new projects
  fs.mkdirSync(`./${name}`);
  process.chdir(`./${name}`)
  execSync('git init')
  process.chdir('../')
  helpers.writeFile(
    `./${name}/.gitignore`,
    loadFile("../files/common/gitIgnore.txt")
  );
  helpers.writeFileSync(
    `./${name}/README.md`,
    loadFile("../files/common/README.md")
  );
  fs.writeFileSync(
    `./${name}/package.json`,
    loadFile("../files/common/package.json")
  );

  helpers.writeFileSync(`./${name}/.env`, "");
  fs.mkdirSync(`./${name}/scripts`);
  fs.mkdirSync(`./${name}/scripts/templates`);
  fs.mkdirSync(`./${name}/test`);

  // synchronously adds key value pair of the project name in the name field to package.json
  // helpers.addKeytoPackageJSON("name", name, name)
};

module.exports = { createCommonFilesAndFolders };
