const fs = require("fs");
const helpers = require("../../helpers");
const path = require("path");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const addBookshelfToScripts = async () => {
  // load files for scripts folder
  const bookshelf = loadFile("../files/scripts/backend/bookshelf.js");
  const model = loadFile("../files/scripts/backend/templates/bookshelf.js");
  const migration = loadFile("../files/scripts/backend/templates/migration.js");

  // load model to be placed into project directly
  const bookshelfModel = loadFile("../files/backend/models/bookshelf.js");

  // write loaded files to new project
  helpers.writeFile(`./${name}/server/models/bookshelf.js`, bookshelfModel);
  // the following files are loaded into the scripts folder
  helpers.writeFile(`./${name}/scripts/model.js`, bookshelf);
  helpers.writeFile(`./${name}/scripts/templates/migration.js`, migration);
  helpers.writeFile(`./${name}/scripts/templates/bookshelf.js`, model);

  helpers.addScriptToNewPackageJSON("model", "node scripts/model.js");
  await helpers.installKnexGlobal();
  helpers.modifyKnex();
  await helpers.install("pg bookshelf knex");
};

module.exports = {
  addBookshelfToScripts
};
