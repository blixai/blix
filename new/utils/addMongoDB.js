const path = require("path");
const fs = require("fs");
const name = process.argv[3];
const helpers = require("../../helpers");

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

//
const addMongooseToScripts = () => {
  let model = loadFile("../files/scripts/backend/mongoose.js");
  let schemaTemplate = loadFile(
    "../files/scripts/backend/templates/mongoose.js"
  );
  helpers.writeFile(`./${name}/scripts/model.js`, model);
  helpers.writeFile(
    `./${name}/scripts/templates/schemaTemplate.js`,
    schemaTemplate
  );

  helpers.addScriptToNewPackageJSON("model", "node scripts/model.js");
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
    `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
  );
  let mongoAddedServer = server.join("\n");

  helpers.writeFile(`./${name}/server/server.js`, mongoAddedServer);
  helpers.writeFile(
    `./${name}/.env`,
    `MONGO=${`mongodb://localhost:27017/${name}`}`
  );
  helpers.install("mongo mongoose")
};

module.exports = {
  addMongooseToScripts
};
