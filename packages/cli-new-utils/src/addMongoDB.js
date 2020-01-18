const fs = require("fs");
const { 
  loadFile,
  store,
  writeFile,
  addScriptToPackageJSON,
  insert,
  addDependenciesToStore,
  appendFile,
  getCWDName
} = require("@blixai/core");


//
exports.addMongooseToScripts = () => {
  let model = loadFile("scripts/backend/mongoose.js");
  let schemaTemplate = loadFile(
    "scripts/backend/templates/mongoose.js"
  );
  writeFile(`scripts/model.js`, model);
  writeFile(`scripts/templates/schemaTemplate.js`, schemaTemplate);
  addScriptToPackageJSON("model", "node scripts/model.js");
  this.addMongoDBToProject();
};

exports.addMongoDBToProject = () => {
  let name = store.name ? store.name + '/' : name = ''
  
  let connectionString = `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
  insert(`./${name}server/server.js`, connectionString, 0)

  this.envFile()
  
  addDependenciesToStore("mongo mongoose")
};

exports.envFile = () => {
  let name
  if (store.name) {
    name = store.name
  } else {
    name = getCWDName()
  }

  try {
    if (fs.existsSync('./.env')) {
      appendFile('.env', `\nMONGO=${`mongodb://localhost:27017/${name}`}`)
    } else {
      writeFile('.env', `MONGO=${`mongodb://localhost:27017/${name}`}`)
    }
  } catch (err) {
    console.error('Failed to find, create or append .env file')
  }
}

