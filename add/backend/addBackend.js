let inquirer = require('inquirer')
let prompt = inquirer.prompt
const helpers = require('../../helpers')
const fs = require('fs')
const path = require('path')
const store = require('../../new/store')
const addProjectInstructions = require('../addProjectInstructions')

const {testBackend} = require('./addBackendTests')
const {addMongooseToScripts} = require('./addMongoDB')
const {addBookshelfToScripts} = require('./addBookshelf')
const {
  packages,
  standard,
  mvcType,
  apiType,
} = require('../../new/backend')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const {serverTesting, database, backendType} = require('../../new/prompts')

let addBackend = async () => {
  store.backendType = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  store.database = await prompt([database])
  await helpers.yarn()
  createBackend(store.backendType, serverTestingSelection, store.database)
}

// load files
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  try {
    helpers.mkdirSync('server')
  } catch (err) {
    console.error('Server folder already exists')
    process.exit(1)
  }
  helpers.mkdirSync('server/models')
  helpers.mkdirSync('server/controllers')
  helpers.mkdirSync('server/helpers')
  if (mode !== 'api') {
    try {
      helpers.mkdirSync('assets')
    } catch (err) {
      console.error('Tried to create assets folder but one already exists')
    }
  }

  helpers.writeFile('server/routes.js', routes)
  helpers.writeFile('server/cluster.js', cluster)

  if (mode.mode === 'standard') {
    // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
    standard()
  } else if (mode.mode === 'mvc') {
    // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
    mvcType()
  } else {
    // api mode json only, no views, no cookies
    apiType()
  }

  checkAddDatabase(databaseSelection)
  scripts(mode.mode)
  packages(mode)
  testBackend(serverTestingSelection)
  helpers.installAllPackagesToExistingProject()
  addProjectInstructions()
}

const checkAddDatabase = databaseSelection => {
  helpers.checkScriptsFolderExist()
  addDatabase(databaseSelection)
}

const scripts = mode => {
  helpers.checkScriptsFolderExist()
  const controller = loadFile('scripts/backend/controller.js')
  const controllerTemplate = loadFile('scripts/backend/templates/controller.js')
  const routesTemplate = loadFile('scripts/backend/templates/routes.js')

  helpers.addScriptToPackageJSON('server', 'nodemon server/cluster.js')
  // controller script
  helpers.addScriptToPackageJSON('controller', 'node scripts/controller.js')
  helpers.writeFile('scripts/controller.js', controller)
  helpers.writeFile('scripts/templates/controller.js', controllerTemplate)
  helpers.writeFile('scripts/templates/routes.js', routesTemplate)

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
    helpers.addScriptToPackageJSON('server:view', 'node scripts/page')
    helpers.writeFile('scripts/page.js', script)
  } else {
    helpers.addScriptToPackageJSON('view', 'node scripts/view.js')
    helpers.writeFile('scripts/view.js', script)
  }
  helpers.writeFile('scripts/templates/index.html', htmlTemplate)
}

const pugScript = () => {
  const script = loadFile('scripts/backend/pugPage.js')
  const pugTemplate = loadFile('scripts/backend/templates/pug.pug')

  if (helpers.checkIfScriptIsTaken('view')) {
    // view script is taken
    helpers.addScriptToPackageJSON('server:view', 'node scripts/pug.js')
    helpers.writeFile('scripts/pug.js', script)
  } else {
    helpers.addScriptToPackageJSON('view', 'node scripts/view.js')
    helpers.writeFile('scripts/view.js', script)
  }
  helpers.writeFile('scripts/templates/pugTemplate.pug', pugTemplate)
}

module.exports = addBackend
