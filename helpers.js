const fs = require("fs");
const execSync = require("child_process").execSync;
const log = console.log;
const chalk = require('chalk');
const store = require('./new/store')
const inquirer = require('inquirer')
const prompt   = inquirer.prompt

const canUseYarn = () => {
  if (fs.existsSync('yarn.lock')) {
    store.useYarn = { yarn: true }
    return true
  }
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

const yarnPrompt = {
  type: 'confirm',
  message: 'Do you want to use Yarn to install packages',
  name: "yarn"
}

const checkIfNeedYarnAnswer = async () => {
  if (canUseYarn() && store.useYarn === '') {
    let yarnAnswer = await prompt([yarnPrompt])
    store.useYarn = yarnAnswer.yarn
  }
}

exports.checkIfNeedYarnAnswer = checkIfNeedYarnAnswer

const installDependencies = async packages => {
  await checkIfNeedYarnAnswer()
  try {
    process.chdir(`./${store.name}`)
    if (store.useYarn) {
      execSync(`yarn add ${packages}`, {stdio:[0,1,2]})
    } else {
      execSync(`npm install --save ${packages}`, {stdio:[0,1,2]});
    }
    process.chdir('../')
    return
  } catch(err) {
    process.chdir('../')
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.log('Something went wrong installing the packages')
    }
    return
  }
};

exports.installDependencies = installDependencies

const installDevDependencies = async packages => {
  await checkIfNeedYarnAnswer()
  try {
    process.chdir(`./${store.name}`)
    if (store.useYarn) {
      execSync(`yarn add ${packages} --dev`, {stdio:[0,1,2]})
    } else {
      execSync(`npm install --save-dev ${packages}`, {stdio:[0,1,2]})
    }
    process.chdir('../')
    return
  } catch(err) {
    process.chdir('../')
    if (store.env === 'development') {
      console.error(err)
    } else {
      console.log('Something went wrong installing the packages')
    }
    return
  }
};

exports.installDevDependencies = installDevDependencies

const installKnexGlobal = async () => {
  let name = store.name
  await checkIfNeedYarnAnswer()
  try {
    process.chdir(`./${name}`)
    if (store.useYarn) {
      execSync(`yarn add knex global`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install -g knex`, {stdio: [0, 1, 2]})
    }
    execSync(`createdb ${name}`, {stdio: [0, 1, 2]})
    process.chdir('../')
    return
  } catch(err) {
    console.error(chalk.red`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`)
    process.chdir('../')
    return
  }
};

exports.installKnexGlobal = installKnexGlobal

exports.addScript = (command, script) => {
  try {
    let buffer = fs.readFileSync("package.json");
    let json = JSON.parse(buffer);
    json.scripts[command] = script;
    let newPackage = JSON.stringify(json, null, 2);
    fs.writeFileSync("package.json", newPackage);
    log(chalk`{cyan insert} ${command} script into package.json`)
  } catch (err) {
    console.error("Failed to add script to package.json: ", err)
  }
};

exports.modifyKnex = () => {
  let name = store.name
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
  if (fs.existsSync(`./${name}/knexfile.js`)) {
    fs.truncateSync(`./${name}/knexfile.js`, 0)
    this.appendFile(`./${name}/knexfile.js`, newKnex)
  } else {
    this.writeFile(`knexfile.js`, newKnex)
  }
  this.mkdirSync(`db`);
  this.mkdirSync(`db/migrations`);
};

exports.addScriptToNewPackageJSON = (command, script) => {
  let buffer = fs.readFileSync(`${store.name}/package.json`);
  let json = JSON.parse(buffer);
  json.scripts[command] = script;
  let newPackage = JSON.stringify(json, null, 2);
  fs.writeFileSync(`./${store.name}/package.json`, newPackage);
};

exports.writeFile = (filePath, file, message) => {
  try {
    filePath = store.name ? `./${store.name}/` + filePath : './' + filePath
    let filePathLog = filePath.slice(2)
    if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file)
        message ? log(message) : log(chalk`{yellow mutate} ${filePathLog}`);
    } else {
      fs.writeFileSync(filePath, file)
      message ? log(message) : log(chalk`{green create} ${filePathLog}`);
    }
  } catch (err) {
    console.error("Couldn't create file", err)
  }
}

exports.mkdirSync = (folderPath, message) => {
  try {
    folderPath = store.name ? `./${store.name}/` + folderPath : './' + folderPath
    folderPath = folderPath.slice(2)
    fs.mkdirSync(folderPath)
    message ? log(message) : log(chalk`{green create} ${folderPath}`)
  } catch (err) {
    log(chalk`\t{red Error Making Directory ${folderPath} }`)
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

const installDependenciesToExistingProject = async packages => {
  await checkIfNeedYarnAnswer()
  checkIfPackageJSONExists(packages)
  try {
    if (store.useYarn) {
      execSync(`yarn add ${packages}`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install --save ${packages}`, { stdio: [0, 1, 2] })
    }
    return
  } catch (err) {
    store.env === 'development' ? log(chalk.red`${err}`) : ""
    return
  }
}

exports.installDependenciesToExistingProject = installDependenciesToExistingProject


const installDevDependenciesToExistingProject = async packages => {
  checkIfPackageJSONExists(packages)
  await checkIfNeedYarnAnswer()
  try {
    if (store.useYarn) {
      execSync(`yarn add ${packages} --dev`, { stdio: [0, 1, 2] })
    } else {
      execSync(`npm install --save-dev ${packages}`, { stdio: [0, 1, 2] })
    }
    return
  } catch (err) {
    store.env === 'development' ? log(chalk.red`${err}`) : ""
    return
  }
}

exports.installDevDependenciesToExistingProject = installDevDependenciesToExistingProject


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

exports.appendFile = (file, stringToAppend) => {
  try {
    fs.appendFileSync(file, stringToAppend)
    log(chalk`{cyan append} ${file}`)
  } catch (err) {
    store.env === 'development' ? log(err) : log(chalk.red`Failed to append ${file}`)
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

const installAllPackages = async () => {
  if (store.dependencies) {
    await this.installDependencies(store.dependencies)
  }

  if (store.devDependencies) {
    await this.installDevDependencies(store.devDependencies)
  }

}

exports.installAllPackages = installAllPackages

const installAllPackagesToExistingProject = async () => {
  if (store.dependencies) {
    await this.installDependenciesToExistingProject(store.dependencies)
  }

  if (store.devDependencies) {
    await this.installDevDependenciesToExistingProject(store.devDependencies)
  }
}

exports.installAllPackagesToExistingProject = installAllPackagesToExistingProject


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
        lineToInsertAt = 0
      }
    }
    // insert at lineToInsertAt
    file.splice(lineToInsertAt, 0, whatToInsert)
    file = file.join('\n')
    fs.writeFileSync(fileToInsertInto, file)
    log(chalk`{cyan insert} ${fileToInsertInto}`)
  } catch (err) {
    store.env === 'development' ? log(chalk.red`err`) : log(chalk.red`Failed to insert into ${fileToInsertInto.slice(2)}`)
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

