const fs = require("fs");
const helpers = require("../helpers");
const path = require("path");
const name = process.argv[3];

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

const addBookshelfToEnzo = () => {
  // load files
  let bookshelf = loadFile("./templates/bookshelf.js");
  let enzoCreateBookshelfModel = loadFile(
    "./templates/enzoCreateBookshelfModel.js"
  );
  let migrationTemplate = loadFile("./templates/migrationTemplate.js");
  let enzoBookshelfModelTemplate = loadFile(
    "./templates/enzoBookshelfModelTemplate.js"
  );

  // write loaded files to new project
  helpers.writeFile(`./${name}/server/models/bookshelf.js`, bookshelf);
  helpers.writeFile(
    `./${name}/scripts/enzoCreateBookshelfModel.js`,
    enzoCreateBookshelfModel
  );
  helpers.writeFile(
    `./${name}/scripts/templates/migrationTemplate.js`,
    migrationTemplate
  );
  helpers.writeFile(
    `./${name}/scripts/templates/enzoBookshelfModelTemplate.js`,
    enzoBookshelfModelTemplate
  );

  helpers.addScriptToNewPackageJSON(
    "model",
    "node scripts/enzoCreateBookshelfModel.js",
    name
  );
};

module.exports = {
  addBookshelfToEnzo
};
