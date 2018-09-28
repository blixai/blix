const fs = require("fs");
const execSync = require("child_process").execSync;
const name = process.argv[3];
const log = console.log;
const chalk = require('chalk');
const store = require('./new/store')

const shouldUseYarn = () => {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

exports.installDependencies = packages => {
  try {
    process.chdir(`./${name}`)
    execSync(`npm install --save ${packages}`, {stdio:[0,1,2]});
    process.chdir('../')
  } catch(err) {
    process.chdir('../')
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.log('Something went wrong installing the packages')
    }
  }
};

exports.installDevDependencies = packages => {
  try {
    process.chdir(`./${name}`)
    execSync(`npm install --save-dev ${packages}`, {stdio:[0,1,2]})
    process.chdir('../')
  } catch(err) {
    process.chdir('../')
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.log('Something went wrong installing the packages')
    }
  }
};

exports.installKnexGlobal = () => {
  try {
    process.chdir(`./${name}`)
    execSync(`npm install -g knex`, {stdio: [0, 1, 2]})
    execSync(`createdb ${name}`, {stdio: [0, 1, 2]})
    process.chdir('../')
  } catch(err) {
    console.error(chalk.red`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`)
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
  this.mkdirSync(`./${name}/db`);
  this.mkdirSync(`./${name}/db/migrations`);
};

exports.addScriptToNewPackageJSON = (command, script) => {
  let buffer = fs.readFileSync(`./${name}/package.json`);
  let json = JSON.parse(buffer);
  json.scripts[command] = script;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${name}/package.json`, newPackage);
};

exports.writeFile = (filePath, file, message) => {
  try {
    fs.writeFileSync(filePath, file)
    filePath = filePath.slice(2)
    message ? log(message) : log(chalk`{green.bold create} ${filePath}`);
  } catch (err) {
    console.error("Couldn't create file", err)
  }
}

exports.mkdirSync = (folderPath, message) => {
  try {
    fs.mkdirSync(folderPath)
    folderPath = folderPath.slice(2)
    message ? log(message) : log(chalk`{green.bold create} ${folderPath}`)
  } catch (err) {
    log(chalk`\t{red.bold Error Making Directory ${folderPath} }`)
  }
}

exports.rename = (oldName, newName) => {
  try {
    fs.renameSync(oldName, newName)
  } catch (err) {
    store.env === 'development' ? log(err) : log()
  }
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
    this.mkdirSync('./scripts')
    this.mkdirSync('./scripts/templates')
  } else if (!fs.existsSync('./scripts/templates')) {
    this.mkdirSync('./scripts/templates')
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
  this.mkdirSync(`./db`)
  this.mkdirSync(`./db/migrations`)
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

exports.moveAllFilesInDir = (dirToSearch, dirToMoveTo) => {
  fs.readdirSync(dirToSearch).forEach(file => {
    if (file === 'actions' || file === 'components' || file === 'store' || file === 'services') {
      return
    }
    try {
      fs.renameSync(dirToSearch + '/' + file, dirToMoveTo + '/' + file)
    } catch(err) {
      console.error(`Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`, err)
    }
  })
}

exports.addDependenciesToStore = deps => {
  if (!store.dependencies) {
    store.dependencies = deps
  } else {
    store.dependencies += ' ' + deps
  }
}

exports.addDevDependenciesToStore = deps => {
  if (!store.devDependencies) {
    store.devDependencies = deps
  } else {
    store.devDependencies += ' ' + deps
  }
}

exports.installAllPackages = () => {
  if (store.dependencies) {
    this.installDependencies(store.dependencies)
  }

  if (store.devDependencies) {
    this.installDevDependencies(store.devDependencies)
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

