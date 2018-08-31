const fs = require("fs");
const execSync = require("child_process").execSync;
const name = process.argv[3];
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
    console.error(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`)
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
  const buffer = fs.readFileSync(`./${name}/package.json`);
  const json = JSON.parse(buffer);
  json[key] = value;
  const newPackageJSON = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackageJSON);
};

exports.installDependenciesToExistingProject = packages => {
  checkIfPackageJSONExists(packages)
  try {
    execSync(`npm install --save ${packages}`, { stdio: [0, 1, 2] })
  } catch (err) {
    console.error(err)
  }
}

exports.installDevDependenciesToExistingProject = packages => {
  checkIfPackageJSONExists(packages)
  try {
    execSync(`npm install --save-dev ${packages}`, { stdio: [0, 1, 2] })
  } catch (err) {
    console.error(err)
  }
}

exports.checkScriptsFolderExist = () => {
  if (!fs.existsSync('./scripts')) {
    fs.mkdirSync('./scripts')
    fs.mkdirSync('./scripts/templates')
  } else if (!fs.existsSync('./scripts/templates')) {
    fs.mkdirSync('./scripts/templates')
  }
}

exports.getCWDName = () => {
  let name = process.cwd()
  name = name.split('/')
  name = name.pop()
  return name
}

exports.modifyKnexExistingProject = (cwd) => {
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${cwd}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`
  if (fs.existsSync(`./knexfile.js`)) {
    fs.truncateSync(`./knexfile.js`, 0, function() {
      console.log("done")
    })
    fs.appendFile(`./knexfile.js`, newKnex, err => {
      if (err) throw err
    })
  } else {
    fs.writeFileSync(`./knexfile.js`, newKnex)
  }
  fs.mkdirSync(`./db`)
  fs.mkdirSync(`./db/migrations`)
}

exports.checkIfScriptIsTaken = (scriptName) => {
  try {
    let buffer = fs.readFileSync('./package.json')
    let packageJson = JSON.parse(buffer)
    return scriptName in packageJson['scripts']
  } catch (err) {
    return false
  }
}

// local helpers 

const checkIfPackageJSONExists = packages => {
  if (!fs.existsSync('package.json')) {
    console.error('package.json not found. Unable to install packages')
    console.error(`You will need to install ${packages} yourself`)
    return 
  }
}

