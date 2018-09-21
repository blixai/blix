const fs = require('fs')
const helpers = require('../helpers')
const path = require('path')
const name = process.argv[3]
const { createCommonFilesAndFolders } = require('./utils/createCommonFiles')
const { testBackend } = require('./utils/addBackendTests')
const { addMongooseToScripts } = require('./utils/addMongoDB')
const { addBookshelfToScripts } = require('./utils/addBookshelf')
const { newProjectInstructions } = require('./utils/newProjectInstructions')
const store = require('./store')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

// load files
const cluster = loadFile('./files/backend/common/cluster.js')
const routes = loadFile('./files/backend/common/routes.js')

const createBackend = () => {
  // if api mode need to create common files and folders
  if (store.backendType === 'api') {
    createCommonFilesAndFolders()
  }
  // create folders
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/server/helpers`)
  if (store.backendType !== 'api') {
    fs.mkdirSync(`./${name}/assets`)
  }

  // create files: routes.js cluster.js
  helpers.writeFile(`./${name}/server/routes.js`, routes)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)

  if (store.backendType === 'standard') {
    // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
    standard()
  } else if (store.backendType === 'mvc') {
    // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
    mvcType()
  } else {
    // api mode json only, no views, no cookies
    apiType()
  }

  addDatabase(store.database)

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json
  scripts(store.backendType)

  // packages to install
  packages(store.backendType)
  // setup endpoint tests
  testBackend(store.serverTesting)

  //add variables to .env file
  envSetup()

  // new project instructions and add to readme
  newProjectInstructions()
}

const standard = () => {
  let html = loadFile('./files/frontend/other/index.html')
  let server = loadFile('./files/backend/standard/server.js')
  let controller = loadFile('./files/backend/standard/home.js')

  // mode for when there is a frontend framework
  fs.mkdirSync(`./${name}/server/views`)
  fs.mkdirSync(`./${name}/server/views/home`)
  helpers.writeFile(`./${name}/server/views/home/index.html`, html)
  helpers.writeFileSync(`./${name}/server/server.js`, server)
  helpers.writeFile(`./${name}/server/controllers/home.js`, controller)
}

const mvcType = () => {
  const server = loadFile('./files/backend/mvc/server.js')
  const error = loadFile('./files/backend/mvc/error.pug')
  const layout = loadFile('./files/backend/mvc/layout.pug')
  const pug = loadFile('./files/backend/mvc/index.pug')

  fs.mkdirSync(`./${name}/server/views`)

  helpers.writeFile(`./${name}/server/views/error.pug`, error)
  helpers.writeFile(`./${name}/server/views/layout.pug`, layout)
  fs.mkdirSync(`./${name}/server/views/home`)
  helpers.writeFile(`./${name}/server/views/home/index.pug`, pug)

  fs.writeFileSync(`./${name}/server/server.js`, server)
}

const apiType = () => {
  let server = loadFile('./files/backend/api/server.js')
  let controller = loadFile('./files/backend/api/home.js')

  helpers.writeFileSync(`./${name}/server/server.js`, server)
  helpers.writeFile(`./${name}/server/controllers/home.js`, controller)
}

const addDatabase = databaseSelection => {
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
}

const scripts = mode => {
  let controller = loadFile('./files/scripts/backend/controller.js')
  let controllerTemplate = loadFile('./files/scripts/backend/templates/controller.js')
  let routesTemplate = loadFile('./files/scripts/backend/templates/routes.js')

  helpers.addScriptToNewPackageJSON('start', 'nodemon server/cluster.js')
  // controller script
  helpers.addScriptToNewPackageJSON('controller', 'node scripts/controller.js')
  // create files
  helpers.writeFile(`./${name}/scripts/controller.js`, controller)
  helpers.writeFile(`./${name}/scripts/templates/controller.js`, controllerTemplate)
  helpers.writeFile(`./${name}/scripts/templates/routes.js`, routesTemplate)
}

const packages = mode => {
  if (mode === 'standard') {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser'
    )
  } else if (mode === 'mvc') {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser pug'
    )
  } else {
    helpers.install(
      'express nodemon body-parser compression helmet dotenv morgan'
    )
  }
}

const envSetup = () => {
  fs.appendFileSync(`./${name}/.env`, '\nWORKERS=1')
}

module.exports = {
  createBackend
}
