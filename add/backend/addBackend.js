let fs         = require('fs')
let path       = require('path')
let shell      = require('shelljs')
let execSync   = require('child_process').execSync;
let BE         = require('./create')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt

// custom vars
let helpers    = require('../../helpers')
let log        = console.log
let clear      = process.stdout.write('\033c')


let database = {
  type    : 'list',
  message : 'Database:',
  name    : 'db',
  choices : [
    { name: 'MongoDB' , value: 'm'  },
    { name: 'Postgres', value: 'p'  },
    { name: 'None'                  }
  ]
}

let html = {
  type    : 'confirm',
  message : 'Do you want to serve html files',
  name    : 'html'
}

let pug = {
  type    : 'confirm',
  message : 'Do you want to use the templating engine Pug',
  name    : 'pug'
}

let dbName = {
  type    : 'input',
  message : 'What is the database name:',
  name    : 'name'
}


let addBackend = () => {
  backendType()
}

let basicBackend = () => {
  prompt([database]).then(database => {
    let answer = database.db
    if (answer === 'p') {
      // postgres database
      basicPostgres()
    } else if (answer === 'm') {
      // express with mongodb
      basicMongo()
    } else {
      // backend without db
      backendOnly()
    }
  })
}

let backendType = () => {
  clear
  prompt([html]).then(html => {
    html.html ? askPug() : basicBackend()
  })
}

let askPug = () => {
  prompt([pug]).then(pug => {
    pug.pug ? pugBackend() : htmlBackend()
  })
}

let pugBackend = () => {
  prompt([database]).then(database => {
    let answer = database.db 
    if (answer === 'p') {
      // postgres with pug
    } else if (answer === 'm') {
      // mongodb with pug 
    } else {
      // pug no db 
    }
  })
}

let htmlBackend = () => {
  prompt([database]).then(database => {
    let answer = database.db 
    if (answer === 'p') {
      // postgres with html
    } else if (answer === 'm') {
      // mongodb with html
    } else {
      // html server no db 
    }
  })
}

let basicPostgres = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.backendOnly()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon pg knex body-parser helmet bookshelf compression dotenv morgan')
    helpers.installKnexGlobal()
    helpers.modifyKnex(name)
    try {
      execSync(`createdb ${name};`, { stdio: 'ignore' });
    } catch (e) {
      // need some variable to indicate this failed and the user needs to make a new database
    }
    addBookshelfToEnzo()
    helpers.addScript('server', 'nodemon server/cluster.js')
    helpers.addScript('api', 'node enzo/api.js')
    clear 
    log('The backend was added!')
    log(`to start server enter npm run server`)
  })
}

let basicMongo = () => {
  BE.backendOnly()
  log('Downloading dependencies and creating files, this may take a moment')
  helpers.install('express nodemon mongo body-parser helmet mongoose compression dotenv morgan')
  helpers.addScript('server', 'nodemon server/cluster.js')
  helpers.addScript('api', 'node enzo/api.js')
  helpers.addMongooseToEnzo()
  clear
  log('The backend was added!')
  log(`to start server enter npm run server`)
}


let backendOnly = () => {
  BE.backendOnly()
  log('Downloading dependencies and creating files, this may take a moment')
  helpers.install('express nodemon body-parser helmet compression dotenv morgan')
  helpers.addScript('server', 'nodemon server/cluster.js')
  helpers.addScript('api', 'node enzo/api.js')
  clear
  log('The backend was added!')
  log(`to start server enter npm run server`)
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
  helpers.addScript('model', 'node enzo/enzoCreateBookshelfModel.js')
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
  helpers.addScript('model', 'node enzo/model.js')
}



module.exports = addBackend