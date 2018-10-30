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
  helpers.addScriptToPackageJSON("model", "node scripts/model.js");
  this.addMongoDBToProject();
};

exports.addMongoDBToProject = () => {
  let name
  if (store.name) {
    name = store.name + '/'
  } else {
    name = ''
  }
  let connectionString = `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
  helpers.insert(`./${name}server/server.js`, connectionString, 0)

  this.envFile()
  
  helpers.addDependenciesToStore("mongo mongoose")
};

exports.envFile = () => {
  let name
  if (store.name) {
    name = store.name
  } else {
    name = helpers.getCWDName()
  }

  try {
    if (fs.existsSync('./.env')) {
      helpers.appendFile('.env', `\nMONGO=${`mongodb://localhost:27017/${name}`}`)
    } else {
      helpers.writeFile('.env', `MONGO=${`mongodb://localhost:27017/${name}`}`)
    }
  } catch (err) {
    console.error('Failed to find, create or append .env file')
  }
}

