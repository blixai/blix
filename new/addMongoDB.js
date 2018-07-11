const path = require("path");
const fs = require("fs");
const name = process.argv[3];
const helpers = require("../helpers");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

//
const addMongooseToEnzo = () => {
  let model = loadFile("./templates/enzoCreateMongooseModel.js");
  let schemaTemplate = loadFile("./templates/schemaTemplate.js");

  helpers.writeFile(`./${name}/scripts/model.js`, model);
  helpers.writeFile(
    `./${name}/scripts/templates/schemaTemplate.js`,
    schemaTemplate
  );

  helpers.addScriptToNewPackageJSON("model", "node scripts/model.js", name);
  addMongoDBToProject();
};

const addMongoDBToProject = () => {
  let server = fs
    .readFileSync(`./${name}/server/server.js`, "utf8")
    .toString()
    .split("\n");
  server.splice(
    0,
    0,
    `\nlet mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO)\n`
  );
  let mongoAddedServer = server.join("\n");

  helpers.writeFile(`./${name}/server/server.js`, mongoAddedServer);
  helpers.writeFile(
    `./${name}/.env`,
    `MONGO="${`mongodb://localhost/${name}`}"`
  );
};

module.exports = {
  addMongooseToEnzo
};
