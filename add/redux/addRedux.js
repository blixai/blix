let fs         = require('fs')
let path       = require('path')
let shell      = require('shelljs')
let  execSync  = require('child_process').execSync;
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let helpers    = require('../../helpers')

let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

let rootReducer = `import { combineReducers } from 'redux'\n\n\nconst rootReducer = combineReducers({})\n\n\nexport default rootReducer`
let configStore = `import { createStore, applyMiddleware } from 'redux'\nimport rootReducer from './reducers/rootReducer'\n\nconst devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()\n\nexport const configureStore = () => {\n\treturn createStore(\n\t\trootReducer,\n\t\tdevTools\n\t)\n}`
let index       = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './containers/App/AppContainer'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<Router history={history}>\n\t\t\t<Route path='/' component={App}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`

let redux = () => {
  if (fs.existsSync('./src')) {
    fs.mkdirSync('./src/actions')
    helpers.writeFile('./src/actions/index.js', '')
    fs.mkdirSync('./src/reducers')
    helpers.writeFile('./src/reducers/rootReducer.js', rootReducer)
    helpers.writeFile('./src/configStore.js', configStore)
  } else {
    console.log('No src file found. Are you in a project?')
    process.exit()
  }
}


let createIndex = (name) => {
  let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport ${name} from './containers/${name}/${name}Container'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<Router history={history}>\n\t\t\t<Route path='/' component={${name}}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`
  fs.truncate('./src/index.js', 0, () => {
    helpers.writeFile('./src/index.js', index)
  })
}

let createContainer = (name) => {
  let container = `import { connect } from 'react-redux'\nimport ${name} from './${name}'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps, null)(${name})`
  return container
}

let dumbReduxContainerTemplate = loadFile('./templates/dumbReduxContainerTemplate.js')
let enzoDumbComponentTemplate  = loadFile('./templates/enzoDumbComponentTemplate.js')
let reduxContainerTemplate     = loadFile('./templates/reduxContainerTemplate.js')
let smartComponentTemplate     = loadFile('./templates/smartComponentTemplate.js')

// enzo action
let action          = loadFile('./files/enzoCreateAction.js')
let actionTemplate  = loadFile('./templates/actionTemplate.js')
let reducerTemplate = loadFile('./templates/reducerTemplate.js')

let makeTemplates = () => {
  helpers.writeFile('./enzo/templates/dumbReduxContainerTemplate.js', dumbReduxContainerTemplate)
  helpers.writeFile('./enzo/templates/enzoDumbComponentTemplate.js', enzoDumbComponentTemplate)
  helpers.writeFile('./enzo/templates/reduxContainerTemplate.js', reduxContainerTemplate)
  helpers.writeFile('./enzo/templates/smartComponentTemplate.js', smartComponentTemplate)
  helpers.writeFile('./enzo/templates/reducerTemplate.js', reducerTemplate)
  helpers.writeFile('./enzo/templates/actionTemplate.js', actionTemplate)
  helpers.writeFile('./enzo/action.js', action)
  helpers.addScript('action', 'node enzo/action.js')
}

let enzo = () => {
  if (fs.existsSync('./enzo')) {
    // add new redux react creation command
    let file = loadFile('./enzoCreateReactRedux.js')
    helpers.writeFile('./enzo/createReactRedux.js', file)
    if (fs.existsSync('./enzo/templates')) {
      helpers.addScript('redux', 'node ./enzo/createReactRedux.js')
      makeTemplates()
    } else {
      mkdirSync('./enzo/templates')
      makeTemplates()
      helpers.addScript('redux', 'node ./enzo/createReactRedux.js')
    }
  } else {
    // create enzo 
    fs.mkdirSync('./enzo')
    let file = loadFile('./enzoCreateReactRedux.js')
    helpers.writeFile('./enzo/createReactRedux.js', file)
    fs.mkdirSync('./enzo/templates')
    makeTemplates()
    helpers.addScript('redux', 'node ./enzo/createReactRedux.js')
  }
}

let createReactApp = () => {
  if (fs.existsSync('./src/containers')) {
    // if it already exists this could be a problem. 
    process.exit()
  } else {
    let name = 'AppRoutes'
    createIndex(name)
    fs.mkdirSync('./src/containers')
    fs.mkdirSync('./src/containers/App')
    fs.mkdirSync('./src/containers/AppRoutes')
  }

  let router = loadFile('./router.js')
  helpers.writeFile('./src/containers/AppRoutes/AppRoutes.js', router)
  let AppRoutesContainer = createContainer('AppRoutes')
  helpers.writeFile('./src/containers/AppRoutes/AppRoutesContainer.js', AppRoutesContainer)
  
  let app = fs.readFileSync('./src/App.js', 'utf8')
  helpers.writeFile('./src/containers/App/App.js', app)
  let AppContainer = createContainer('App')
  helpers.writeFile(`./src/containers/App/AppContainer.js`, AppContainer)
  // maybe also move the App.css file into the App folder. 
  if (fs.existsSync('./src/App.css')) {
    helpers.rename('./src/App.css', './src/containers/App/App.css')
  }
  // move the damn logo if it exists
  if (fs.existsSync('./src/logo.svg')) {
    helpers.rename('./src/logo.svg', './src/containers/App/logo.svg')
  }
  // move the test file if it exists
  if (fs.existsSync('./src/App.test.js')) {
    helpers.rename('./src/App.test.js', './src/containers/App/App.test.js')
  }

  try {
    fs.unlinkSync('./src/App.js')

  } catch (err) {
    if (err) console.error(err)
  }
  enzo()
}



let createdByEnzo = () => {
  if (fs.existsSync('./src/containers')) {
    process.exit()
  } else if (fs.existsSync('./src/containers/AppRoutes') || fs.existsSync('./src/containers/App')) {
    process.exit()
  } else {
    let name = 'AppRoutes'
    createIndex(name)
    fs.mkdirSync('./src/containers')
    fs.mkdirSync('./src/containers/App')
    fs.mkdirSync('./src/containers/AppRoutes')
  }

  let router = loadFile('./router.js')
  helpers.writeFile('./src/containers/AppRoutes/AppRoutes.js', router)
  let AppRoutesContainer = createContainer('AppRoutes')
  helpers.writeFile('./src/containers/AppRoutes/AppRoutesContainer.js', AppRoutesContainer)

  let app = fs.readFileSync('./src/App/App.js', 'utf8')
  helpers.writeFile('./src/containers/App/App.js', app)
  let AppContainer = createContainer('App')
  helpers.writeFile(`./src/containers/App/AppContainer.js`, AppContainer)
  let css = fs.readFileSync('./src/App/App.css')
  helpers.writeFile('./src/containers/App/App.css', css)
  try {
    fs.unlinkSync('./src/App/App.js')
    fs.unlinkSync('./src/App/App.css')
    fs.rmdirSync('./src/App')
  } catch (err) {
    if (err) console.error(err)
  }
  enzo()
}


let createFilesWithRouter = () => {
  redux()

    if (fs.existsSync('./src/App.js')) {
      createReactApp()
    } else if (fs.existsSync('./src/App/App.js')) {
      createdByEnzo()
    } else {
       // the router into a router file? not really sure 
    }

    helpers.install('redux react-redux react-router-dom')
}

let createFilesWithoutRouter = () => {
  redux()
  if (fs.existsSync('./src/App.js')) {
    let AppContainer = `import { connect } from 'react-redux'\nimport App from './App'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps)(App)`
    helpers.writeFile('./src/AppContainer.js', AppContainer)
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`
    fs.truncate('./src/index.js', 0, () => {
      helpers.writeFile('./src/index.js', index)
    })
    helpers.install('react-redux redux')
  }

  // need to install without react router
}

let reactRouter = {
  type: 'confirm',
  message: 'Do you need React Router:',
  name: 'router'
}

let addRedux = () => {
  process.stdout.write('\033c')
  console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
  prompt([reactRouter]).then(answer => {
    answer = answer.router
    if (answer) {
      createFilesWithRouter()
    } else {
      createFilesWithoutRouter()
    }
  })
}

module.exports = addRedux