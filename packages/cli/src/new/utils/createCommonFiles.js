const chalk = require('chalk')
const { 
  loadFile, 
  store,
  mkdirSync,
  writeFile,
  execute,
  logTaskStatus,
  logError
} = require("@blix/core")

/// create things like .gitignore, scripts folder, scripts templates folder, README.md, .env, and package.json
const createCommonFilesAndFolders = () => {
  console.log(
    "Creating the project and downloading packages, this may take a moment"
  );
  try{
    // creates new project folder first, this is important for all new projects
    mkdirSync(``)
    try {
      process.chdir(`./${store.name}`)
      execute('git init')
      process.chdir('../')
    } catch (err) {
      if (store.env === 'development') {
        logError(err)
      } else {
        logError('Error: failed to initialize a git repository')
      }
      process.chdir('../')
    }
    writeFile(
      `.gitignore`,
      loadFile("common/gitIgnore.txt")
    );
    writeFile(
      `README.md`,
      loadFile("common/README.md")
    );
    writeFile(
      `package.json`,
      loadFile("common/package.json")
    );

    writeFile(`.env`, "");
    mkdirSync(`scripts`);
    mkdirSync(`scripts/templates`);
    mkdirSync(`test`);
  } catch(err){
    if (store.env === 'development') {
      logError(err)
    } else {
      logError('Error Creating Common Files')
    }
  }
};

module.exports = { createCommonFilesAndFolders };
