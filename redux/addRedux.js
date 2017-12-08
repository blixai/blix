const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;


let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages}`, {silent:true})
  } else {
    shell.exec(`npm install --save ${packages}`, {silent:true})
  }
}

let installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`, {silent:true})
  } else {
    shell.exec(`npm install --save-dev ${packages}`, {silent:true})
  }
}

let addScript = (command, script) => {
  let buffer = fs.readFileSync('package.json')
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync('package.json', newPackage)
}

let rootReducer = `import { combineReducers } from 'redux'\n\n\nconst rootReducer = combineReducers({})\n\n\nexport default rootReducer`
let configStore = `import { createStore, applyMiddleware } from 'redux'\nimport rootReducer from './reducers/rootReducer'\n\nconst devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()\n\nexport const configureStore = () => {\n\treturn createStore(\n\t\trootReducer,\n\t\tdevTools\n\t)\n}`
let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './containers/App/AppContainer'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<Router history={history}>\n\t\t\t<Route path='/' component={App}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`

let redux = () => {
  if (fs.existsSync('./src')) {
    fs.mkdirSync('./src/actions')
    fs.writeFile('./src/actions/index.js', '', (err) => {
      if (err) throw err
    })
    fs.mkdirSync('./src/reducers')
    fs.writeFile('./src/reducers/rootReducer.js', rootReducer, (err) => {
      if (err) throw err
    })
    fs.writeFile('./src/configStore.js', configStore, (err) => {
      if (err) throw err
    })
  } else {
    console.log('No src file found. Are you in a project?')
    process.exit()
  }
}


let createIndex = (name) => {
  let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport ${name} from './containers/${name}/${name}Container'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<Router history={history}>\n\t\t\t<Route path='/' component={${name}}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`
  fs.truncate('./src/index.js', 0, () => {
    fs.writeFile('./src/index.js', index, (err) => {
      if (err) throw err
    })
  })
}

let createContainer = (name) => {
  let container = `import { connect } from 'react-redux'\nimport ${name} from './${name}'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps, null)(${name})`
  return container
}

let dumbReduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/dumbReduxContainerTemplate.js'), 'utf8')
let enzoDumbComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoDumbComponentTemplate.js'), 'utf8')
let reduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reduxContainerTemplate.js'), 'utf8')
let smartComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/smartComponentTemplate.js'), 'utf8')

// enzo action
let action = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAction.js'), 'utf8')
let actionTemplate = fs.readFileSync(path.resolve(__dirname, './templates/actionTemplate.js'), 'utf8')
let reducerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reducerTemplate.js'), 'utf8')

let makeTemplates = () => {
  fs.writeFile('./enzo/templates/dumbReduxContainerTemplate.js', dumbReduxContainerTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/enzoDumbComponentTemplate.js', enzoDumbComponentTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/reduxContainerTemplate.js', reduxContainerTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/smartComponentTemplate.js', smartComponentTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/reducerTemplate.js', reducerTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/actionTemplate.js', actionTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/action.js', action, (err) => {
    if (err) console.error(err)
  })
  addScript('action', 'node enzo/action.js')
}

let enzo = () => {
  if (fs.existsSync('./enzo')) {
    // add new redux react creation command
    let file = fs.readFileSync(path.resolve(__dirname, './enzoCreateReactRedux.js'), 'utf8')
    fs.writeFile('./enzo/createReactRedux.js', file, (err) => {
      if (err) console.error(err)
    })
    if (fs.existsSync('./enzo/templates')) {
      addScript('redux', 'node ./enzo/createReactRedux.js')
      makeTemplates()
    } else {
      mkdirSync('./enzo/templates')
      makeTemplates()
      addScript('redux', 'node ./enzo/createReactRedux.js')
    }
  } else {
    // create enzo 
    fs.mkdirSync('./enzo')
    let file = fs.readFileSync(path.resolve(__dirname, './enzoCreateReactRedux.js'), 'utf8')
    fs.writeFile('./enzo/createReactRedux.js', file, (err) => {
      if (err) console.error(err)
    })
    fs.mkdirSync('./enzo/templates')
    makeTemplates()
    addScript('redux', 'node ./enzo/createReactRedux.js')
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

  let router = fs.readFileSync(path.resolve(__dirname, './router.js'), 'utf8')
  fs.writeFile('./src/containers/AppRoutes/AppRoutes.js', router, (err) => {
    if (err) throw err
  })
  let AppRoutesContainer = createContainer('AppRoutes')
  fs.writeFile('./src/containers/AppRoutes/AppRoutesContainer.js', AppRoutesContainer, (err) => {
    if (err) console.error(err)
  })
  
  let app = fs.readFileSync('./src/App.js', 'utf8')
  fs.writeFile('./src/containers/App/App.js', app, (err) => {
    if (err) throw err
  })
  let AppContainer = createContainer('App')
  fs.writeFile(`./src/containers/App/AppContainer.js`, AppContainer, (err) => {
    if (err) throw err
  })
  // maybe also move the App.css file into the App folder. 
  if (fs.existsSync('./src/App.css')) {
    fs.rename('./src/App.css', './src/containers/App/App.css', (err) => {
      if (err) console.error(err)
    })
  }
  // move the damn logo if it exists
  if (fs.existsSync('./src/logo.svg')) {
    fs.rename('./src/logo.svg', './src/containers/App/logo.svg', (err) => {
      if (err) console.error(err)
    })
  }
  // move the test file if it exists
  if (fs.existsSync('./src/App.test.js')) {
    fs.rename('./src/App.test.js', './src/containers/App/App.test.js', (err) => {
      if (err) console.error(err)
    })
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

  let router = fs.readFileSync(path.resolve(__dirname, './router.js'), 'utf8')
  fs.writeFile('./src/containers/AppRoutes/AppRoutes.js', router, (err) => {
    if (err) throw err
  })
  let AppRoutesContainer = createContainer('AppRoutes')
  fs.writeFile('./src/containers/AppRoutes/AppRoutesContainer.js', AppRoutesContainer, (err) => {
    if (err) console.error(err)
  })

  let app = fs.readFileSync('./src/App/App.js', 'utf8')
  fs.writeFile('./src/containers/App/App.js', app, (err) => {
    if (err) console.error(err)
  })
  let AppContainer = createContainer('App')
  fs.writeFile(`./src/containers/App/AppContainer.js`, AppContainer, (err) => {
    if (err) console.error(err)
  })
  let css = fs.readFileSync('./src/App/App.css')
  fs.writeFile('./src/containers/App/App.css', css, (err) => {
    if (err) console.error(err)
  })
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

    install('redux react-redux react-router-dom')
}

let createFilesWithoutRouter = () => {
  redux()
  if (fs.existsSync('./src/App.js')) {
    let AppContainer = `import { connect } from 'react-redux'\nimport App from './App'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps)(App)`
    fs.writeFile('./src/AppContainer.js', AppContainer, (err) => {
      if (err) throw err 
    })
    let index = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport AppContainer from './AppContainer'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\n\n\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<AppContainer/>\n\t</Provider>\n, document.getElementById('root'))`
    fs.truncate('./src/index.js', 0, () => {
      fs.writeFile('./src/index.js', index, (err) => {
        if (err) throw err
      })
    })
    install('react-redux redux')
  }

  // need to install without react router
}


let addRedux = () => {
  process.stdout.write('\033c')
  console.log('Mutating a project can cause loss of files. Make sure you have everything committed.')
  rl.question('Do you need React Router? (Y/N) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      createFilesWithRouter()
      rl.close()
    } else if (answer.toLowerCase() === 'n') {
      createFilesWithoutRouter()
      rl.close()
    } else {
      console.log('Invalid input. Please enter Y or N next time.')
      rl.close()

    }
  })
  
}

module.exports = addRedux