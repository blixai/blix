const path = require("path");
const fs = require("fs");
const helpers = require("../../helpers");
const store = require('../store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

//
exports.addMongooseToScripts = () => {
  let model = loadFile("../files/scripts/backend/mongoose.js");
  let schemaTemplate = loadFile(
    "../files/scripts/backend/templates/mongoose.js"
  );
  helpers.writeFile(`scripts/model.js`, model);
  helpers.writeFile(`scripts/templates/schemaTemplate.js`, schemaTemplate);
  helpers.addScript("model", "node scripts/model.js");
  this.addMongoDBToProject();
};

exports.addMongoDBToProject = () => {
  let connectionString = `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
  helpers.insert(`./${store.name}/server/server.js`, connectionString, 0)
  helpers.appendFile(`.env`,`MONGO=${`mongodb://localhost:27017/${store.name}`}`);
  helpers.addDependenciesToStore("mongo mongoose")
};

