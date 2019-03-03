const helpers = require("../../../index");
const execSync = require('child_process').execSync;
const chalk = require('chalk')
const { loadFile, store } = helpers

/// create things like .gitignore, scripts folder, scripts templates folder, README.md, .env, and package.json
const createCommonFilesAndFolders = () => {
  console.log(
    "Creating the project and downloading packages, this may take a moment"
  );
  try{
    // creates new project folder first, this is important for all new projects
    helpers.mkdirSync(``)
    try {
      process.chdir(`./${store.name}`)
      execSync('git init')
      process.chdir('../')
    } catch (err) {
      if (store.env === 'development') {
        console.error(err)
      } else {
        console.error(chalk.red`Error: failed to initialize a git repository`)
      }
      process.chdir('../')
    }
    helpers.writeFile(
      `.gitignore`,
      loadFile("common/gitIgnore.txt")
    );
    helpers.writeFile(
      `README.md`,
      loadFile("common/README.md")
    );
    helpers.writeFile(
      `package.json`,
      loadFile("common/package.json")
    );

    helpers.writeFile(`.env`, "");
    helpers.mkdirSync(`scripts`);
    helpers.mkdirSync(`scripts/templates`);
    helpers.mkdirSync(`test`);
  } catch(err){
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.error(chalk.red`Error Creating Common Files`)
    }
  }
};

module.exports = { createCommonFilesAndFolders };
