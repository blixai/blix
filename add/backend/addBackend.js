let inquirer = require('inquirer')
let prompt = inquirer.prompt
const helpers = require('../../helpers')
const fs = require('fs')
const path = require('path')

const { testBackend } = require('./addBackendTests')
const { addMongooseToScripts } = require('./addMongoDB')
const { addBookshelfToScripts } = require('./addBookshelf')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const { serverTesting, database, backendType } = require('../../new/prompts')

let addBackend = async () => {
  let mode = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  let databaseSelection = await prompt([database])
  createBackend(mode, serverTestingSelection, databaseSelection)
}

// load files
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  try {
    helpers.mkdirSync('./server')
  } catch (err) {
    console.error('Server folder already exists')
    process.exit(1)
  }
  helpers.mkdirSync('./server/models')
  helpers.mkdirSync('./server/controllers')
  helpers.mkdirSync('./server/helpers')
  if (mode !== 'api') {
    try {
      helpers.mkdirSync('./assets')
    } catch (err) {
      console.error('Tried to create assets folder but one already exists')
    }
  }

  helpers.writeFile('./server/routes.js', routes)
  helpers.writeFile('./server/cluster.js', cluster)

  mode.mode === 'standard' ? standard() : mode.mode === 'mvc' ? mvc() : api()

  addDatabase(databaseSelection)
  scripts(mode.mode)
  packages(mode)
  testBackend(serverTestingSelection)
  helpers.installAllPackagesToExistingProject()
}

const standard = () => {
  const html = loadFile('frontend/other/index.html')
  const server = loadFile('backend/standard/server.js')
  const controller = loadFile('backend/standard/home.js')

  helpers.writeFile('./server/server.js', server)
  helpers.writeFile('./server/controllers/home.js', controller)
  helpers.mkdirSync('./server/views')
  helpers.mkdirSync('./server/views/home')
  helpers.writeFile('./server/views/home/index.html', html)
}

const mvc = () => {
  const server = loadFile('backend/mvc/server.js')
  const error = loadFile('backend/mvc/error.pug')
  const layout = loadFile('backend/mvc/layout.pug')
  const pug = loadFile('backend/mvc/index.pug')
  const controller = loadFile('backend/mvc/home.js')

  helpers.writeFile('./server/server.js', server)

  helpers.mkdirSync('./server/views')
  helpers.writeFile('./server/views/error.pug', error)
  helpers.writeFile('./server/views/layout.pug', layout)
  helpers.mkdirSync('./server/views/home')
  helpers.writeFile('./server/views/home/index.pug', pug)

  helpers.writeFile('./server/controllers/home.js', controller)
}

const api = () => {
  const server = loadFile('backend/api/server.js')
  const homeController = loadFile('backend/api/home.js')

  helpers.writeFile('./server/server.js', server)
  helpers.writeFile('./server/controllers/home.js', homeController)
}

const packages = mode => {
  mode = mode.mode
  if (mode === 'standard') {
    helpers.addDependenciesToStore(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser'
    )
  } else if (mode === 'mvc') {
    helpers.addDependenciesToStore(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser pug'
    )
  } else {
    helpers.addDependenciesToStore(
      'express nodemon body-parser compression helmet dotenv morgan'
    )
  }
}

const addDatabase = databaseSelection => {
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
}

const scripts = mode => {
  helpers.checkScriptsFolderExist()
  const controller = loadFile('scripts/backend/controller.js')
  const controllerTemplate = loadFile('scripts/backend/templates/controller.js')
  const routesTemplate = loadFile('scripts/backend/templates/routes.js')

  helpers.addScript('server', 'nodemon server/cluster.js')
  // controller script
  helpers.addScript('controller', 'node scripts/controller.js')
  helpers.writeFile('./scripts/controller.js', controller)
  helpers.writeFile('./scripts/templates/controller.js', controllerTemplate)
  helpers.writeFile('./scripts/templates/routes.js', routesTemplate)

  if (mode === 'mvc') {
    pugScript()
  } else if (mode === 'standard') {
    pageScript()
  }
}

const pageScript = () => {
  const script = loadFile('scripts/backend/htmlPage.js')
  const htmlTemplate = loadFile('scripts/backend/templates/index.html')

  if (helpers.checkIfScriptIsTaken('view')) {
   helpers.addScript('server:view', 'node scripts/page') 
   helpers.writeFile('./scripts/page.js', script)
  } else {
    helpers.addScript('view', 'node scripts/view.js')
    helpers.writeFile('./scripts/view.js', script)
  }
  helpers.writeFile('./scripts/templates/index.html', htmlTemplate)
}

const pugScript = () => {
  const script = loadFile('scripts/backend/pugPage.js')
  const pugTemplate = loadFile('scripts/backend/templates/pug.pug')

  if (helpers.checkIfScriptIsTaken('view')) {
    // view script is taken
    helpers.addScript('server:view', 'node scripts/pug.js')
    helpers.writeFile('./scripts/pug.js', script)
  } else {
    helpers.addScript('view', 'node scripts/view.js')
    helpers.writeFile('./scripts/view.js', script)
  }
  helpers.writeFile('./scripts/templates/pugTemplate.pug', pugTemplate)
}

module.exports = addBackend
