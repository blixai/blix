let fs         = require('fs')
let path       = require('path')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let { addProjectInstructions } = require('../addProjectInstructions')
const {
  loadFile,
  store,
  writeFile,
  mkdirSync,
  checkScriptsFolderExist,
  addScriptToPackageJSON,
  rename,
  installDependencies
} = require('@blix/core');


// files
let rootReducer = loadFile('frontend/redux/rootReducer.js')
let configStore = loadFile('frontend/redux/configStore.js')
let index       = loadFile('frontend/reactRouter-redux/index.js')
let homeView    = fs.readFileSync(path.resolve(__dirname, './files/Home.js'), 'utf-8')

// script templates
let statelessComponent = loadFile('scripts/frontend/react/templates/statelessComponent.js')
let container          = loadFile('scripts/frontend/redux/templates/container.js')
let statefulComponent  = loadFile('scripts/frontend/react/templates/statefulComponent.js')
let actionTemplate     = loadFile('scripts/frontend/redux/templates/action.js')
let reducerTemplate    = loadFile('scripts/frontend/redux/templates/reducer.js')

// scripts 
let action = loadFile('scripts/frontend/reactRouter-redux/action.js')
let view   = loadFile('scripts/frontend/reactRouter-redux/view.js')

exports.redux = () => {
  if (fs.existsSync('./src') && !fs.existsSync('./src/actions')) {
    mkdirSync('src/actions')
    writeFile('src/actions/index.js', '')
    mkdirSync('src/reducers')
    writeFile('src/reducers/rootReducer.js', rootReducer)
    writeFile('src/configStore.js', configStore)
  } else {
    console.log('No src folder found or src/actions folder already exists.')
    process.exit()
  }
}

// creates an index.js file that imports the App.js router and creates store provider
exports.createIndex = () => {
  writeFile('src/index.js', index)
}

exports.createContainer = (name) => {
  let containerCopy = container
  containerCopy = containerCopy.replace(/Name/g, name)
  return containerCopy
}

exports.createScripts = () => {
  checkScriptsFolderExist()
  // add scripts to package.json
  addScriptToPackageJSON('component', 'node scripts/component.js')
  addScriptToPackageJSON('action', 'node scripts/action.js')
  addScriptToPackageJSON('view', 'node scripts/view.js')
  // write scripts and templates
  let file = loadFile('scripts/frontend/redux/component.js')

  writeFile('scripts/component.js', file)
  writeFile('scripts/action.js', action)
  writeFile('scripts/view.js', view)

  writeFile('scripts/templates/statelessComponent.js', statelessComponent)
  writeFile('scripts/templates/container.js', container)
  writeFile('scripts/templates/statefulComponent.js', statefulComponent)
  writeFile('scripts/templates/reducer.js', reducerTemplate)
  writeFile('scripts/templates/action.js', actionTemplate)
}

// option add router selected, and was created with create-react-app
exports.createReactApp = () => {
  this.createIndex()
  mkdirSync('src/components')
  mkdirSync('src/components/App')
  mkdirSync('src/views')
  
  rename('./src/App.js', './src/components/App/App.js')

  let router = loadFile('frontend/react-router/Router.js')
  writeFile('src/Router.js', router)
  
  let AppContainer = this.createContainer('App')
  writeFile(`src/components/App/AppContainer.js`, AppContainer)

  if (fs.existsSync('./src/App.css')) {
    rename('./src/App.css', './src/components/App/App.css')
  }
  if (fs.existsSync('./src/logo.svg')) {
    rename('./src/logo.svg', './src/components/App/logo.svg')
  }
  if (fs.existsSync('./src/App.test.js')) {
    rename('./src/App.test.js', './src/components/App/App.test.js')
  }

  writeFile('src/views/Home.js', homeView) 
  this.createScripts()
}

// add router option selected and created by blix
exports.basicReactCreatedByBlix = () => {
  let router = loadFile('frontend/react-router/Router.js')
  writeFile('src/Router.js', router)

  rename('./src/App/App.js', './src/components/App/App.js')
  let AppContainer = this.createContainer('App')
  writeFile(`src/components/App/AppContainer.js`, AppContainer)
  rename('./src/App/App.css', './src/components/App/App.css')

  writeFile('src/views/Home.js', homeView)
  try {
    fs.rmdirSync('./src/App')
  } catch (err) {
    if (err) console.error(err)
  }
}

// project already has react router, create container for each component and create new index.js with store provider
exports.reactRouterCreatedByBlix = () => {
  let filesInComponents = fs.readdirSync('./src/components')
  filesInComponents.forEach(file => {
    if (fs.lstatSync(`./src/components/${file}`).isDirectory()) {
      let container = this.createContainer(file)
      writeFile(`src/components/${file}/${file}Container.js`, container)
    }
  })
  this.createIndex()
}

// add react router option selected
exports.createdByBlix = () => {
  if (fs.existsSync('./src/views') && fs.existsSync('./src/components')) {
    // blix react-router style
    this.reactRouterCreatedByBlix()
  } else {
    // blix basic react style
    mkdirSync('src/components')
    mkdirSync('src/components/App')
    mkdirSync('src/views')
    this.basicReactCreatedByBlix()
  }
  this.createIndex()

  this.createScripts()
}

// advanced redux setup
let createFilesWithRouter = async () => {
  await yarn()
  this.redux()

  if (fs.existsSync('./src/App.js') && !fs.existsSync('./src/components')) {
    this.createReactApp()
  } else if (fs.existsSync('./src/App/App.js') || (fs.existsSync('./src/components') && fs.existsSync('./src/views'))) {
    this.createdByBlix()
  } else {
      // not created by either blix or create-react-app
    console.log("This doesn't seem to have been created by create-react-app or blix. We're not sure how to handle this so to be safe we won't modify anything.")
  }

  installDependencies('redux react-redux react-router-dom')
  return
}

exports.createFilesWithRouter = createFilesWithRouter

// for a basic redux setup without a router
let dontAddReactRouter = async () => {
  await yarn()

  this.redux()
  if (fs.existsSync('./src/components') && fs.existsSync('./src/views')) {
    // react-router type blix project
    this.reactRouterCreatedByBlix()
    this.createScripts()
  } else if (fs.existsSync('./src/App/App.js')) {
    // basic react type blix project
    let AppContainer = this.createContainer('App')
    writeFile('src/App/AppContainer.js', AppContainer)
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './App/AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`

    writeFile('src/index.js', index)
  } else if (fs.existsSync('./src/App.js')) {
    // create-react-app
    let AppContainer = this.createContainer('App')
    writeFile('src/AppContainer.js', AppContainer)
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`
    writeFile('src/index.js', index)
  }
  installDependencies('react-redux redux')
  return
}

exports.dontAddReactRouter = dontAddReactRouter

let reactRouter = {
  type: 'confirm',
  message: 'Do you want to add React Router: ',
  name: 'router'
}

let continuePrompt = {
  type: 'confirm',
  message: 'Do you want to continue: ',
  name: 'confirm'
}

let addRedux = async () => {
  console.clear()
  console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
  let continueAnswer = await prompt([continuePrompt])
  if (!continueAnswer.confirm) {
    return
  }
  let packageJSON = fs.readFileSync('./package.json', 'utf8')
  let answer;
  if (!packageJSON.includes('react-router')) {
    answer = await prompt([reactRouter])
    answer = answer.router
  }

  if (answer) {
    await this.createFilesWithRouter()
    store.reactType = 'reactRouter-redux'
  } else {
    await this.dontAddReactRouter()
    store.reactType = 'redux'
  }
  addProjectInstructions()
}

exports.addRedux = addRedux