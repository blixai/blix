let fs         = require('fs')
let path       = require('path')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let helpers    = require('../../helpers')

let loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

// files
let rootReducer = loadFile('frontend/redux/rootReducer.js')
let configStore = loadFile('frontend/redux/configStore.js')
let index       = loadFile('frontend/redux/reactRouterReduxIndex.js')
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

let redux = () => {
  if (fs.existsSync('./src') && !fs.existsSync('./src/actions')) {
    fs.mkdirSync('./src/actions')
    helpers.writeFile('./src/actions/index.js', '')
    fs.mkdirSync('./src/reducers')
    helpers.writeFile('./src/reducers/rootReducer.js', rootReducer)
    helpers.writeFile('./src/configStore.js', configStore)
  } else {
    console.log('No src folder found or src/actions folder already exists.')
    process.exit()
  }
}

// creates an index.js file that imports the App.js router and creates store provider
let createIndex = () => {
  fs.truncate('./src/index.js', 0, () => {
    helpers.writeFile('./src/index.js', index)
  })
}

let createContainer = (name) => {
  let containerCopy = container
  containerCopy = containerCopy.replace(/Name/g, name)
  return containerCopy
}

let createScripts = () => {
  helpers.checkScriptsFolderExist()
  // add scripts to package.json
  helpers.addScript('component', 'node scripts/component.js')
  helpers.addScript('action', 'node scripts/action.js')
  helpers.addScript('view', 'node scripts/view.js')
  // write scripts and templates
  let file = loadFile('scripts/frontend/redux/component.js')
  helpers.writeFile('./scripts/component.js', file)
  helpers.writeFile('./scripts/templates/statelessComponent.js', statelessComponent)
  helpers.writeFile('./scripts/templates/container.js', container)
  helpers.writeFile('./scripts/templates/statefulComponent.js', statefulComponent)
  helpers.writeFile('./scripts/templates/reducer.js', reducerTemplate)
  helpers.writeFile('./scripts/templates/action.js', actionTemplate)
  helpers.writeFile('./scripts/action.js', action)
  helpers.writeFile('./scripts/view.js', view)
}

// option add router selected, and was created with create-react-app
let createReactApp = () => {
  createIndex()
  fs.mkdirSync('./src/components')
  fs.mkdirSync('./src/components/App')
  fs.mkdirSync('./src/views')
  
  helpers.rename('./src/App.js', './src/components/App/App.js')

  let router = loadFile('frontend/react-router/App.js')
  helpers.writeFile('./src/App.js', router)
  
  let AppContainer = createContainer('App')
  helpers.writeFile(`./src/components/App/AppContainer.js`, AppContainer)
  if (fs.existsSync('./src/App.css')) {
    helpers.rename('./src/App.css', './src/components/App/App.css')
  }
  if (fs.existsSync('./src/logo.svg')) {
    helpers.rename('./src/logo.svg', './src/components/App/logo.svg')
  }
  if (fs.existsSync('./src/App.test.js')) {
    helpers.rename('./src/App.test.js', './src/components/App/App.test.js')
  }
  helpers.writeFile('./src/views/Home.js', homeView) 
  createScripts()
}

// add router option selected and created by blix
let basicReactCreatedByBlix = () => {
  let router = loadFile('frontend/react-router/App.js')
  helpers.writeFile('./src/App.js', router)

  helpers.rename('./src/App/App.js', './src/components/App/App.js')
  let AppContainer = createContainer('App')
  helpers.writeFile(`./src/components/App/AppContainer.js`, AppContainer)
  helpers.rename('./src/App/App.css', './src/components/App/App.css')

  helpers.writeFile('./src/views/Home.js', homeView)
  try {
    fs.rmdirSync('./src/App')
  } catch (err) {
    if (err) console.error(err)
  }
}

// project already has react router, create container for each component and create new index.js with store provider
let reactRouterCreatedByBlix = () => {
  let filesInComponents = fs.readdirSync('./src/components')
  filesInComponents.forEach(file => {
    if (fs.lstatSync(`./src/components/${file}`).isDirectory()) {
      let container = createContainer(file)
      helpers.writeFile(`./src/components/${file}/${file}Container.js`, container)
    }
  })
  createIndex()
}

// add react router option selected
let createdByBlix = () => {
  if (fs.existsSync('./src/views') && fs.existsSync('./src/components')) {
    // blix react-router style
    reactRouterCreatedByBlix()
    createIndex()
  } else {
    // blix basic react style
    createIndex()
    fs.mkdirSync('./src/components')
    fs.mkdirSync('./src/components/App')
    fs.mkdirSync('./src/views')
    basicReactCreatedByBlix()
  }

  createScripts()
}

// advanced redux setup
let createFilesWithRouter = () => {
  redux()

  if (fs.existsSync('./src/App.js') && !fs.existsSync('./src/components')) {
    createReactApp()
  } else if (fs.existsSync('./src/App/App.js') || (fs.existsSync('./src/components') && fs.existsSync('./src/views'))) {
    createdByBlix()
  } else {
      // not created by either blix or create-react-app
    console.log("This doesn't seem to have been created by create-react-app or blix. We're not sure how to handle this so to be safe we won't modify anything.")
  }

  helpers.installDependenciesToExistingProject('redux react-redux react-router-dom')
}

// for a basic redux setup without a router
let dontAddReactRouter = () => {
  redux()
  if (fs.existsSync('./src/components') && fs.existsSync('./src/views')) {
    // react-router type blix project
    reactRouterCreatedByBlix()
    createScripts()
  } else if (fs.existsSync('./src/App/App.js')) {
    // basic react type blix project
    let AppContainer = createContainer('App')
    helpers.writeFile('./src/App/AppContainer.js', AppContainer)
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './App/AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`

    fs.truncate('./src/index.js', 0, () => {
      helpers.writeFile('./src/index.js', index)
    })
  } else if (fs.existsSync('./src/App.js')) {
    // create-react-app
    let AppContainer = createContainer('App')
    helpers.writeFile('./src/AppContainer.js', AppContainer)
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`
    fs.truncate('./src/index.js', 0, () => {
      helpers.writeFile('./src/index.js', index)
    })
  }
  helpers.installDependenciesToExistingProject('react-redux redux')
}

let reactRouter = {
  type: 'confirm',
  message: 'Do you want to add React Router: ',
  name: 'router'
}

let addRedux = async () => {
  console.clear()
  console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
  let answer = await prompt([reactRouter])
  answer = answer.router
  if (answer) {
    createFilesWithRouter()
  } else {
    dontAddReactRouter()
  }
}

module.exports = addRedux