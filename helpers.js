const fs = require("fs");
const execSync = require("child_process").execSync;
const log = console.log;
const name = process.argv[3];

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
    process.chdir(`./${name}`)
    execSync(`npm install --save ${packages}`, {stdio:[0,1,2]});
    process.chdir('../')
  } catch(err) {
    console.error(err)
  }
};

exports.installDevDependencies = packages => {
  try {
    process.chdir(`./${name}`)
    execSync(`npm install --save-dev ${packages}`, {stdio:[0,1,2]})
    process.chdir('../')
  } catch(err) {
    console.error(err)
  }
};

exports.installKnexGlobal = () => {
  try {
    process.chdir(`./${name}`)
    execSync(`npm install -g knex`, {stdio: [0, 1, 2]})
    execSync(`createdb ${name}`, {stdio: [0, 1, 2]})
    process.chdir('../')
  } catch(err) {
    console.error(err)
    process.chdir('../')
  }
};

exports.addScript = (command, script) => {
  let buffer = fs.readFileSync("package.json");
  let json = JSON.parse(buffer);
  json.scripts[command] = script;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync("package.json", newPackage);
};

exports.modifyKnex = () => {
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
  if (fs.existsSync(`./${name}/knexfile.js`)) {
    fs.truncateSync(`./${name}/knexfile.js`, 0, function() {
      console.log("done");
    });
    fs.appendFile(`./${name}/knexfile.js`, newKnex, err => {
      if (err) throw err;
    });
  } else {
    fs.writeFileSync(`./${name}/knexfile.js`, newKnex)
  }
  fs.mkdirSync(`./${name}/db`);
  fs.mkdirSync(`./${name}/db/migrations`);
};

exports.addScriptToNewPackageJSON = (command, script) => {
  let buffer = fs.readFileSync(`./${name}/package.json`);
  let json = JSON.parse(buffer);
  json.scripts[command] = script;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
};

exports.writeFile = (filePath, file, message) => {
  fs.writeFile(filePath, file, err => {
    if (err) throw err;
    message ? log(message) : "";
  });
};

exports.rename = (oldName, newName) => {
  fs.rename(oldName, newName, err => {
    if (err) throw err;
  });
};

exports.addKeytoPackageJSON = (key, value) => {
  const buffer = fs.readFileSync(`./${name}/package.json`);
  const json = JSON.parse(buffer);
  json[key] = value;
  const newPackageJSON = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackageJSON);
};

