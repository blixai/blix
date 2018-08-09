const fs = require("fs");
const execSync = require("child_process").execSync;
let store = require('./new/store')
const log = console.log;

const shouldUseYarn = () => {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

exports.install = packages => {
  try {
    process.chdir(`./${store.name}`)
    execSync(`npm install --save ${packages}`, {stdio:[0,1,2]});
    process.chdir('../')
  } catch(err) {
    console.error(err)
  }
};

exports.installDevDependencies = packages => {
  try {
    process.chdir(`./${store.name}`)
    execSync(`npm install --save-dev ${packages}`, {stdio:[0,1,2]})
    process.chdir('../')
  } catch(err) {
    console.error(err)
  }
};

exports.installKnexGlobal = () => {
  try {
    process.chdir(`./${store.name}`)
    execSync(`npm install -g knex`, {stdio: [0, 1, 2]})
    execSync(`createdb ${store.name}`, {stdio: [0, 1, 2]})
    process.chdir('../')
  } catch(err) {
    console.error(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${store.name}`)
    process.chdir('../')
  }
};

exports.addScript = (command, script) => {
  try {
    let buffer = fs.readFileSync("package.json");
    let json = JSON.parse(buffer);
    json.scripts[command] = script;
    let newPackage = JSON.stringify(json, null, 2);
    fs.writeFileSync("package.json", newPackage);
  } catch (err) {
    console.error("Failed to add script to package.json: ", err)
  }
};

exports.modifyKnex = () => {
  
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${store.name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
  if (fs.existsSync(`./${store.name}/knexfile.js`)) {
    fs.truncateSync(`./${store.name}/knexfile.js`, 0, function() {
      console.log("done");
    });
    fs.appendFile(`./${store.name}/knexfile.js`, newKnex, err => {
      if (err) throw err;
    });
  } else {
    fs.writeFileSync(`./${store.name}/knexfile.js`, newKnex)
  }
  fs.mkdirSync(`./${store.name}/db`);
  fs.mkdirSync(`./${store.name}/db/migrations`);
};

exports.addScriptToNewPackageJSON = (command, script) => {
  let buffer = fs.readFileSync(`./${store.name}/package.json`);
  let json = JSON.parse(buffer);
  json.scripts[command] = script;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${store.name}/package.json`, newPackage);
};

exports.writeFile = (filePath, file, message) => {
  fs.writeFile(filePath, file, err => {
    if (err) console.error(err);
    message ? log(message) : "";
  });
};

exports.writeFileSync = (filePath, file, message) => {
  try {
    fs.writeFileSync(filePath, file)
    message ? log(message) : "";
  } catch (err) {
    console.error("Couldn't create file", err)
  }
}

exports.rename = (oldName, newName) => {
  fs.rename(oldName, newName, err => {
    if (err) throw err;
  });
};

exports.addKeytoPackageJSON = (key, value) => {
  const buffer = fs.readFileSync(`./${store.name}/package.json`);
  const json = JSON.parse(buffer);
  json[key] = value;
  const newPackageJSON = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${store.name}/package.json`, newPackageJSON);
};

