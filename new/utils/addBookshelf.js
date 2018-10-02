const fs = require("fs");
const helpers = require("../../helpers");
const path = require("path");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const addBookshelfToScripts = () => {
  // load files for scripts folder
  const bookshelf = loadFile("../files/scripts/backend/bookshelf.js");
  const model = loadFile("../files/scripts/backend/templates/bookshelf.js");
  const migration = loadFile("../files/scripts/backend/templates/migration.js");

  // load model to be placed into project directly
  const bookshelfModel = loadFile("../files/backend/models/bookshelf.js");

  // write loaded files to new project
  helpers.writeFile(`server/models/bookshelf.js`, bookshelfModel);
  // the following files are loaded into the scripts folder
  helpers.writeFile(`scripts/model.js`, bookshelf);
  helpers.writeFile(`scripts/templates/migration.js`, migration);
  helpers.writeFile(`scripts/templates/bookshelf.js`, model);

  helpers.addScriptToNewPackageJSON("model", "node scripts/model.js");
  helpers.installKnexGlobal();
  helpers.modifyKnex();
  helpers.addDependenciesToStore("pg bookshelf knex");
};

module.exports = {
  addBookshelfToScripts
};
