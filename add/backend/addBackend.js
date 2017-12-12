let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;

let BE = require('./create')

let inquirer = require('inquirer')
let prompt = inquirer.prompt

let database = {
  type: 'list',
  message: 'Database:',
  name: 'db',
  choices: [
    { name: 'MongoDB' , value: 'm'  },
    { name: 'Postgres', value: 'p'  },
    { name: 'None'                  }
  ]
}

let dbName = {
  type: 'input',
  message: 'What is the database name:',
  name: 'name'
}

let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn() 
  if (yarn) {
    shell.exec(`yarn add ${packages}`, {silent:true})
  } else {
    shell.exec(`npm install --save ${packages}`, {silent:true})
  }
}

let installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`, {silent:true})
  } else {
    shell.exec(`npm install --save-dev ${packages}`, {silent:true})
  }
}

let installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex', {silent:true})
    shell.exec('knex init', {silent:true})
  } else {
    shell.exec('npm install -g knex', {silent:true})
    shell.exec('knex init', {silent:true})
  }
}

let addScript = (command, script) => {
  let buffer = fs.readFileSync('package.json')
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync('package.json', newPackage)
}


let addBackend = () => {
  process.stdout.write('\033c')
  prompt([database]).then(database => {
    let answer = database.db 
    if (answer === 'p') {
      // postgres database
      postgres()
    } else if (answer === 'm') {
      // express with mongodb
      mongo()
    } else {
      // backend without db
      backendOnly()
    }
  })
}

let postgres = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.backendOnly()
    console.log('Downloading dependencies and creating files, this may take a moment')
    install('express nodemon pg knex body-parser helmet bookshelf compression dotenv morgan')
    installKnexGlobal()
    modifyKnex(name)
    try {
      execSync(`createdb ${name};`, { stdio: 'ignore' });
    } catch (e) {
      // need some variable to indicate this failed and the user needs to make a new database
    }
    addBookshelfToEnzo()
    addScript('server', 'nodemon server/cluster.js')
    addScript('api', 'node enzo/api.js')
    process.stdout.write('\033c')
    console.log('The backend was added!')
    console.log(`to start server enter npm run server`)
  })
}

let mongo = () => {
  BE.backendOnly()
  console.log('Downloading dependencies and creating files, this may take a moment')
  install('express nodemon mongo body-parser helmet mongoose compression dotenv morgan')
  addScript('server', 'nodemon server/cluster.js')
  addScript('api', 'node enzo/api.js')
  addMongooseToEnzo()
  process.stdout.write('\033c')
  console.log('The backend was added!')
  console.log(`to start server enter npm run server`)
}


let backendOnly = () => {
  BE.backendOnly()
  console.log('Downloading dependencies and creating files, this may take a moment')
  install('express nodemon body-parser helmet compression dotenv morgan')
  addScript('server', 'nodemon server/cluster.js')
  addScript('api', 'node enzo/api.js')
  process.stdout.write('\033c')
  console.log('The backend was added!')
  console.log(`to start server enter npm run server`)
}


let addBookshelfToEnzo = () => {
  let bookshelf = fs.readFileSync(path.resolve(__dirname, './templates/bookshelf.js'), 'utf8')
  let enzoCreateBookshelfModel = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateBookshelfModel.js'),'utf8')
  let migrationTemplate = fs.readFileSync(path.resolve(__dirname, './templates/migrationTemplate.js'),'utf8')
  let enzoBookshelfModelTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoBookshelfModelTemplate.js'),'utf8')
  fs.writeFile(`./server/models/bookshelf.js`, bookshelf, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./enzo/enzoCreateBookshelfModel.js`, enzoCreateBookshelfModel, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./enzo/templates/migrationTemplate.js`, migrationTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./enzo/templates/enzoBookshelfModelTemplate.js`, enzoBookshelfModelTemplate, (err) => {
    if (err) console.error(err)
  })
  // need to add script for this to package.json
  addScript('model', 'node enzo/enzoCreateBookshelfModel.js')
}


let addMongooseToEnzo = () => {
  // first need to import mongoose and mongoose connect to the server/server.js file. 
  let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateMongooseModel.js'), 'utf8')
  let schemaTemplate = fs.readFileSync(path.resolve(__dirname, './templates/schemaTemplate.js'), 'utf8')
  fs.writeFile(`./enzo/model.js`, model, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./enzo/templates/schemaTemplate.js`,  schemaTemplate, (err) => {
    if (err) throw err 
  })
  addScript('model', 'node enzo/model.js')
}

// need a condition if the name is not given

let modifyKnex = (name) => {
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

module.exports = addBackend