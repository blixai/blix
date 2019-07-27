let inquirer = require('inquirer')
let prompt = inquirer.prompt
const fs = require('fs')
const { 
  store,
  yarn,
  mkdirSync,
  writeFile,
  checkScriptsFolderExist,
  addScriptToPackageJSON,
  checkIfScriptIsTaken,
  installAllPackages,
  loadFile
} = require('@blixi/core')
const { addProjectInstructions } = require('../addProjectInstructions')

const { testBackend } = require('@blixi/cli-new-utils')
const {
  packages,
  standard,
  mvcType,
  apiType,
  scripts,
  addDatabase
} = require('@blixi/cli-new-backend')



const { serverTesting, database, backendType } = require('@blixi/cli-prompts')

let addBackend = async () => {
  store.backendType = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  store.database = await prompt([database])
  await yarn()
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
  mkdirSync('server')
  mkdirSync('server/models')
  mkdirSync('server/controllers')
  mkdirSync('server/helpers')
  if (mode !== 'api') {
    mkdirSync('assets')
  }

  writeFile('server/routes.js', routes)
  writeFile('server/cluster.js', cluster)

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
  checkScriptsFolderExist()
  addDatabase(databaseSelection)
  this.checkScripts(mode.mode)
  packages(mode)
  testBackend(serverTestingSelection)
  installAllPackages()
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

  if (checkIfScriptIsTaken('view')) {
    // view script is taken
    addScriptToPackageJSON('server:view', 'node scripts/pug.js')
    writeFile('scripts/pug.js', script)
  } else {
    addScriptToPackageJSON('view', 'node scripts/view.js')
    writeFile('scripts/view.js', script)
  }
  writeFile('scripts/templates/pugTemplate.pug', pugTemplate)
}

