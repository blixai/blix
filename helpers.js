let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
let execSync = require('child_process').execSync;


let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

exports.install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages}`, { silent: true })
  } else {
    shell.exec(`npm install --save ${packages}`, { silent: true })
  }
}

exports.installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`, { silent: true })
  } else {
    shell.exec(`npm install --save-dev ${packages}`, { silent: true })
  }
}

exports.installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex', { silent: true })
    shell.exec('knex init', { silent: true })
  } else {
    shell.exec('npm install -g knex', { silent: true })
    shell.exec('knex init', { silent: true })
  }
}

exports.addScript = (command, script) => {
  let buffer = fs.readFileSync('./package.json')
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync('package.json', newPackage)
}

exports.modifyKnex = (name) => {
  let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      fs.mkdirSync(`./db`)
      fs.mkdirSync(`./db/migrations`)
    })
  }
}

exports.addScriptToNewPackageJSON = (command, script, name) => {
  let buffer = fs.readFileSync(`./${name}/package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./${name}/package.json`, newPackage)
}


exports.writeFile = (filePath, file) => {
  fs.writeFile(filePath, file, (err) => {
    if (err) throw err 
  })
}


// exports.loadFile = filePath => {
//   return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
// }

