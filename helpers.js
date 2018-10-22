const fs = require("fs");
const execSync = require("child_process").execSync;
const log = console.log;
const chalk = require('chalk');
const store = require('./new/store')
const inquirer = require('inquirer')
const prompt   = inquirer.prompt
const { yarnPrompt } = require('./new/prompts')

exports.canUseYarn = () => {
  if (fs.existsSync('yarn.lock')) {
    store.useYarn = true
    return true
  } else if (fs.existsSync('package-lock.json')) {
    store.useYarn = false
    return false
  }
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

const yarn = async () => {
  if (this.canUseYarn() && store.useYarn === '') {
    let yarnAnswer = await prompt([yarnPrompt])
    store.useYarn = yarnAnswer.yarn
  }
}

exports.yarn = yarn

exports.installDependencies = packages => {
  try {
    process.chdir(`./${store.name}`)
    if (store.useYarn) {
      execSync(`yarn add ${packages}`, {stdio:[0,1,2]})
    } else {
      execSync(`npm install --save ${packages}`, {stdio:[0,1,2]});
    }
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
    process.chdir(`./${store.name}`)
    if (store.useYarn) {
      execSync(`yarn add ${packages} --dev`, {stdio:[0,1,2]})
    } else {
      execSync(`npm install --save-dev ${packages}`, {stdio:[0,1,2]})
    }
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
  let name = store.name
  try {
    process.chdir(`./${name}`)
    if (store.useYarn) {
      execSync(`yarn add knex global`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install -g knex`, {stdio: [0, 1, 2]})
    }
    execSync(`createdb ${name}`, {stdio: [0, 1, 2]})
    process.chdir('../')
  } catch(err) {
    if (store.env === 'development') {
      console.error(err) 
    } else {
      console.error(chalk.red`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`)
    }
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
    console.log(chalk`{cyan insert} ${command} script into package.json`)
  } catch (err) {
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.error(chalk.red`Failed to add script ${command} to package.json`)
    }
  }
};

exports.modifyKnex = () => {
  let name = store.name
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
  if (fs.existsSync(`./${name}/knexfile.js`)) {
    fs.truncateSync(`./${name}/knexfile.js`, 0)
    this.appendFile(`knexfile.js`, newKnex)
  } else {
    this.writeFile(`knexfile.js`, newKnex)
  }
  this.mkdirSync(`db`);
  this.mkdirSync(`db/migrations`);
};

exports.addScriptToNewPackageJSON = (command, script) => {
  try {
    let buffer = fs.readFileSync(`${store.name}/package.json`);
    let json = JSON.parse(buffer);
    json.scripts[command] = script;
    let newPackage = JSON.stringify(json, null, 2);
    fs.writeFileSync(`./${store.name}/package.json`, newPackage);
  } catch (err) {
    console.error(err)
  }
};

exports.writeFile = (filePath, file, message) => {
  if (!filePath) {
    return console.error(chalk`{red No filePath specified.}`)
  } else if (!file) {
    file = ''
  }
  try {
    filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
    let filePathLog = filePath.slice(2)
    if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file)
        message ? console.log(message) : console.log(chalk`{yellow mutate} ${filePathLog}`);
    } else {
      fs.writeFileSync(filePath, file)
      message ? console.log(message) : console.log(chalk`{green create} ${filePathLog}`);
    }
  } catch (err) {
    store.env === 'development' ? console.error(chalk`{red Couldn't create file ${filePath}. ERROR: ${err} }`) : console.error(chalk`{red Couldn't create file ${filePath}}`)
  }
}

exports.mkdirSync = (folderPath, message) => {
  if (!folderPath && !store.name) {
    return console.error(chalk`{red Unable to create folder}`)
  } else if (!folderPath) {
    folderPath = ''
  }

  try {
    folderPath = store.name ? `./${store.name}/` + folderPath : './' + folderPath
    let folderPathLog = folderPath.slice(2)
    fs.mkdirSync(folderPath)
    message ? console.log(message) : console.log(chalk`{green create} ${folderPathLog}`)
  } catch (err) {
    if (store.env === 'development') {
      console.error(chalk`{red Error making directory ${folderPath}. ERROR: ${err} }`) 
    } else {
      console.error(chalk`\t{red Error making directory ${folderPath} }`)
    }
  }
}

exports.rename = (oldName, newName) => {
  try {
    fs.renameSync(oldName, newName)
    oldName = oldName.slice(2)
    newName = newName.slice(2)
    log(chalk`{yellow move}   ${oldName} into ${newName}`)
  } catch (err) {
    store.env === 'development' ? log(err) : log()
  }
};

// exports.addKeytoPackageJSON = (key, value) => {
//   const buffer = fs.readFileSync(`./${name}/package.json`);
//   const json = JSON.parse(buffer);
//   json[key] = value;
//   const newPackageJSON = JSON.stringify(json, null, 2);
//   fs.writeFileSync(`./${name}/package.json`, newPackageJSON);
// };

exports.installDependenciesToExistingProject = packages => {
  checkIfPackageJSONExists(packages)
  try {
    if (store.useYarn) {
      execSync(`yarn add ${packages}`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install --save ${packages}`, { stdio: [0, 1, 2] })
    }
  } catch (err) {
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.error(chalk`\t{red Error installing ${packages} }`)
    }
  }
}



exports.installDevDependenciesToExistingProject = packages => {
  checkIfPackageJSONExists(packages)
  try {
    if (store.useYarn) {
      execSync(`yarn add ${packages} --dev`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install --save-dev ${packages}`, { stdio: [0, 1, 2] })
    }
  } catch (err) {
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.error(chalk`\t{red Error installing ${packages} }`)
    }
  }
}



exports.checkScriptsFolderExist = () => {
  if (!fs.existsSync('./scripts')) {
    this.mkdirSync('scripts')
    this.mkdirSync('scripts/templates')
  } else if (!fs.existsSync('./scripts/templates')) {
    this.mkdirSync('scripts/templates')
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
    fs.truncateSync(`./knexfile.js`, 0)
    this.appendFile(`./knexfile.js`, newKnex)
  } else {
    this.writeFile(`knexfile.js`, newKnex)
  }
  this.mkdirSync(`db`)
  this.mkdirSync(`db/migrations`)
}

// current implementation does not take into account store.name. Should that change? - Dev
exports.appendFile = (file, stringToAppend) => {
  if (!file) {
    return console.error(chalk`{red File not provided.}`)
  } else if (!stringToAppend) {
    return console.error(chalk`{red No string to append provided.}`)
  }

  try {
    file = store.name ? `./${store.name}/` + file : './' + file
    fs.appendFileSync(file, stringToAppend)
    file = file.slice(2)
    log(chalk`{cyan append} ${file}`)
  } catch (err) {
    store.env === 'development' ? console.error(chalk`{red Failed to append ${file}. ERROR: ${err}}`) : console.error(chalk.red`Failed to append ${file}`)
  }
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
      this.rename(dirToSearch + '/' + file, dirToMoveTo + '/' + file)
    } catch(err) {
      console.error(chalk.red`Error: Couldn't move ${file} from ${dirToSearch} into ${dirToMoveTo}`, err)
    }
  })
  try {
    fs.rmdirSync(dirToSearch)
    dirToSearch = dirToSearch.slice(2)
    console.log(chalk`{red delete} ${dirToSearch}`)
  } catch (err) {
    store.env === 'development' ? log(err) : log(`Failed to delete ${dirToSearch}`)
  }
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


exports.installAllPackagesToExistingProject =  () => {
  if (store.dependencies) {
    this.installDependenciesToExistingProject(store.dependencies)
  }

  if (store.devDependencies) {
    this.installDevDependenciesToExistingProject(store.devDependencies)
  }
}

const insert = async (fileToInsertInto, whatToInsert, lineToInsertAt) => {
  let filePrompt = { type: 'list', name: 'lineNumber', message: 'Select a line to insert below', choices: [] }
  // if no lineToInsertAt then readfile and pass to inquirer prompt
  try {
    let file = fs.readFileSync(fileToInsertInto, 'utf8').toString().split('\n')
    if (lineToInsertAt === undefined) {
      filePrompt.choices = file
      let lineToInsertAfter = prompt([filePrompt])
      lineToInsertAt = file.indexOf(lineToInsertAfter) + 1

    } else if (isNaN(Number(lineToInsertAt))) {
      let indexToFind = file.indexOf(lineToInsertAt)
      if (indexToFind !== -1) {
        lineToInsertAt = indexToFind + 1
      } else {
        lineToInsertAt = file.length - 1
      }
    }
    // insert at lineToInsertAt
    file.splice(lineToInsertAt, 0, whatToInsert)
    file = file.join('\n')
    fs.writeFileSync(fileToInsertInto, file)
    fileToInsertInto = fileToInsertInto.slice(2)
    log(chalk`{cyan insert} ${fileToInsertInto}`)
  } catch (err) {
    store.env === 'development' ? log(chalk.red`${console.error(err)}`) : log(chalk.red`Failed to insert into ${fileToInsertInto.slice(2)}`)
  }
}

exports.insert = insert

// local helpers 

const checkIfPackageJSONExists = packages => {
    if (!fs.existsSync('package.json')) {
      console.error('package.json not found. Unable to install packages')
      console.error(`You will need to install ${packages} yourself`)
      return 
    }
}

