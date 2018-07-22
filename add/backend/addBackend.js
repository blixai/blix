let fs         = require('fs')
let path       = require('path')
let execSync   = require('child_process').execSync;
let BE         = require('./create')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt

// custom vars
let helpers    = require('../../helpers')
let log        = console.log
let clear      = process.stdout.write('\033c')

//prompts
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

//helper function
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

//"main function"
let addBackend = () => {
  backendType()
}

let basicBackend = () => {
  prompt([database]).then(database => {
    let answer = database.db
    if (answer === 'p') {
      basicPostgres()
    } else if (answer === 'm') {
      basicMongo()
    } else {
      backendOnly()
    }
  })
}

let backendType = () => {
  clear()
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
      pugPostgres()
    } else if (answer === 'm') {
      pugMongo()
    } else {
      basicPug()
    }
  })
}

let htmlBackend = () => {
  prompt([database]).then(database => {
    let answer = database.db 
    if (answer === 'p') {
      htmlPostgres()
    } else if (answer === 'm') {
      htmlMongo()
    } else {
      htmlBasic()
    }
  })
}

let pugPostgres = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.pugBackend()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon pg knex body-parser helmet bookshelf compression dotenv morgan pug cookie-parser')
    helpers.modifyKnex(name)
    try {
      execSync(`createdb ${name};`, { stdio: 'ignore' });
    } catch (e) {
      // need some variable to indicate this failed and the user needs to make a new database
    }
    addBookshelfToEnzo()
    helpers.addScript('server', 'nodemon server/cluster.js' )
    helpers.addScript('api'   , 'node enzo/api.js'          )
    helpers.addScript('page'  , 'node enzo/page.js'         )
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`)
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
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`)
  })
}

let pugMongo = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.pugBackend()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon mongo body-parser helmet mongoose compression dotenv morgan pug cookie-parser')
    helpers.addScript('server', 'nodemon server/cluster.js')
    helpers.addScript('api', 'node enzo/api.js')
    helpers.addScript('page', 'node enzo/page.js')
    addMongooseToEnzo(name)
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`) 
  })
}

let basicMongo = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.backendOnly()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon mongo body-parser helmet mongoose compression dotenv morgan')
    helpers.addScript('server', 'nodemon server/cluster.js')
    helpers.addScript('api', 'node enzo/api.js')
    addMongooseToEnzo(name)
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`)
  })
}

let basicPug = () => {
  BE.pugBackend()
  log('Downloading dependencies and creating files, this may take a moment')
  helpers.install('express nodemon body-parser helmet compression dotenv morgan pug cookie-parser')
  helpers.addScript('server', 'nodemon server/cluster.js')
  helpers.addScript('api', 'node enzo/api.js')
  clear()
  log('The backend was added!')
  log(`to start server enter npm run server`) 
}


let backendOnly = () => {
  BE.backendOnly()
  log('Downloading dependencies and creating files, this may take a moment')
  helpers.install('express nodemon body-parser helmet compression dotenv morgan')
  helpers.addScript('server', 'nodemon server/cluster.js')
  helpers.addScript('api', 'node enzo/api.js')
  clear()
  log('The backend was added!')
  log(`to start server enter npm run server`)
}

let htmlPostgres = () => {
  prompt([dbName]).then(name => {
    name = name.name
    BE.htmlBackend()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon pg knex body-parser helmet bookshelf compression dotenv morgan cookie-parser')
    helpers.modifyKnex(name)
    try {
      execSync(`createdb ${name};`, { stdio: 'ignore' });
    } catch (e) {
      // need some variable to indicate this failed and the user needs to make a new database
    }
    addBookshelfToEnzo()
    helpers.addScript('server', 'nodemon server/cluster.js')
    helpers.addScript('api', 'node enzo/api.js')
    helpers.addScript('page', 'node enzo/page.js')
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`)
  })
}

let htmlMongo = () => {
  prompt([dbName]).then(name => {
    name = name.name 
    BE.htmlBackend()
    log('Downloading dependencies and creating files, this may take a moment')
    helpers.install('express nodemon mongo body-parser helmet mongoose compression dotenv morgan cookie-parser')
    helpers.addScript('server', 'nodemon server/cluster.js')
    helpers.addScript('api', 'node enzo/api.js')
    helpers.addScript('page', 'node enzo/page.js')
    addMongooseToEnzo(name)
    clear()
    log('The backend was added!')
    log(`to start server enter npm run server`)
  })
}

let htmlBasic = () => {
  BE.htmlBackend()
  log('Downloading dependencies and creating files, this may take a moment')
  helpers.install('express nodemon body-parser helmet compression dotenv morgan pug cookie-parser')
  helpers.addScript('server', 'nodemon server/cluster.js')
  helpers.addScript('api', 'node enzo/api.js')
  clear()
  log('The backend was added!')
  log(`to start server enter npm run server`) 
}


let addBookshelfToEnzo = () => {
  let bookshelf                  = loadFile('./templates/bookshelf.js')
  let enzoCreateBookshelfModel   = loadFile('./templates/enzoCreateBookshelfModel.js')
  let migrationTemplate          = loadFile('./templates/migrationTemplate.js')
  let enzoBookshelfModelTemplate = loadFile('./templates/enzoBookshelfModelTemplate.js')

  helpers.writeFile(`./server/models/bookshelf.js`,                   bookshelf                 )
  helpers.writeFile(`./enzo/enzoCreateBookshelfModel.js`,             enzoCreateBookshelfModel  )
  helpers.writeFile(`./enzo/templates/migrationTemplate.js`,          migrationTemplate         )
  helpers.writeFile(`./enzo/templates/enzoBookshelfModelTemplate.js`, enzoBookshelfModelTemplate)

  helpers.addScript('model', 'node enzo/enzoCreateBookshelfModel.js')
}


let addMongooseToEnzo  = (name) => {
  let model            = loadFile('./templates/enzoCreateMongooseModel.js')
  let schemaTemplate   = loadFile('./templates/schemaTemplate.js')

  let server           = fs.readFileSync('./server/server.js', 'utf8').toString().split('\n')
  server.splice(0, 0, `\nlet mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO)\n`)
  let mongoAddedServer = server.join('\n')

  helpers.writeFile(`./server/server.js`, mongoAddedServer               )
  helpers.writeFile(`./enzo/model.js`,                     model         )
  helpers.writeFile(`./enzo/templates/schemaTemplate.js`,  schemaTemplate)
  helpers.writeFile(`./.env`, `MONGO="${`mongodb://localhost/${name}`}"` )

  helpers.addScript('model', 'node enzo/model.js')
}



module.exports = addBackend