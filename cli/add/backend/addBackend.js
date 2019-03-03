let inquirer = require('inquirer')
let prompt = inquirer.prompt
const helpers = require('../../helpers')
const fs = require('fs')
const path = require('path')
const store = require('../../new/store')
const { addProjectInstructions } = require('../addProjectInstructions')

const { testBackend } = require('../../new/utils/addBackendTests')
const {
  packages,
  standard,
  mvcType,
  apiType,
  scripts,
  addDatabase
} = require('../../new/backend')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const { serverTesting, database, backendType } = require('../../new/prompts')

let addBackend = async () => {
  store.backendType = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  store.database = await prompt([database])
  await helpers.yarn()
  this.createBackend(store.backendType, serverTestingSelection, store.database)
}

exports.addBackend = addBackend

// load files
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

exports.createBackend = (mode, serverTestingSelection, databaseSelection) => {
  if (fs.existsSync('server')) {
    console.error('Server folder already exists')
    process.exit(1)
  }
  helpers.mkdirSync('server')
  helpers.mkdirSync('server/models')
  helpers.mkdirSync('server/controllers')
  helpers.mkdirSync('server/helpers')
  if (mode !== 'api') {
    helpers.mkdirSync('assets')
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
  helpers.checkScriptsFolderExist()
  addDatabase(databaseSelection)
  this.checkScripts(mode.mode)
  packages(mode)
  testBackend(serverTestingSelection)
  helpers.installAllPackages()
  addProjectInstructions()
}

exports.checkScripts = mode => {
  scripts(mode)
  if (mode === 'mvc') {
    this.pugScript()
  }
}

exports.pugScript = () => {
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

