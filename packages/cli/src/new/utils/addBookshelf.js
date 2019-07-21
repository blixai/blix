const helpers = require("@blix/core");
const { 
  loadFile,
  writeFile,
  addScriptToPackageJSON,
  modifyKnex,
  installKnexGlobal,
  addDependenciesToStore
} = helpers


const addBookshelfToScripts = () => {
  // load files for scripts folder
  const bookshelf = loadFile("scripts/backend/bookshelf.js");
  const model = loadFile("scripts/backend/templates/bookshelf.js");
  const migration = loadFile("scripts/backend/templates/migration.js");

  // load model to be placed into project directly
  const bookshelfModel = loadFile("backend/models/bookshelf.js");

  // write loaded files to new project
  writeFile(`server/models/bookshelf.js`, bookshelfModel);
  // the following files are loaded into the scripts folder
  writeFile(`scripts/model.js`, bookshelf);
  writeFile(`scripts/templates/migration.js`, migration);
  writeFile(`scripts/templates/bookshelf.js`, model);

  addScriptToPackageJSON("model", "node scripts/model.js");
  installKnexGlobal();
  modifyKnex();
  addDependenciesToStore("pg bookshelf knex");
};

module.exports = {
  addBookshelfToScripts
};
