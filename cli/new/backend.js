const helpers = require('../../index')
const {createCommonFilesAndFolders} = require('./utils/createCommonFiles')
const {testBackend} = require('./utils/addBackendTests')
const {addLinter} = require('./utils/addLinter')
const {addMongooseToScripts} = require('./utils/addMongoDB')
const {addBookshelfToScripts} = require('./utils/addBookshelf')
const {newProjectInstructions} = require('./utils/newProjectInstructions')
const { loadFile, store } = helpers

// load files
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

exports.createBackend = () => {
  // if api mode need to create common files and folders
  if (store.backendType === 'api') {
    createCommonFilesAndFolders()
  }
  // create folders
  helpers.mkdirSync(`server`)
  helpers.mkdirSync(`server/models`)
  helpers.mkdirSync(`server/controllers`)
  helpers.mkdirSync(`server/helpers`)
  if (store.backendType !== 'api') {
    helpers.mkdirSync(`assets`)
  }

  // create files: routes.js cluster.js
  helpers.writeFile(`server/routes.js`, routes)
  helpers.writeFile(`server/cluster.js`, cluster)

  if (store.backendType === 'standard') {
    // type when there is a frontend framework and for the most part the backend is a soa but serves some assets and files
    this.standard()
  } else if (store.backendType === 'mvc') {
    // mode for when their is no frontend framework so pug is default (this is a rails style mvc with ssr)
    this.mvcType()
  } else {
    // api mode json only, no views, no cookies
    this.apiType()
  }

  this.addDatabase(store.database)

  // scripts: controller, model, and if pug project view and add their associated commands to the package.json
  this.scripts(store.backendType)

  // packages to install
  this.packages(store.backendType)
  // setup endpoint tests
  testBackend(store.serverTesting)

  //add variables to .env file
  this.envSetup()

  helpers.installAllPackages()
  // new project instructions and add to readms
  newProjectInstructions()
}

exports.standard = () => {
  let html = loadFile('frontend/other/index.html')
  let server = loadFile('backend/standard/serverWithHotReloading.js')
  let controller = loadFile('backend/standard/home.js')

  // mode for when there is a frontend framework
  helpers.mkdirSync(`server/views`)
  helpers.mkdirSync(`server/views/home`)
  helpers.writeFile(`server/views/home/index.html`, html)
  helpers.writeFile(`server/server.js`, server)
  helpers.writeFile(`server/controllers/home.js`, controller)
}

exports.mvcType = () => {
  const server = loadFile('backend/mvc/server.js')
  const error = loadFile('backend/mvc/error.pug')
  const layout = loadFile('backend/mvc/layout.pug')
  const pug = loadFile('backend/mvc/index.pug')
  const controller = loadFile('backend/mvc/home.js')

  helpers.mkdirSync(`server/views`)
  helpers.mkdirSync(`server/views/home`)

  helpers.writeFile(`server/views/error.pug`, error)
  helpers.writeFile(`server/views/layout.pug`, layout)
  helpers.writeFile(`server/views/home/index.pug`, pug)
  helpers.writeFile(`server/server.js`, server)
  helpers.writeFile('server/controllers/home.js', controller)
}

exports.apiType = () => {
  let server = loadFile('backend/api/server.js')
  let controller = loadFile('backend/api/home.js')

  helpers.writeFile(`server/server.js`, server)
  helpers.writeFile(`server/controllers/home.js`, controller)
  // only the api type needs the linter, otherwise the frontend will have already asked and added it
  addLinter()
}

exports.addDatabase = databaseSelection => {
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
}

exports.scripts = mode => {
  let controller = loadFile('scripts/backend/controller.js')
  let controllerTemplate = loadFile('scripts/backend/templates/controller.js')
  let routesTemplate = loadFile('scripts/backend/templates/routes.js')

  if (mode === 'standard') {
    helpers.addScriptToPackageJSON('start', `nodemon --watch server server/cluster.js`)
  } else {
    helpers.addScriptToPackageJSON('start', 'nodemon server/cluster.js')
  }
  // controller script
  helpers.addScriptToPackageJSON('controller', 'node scripts/controller.js')
  // create files
  helpers.writeFile(`scripts/controller.js`, controller)
  helpers.writeFile(`scripts/templates/controller.js`, controllerTemplate)
  helpers.writeFile(`scripts/templates/routes.js`, routesTemplate)
}

exports.packages = mode => {
  if (mode === 'standard') {
    helpers.addDependenciesToStore(
      'express nodemon body-parser compression helmet dotenv morgan cookie-parser'
    )
    helpers.addDependenciesToStore('webpack-dev-middleware webpack-hot-middleware', 'dev')
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

exports.envSetup = () => {
  helpers.appendFile(`.env`, '\nWORKERS=1')
}
