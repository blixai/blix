let fs = require('fs')
let path = require('path')
let name = process.argv[3]

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaWebpack = `const path = require('path')\n\nmodule.exports = {\n\tentry: './src/index.js',\n\toutput: {\n\t\tfilename: 'bundle.js',\n\t\tpath: path.resolve(__dirname, 'build')\n\t},\n\tmodule: {\n\t\tloaders: [\n\t\t\t{\n\t\t\t\ttest: /\\.js$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.jsx$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.css$/,\n\t\t\t\tloaders: "style-loader!css-loader"\n\t\t\t}\n\t\t]\n\t},\n\tresolve: {\n\t\textensions: ['.js', '.jsx', '.css']\n\t}\n}`
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`

let gitignore = 'node_modules\n.DS_Store\n.env'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let babel = `{\n\t"presets": [\n\t\t"es2015",\n\t\t"react"\n\t]\n}`

let reactReduxServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nlet compression = require('compression')\napp.use(compression())\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.use("/build", express.static(path.join(__dirname, "../build")))\n\napp.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let rootReducer = `import { combineReducers } from 'redux'\n\n\nconst rootReducer = combineReducers({})\n\nexport default rootReducer`
let configStore = `import { createStore, applyMiddleware } from 'redux'\nimport rootReducer from './reducers/rootReducer'\n\nconst devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()\n\nexport const configureStore = () => {\n\treturn createStore(\n\t\trootReducer,\n\t\tdevTools\n\t)\n}`
let reactReduxIndex = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './containers/App/AppContainer'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store= { store }>\n\t\t<Router history= { history }>\n\t\t\t<Route path='/' component={App}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`
let appContainer = `import { connect } from 'react-redux'\nimport App from './App'\n\nconst mapStateToProps = (state) => {\n\t return state\n}\n\nexport default connect(mapStateToProps)(App)`
let appRouter = `import React, { Component } from 'react'\nimport { Route, Switch, Redirect } from 'react-router-dom'\nimport Home from '../Home/HomeContainer'\n\n\nclass App extends Component {\n\trender() {\n\t\treturn (\n\t\t\t<section>\n\t\t\t\t<Switch>\n\t\t\t\t\t<Route exact path='/' render={(history) => {\n\t\t\t\t\t\treturn <Home history={history}/>\n\t\t\t\t\t}}/>\n\t\t\t\t</Switch>\n\t\t\t</section>\n\t\t)\n\t}\n}\n\nexport default App`
let homeContainer = `import { connect } from 'react-redux'\nimport Home from './Home'\n\nconst mapStateToProps = (state) => {\n\t return state\n}\n\nexport default connect(mapStateToProps)(Home)`
let home = `import React, { Component } from 'react'\n\nclass Home extends Component {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.state = {}\n\t}\n\n\trender() {\n\t\treturn (\n\t\t\t<div>Hello world!</div>\n\t\t)\n\t}\n}\n\nexport default Home`
let appRouterNoBackend = `import React, { Component } from 'react'\nimport { Route, Switch, Redirect } from 'react-router-dom'\nimport Home from '../Home/HomeContainer'\n\n\nclass App extends Component {\n\trender() {\n\t\treturn (\n\t\t\t<section>\n\t\t\t\t<Switch>\n\t\t\t\t\t<Route path='/' render={(history) => {\n\t\t\t\t\t\treturn <Home history={history}/>\n\t\t\t\t\t}}/>\n\t\t\t\t</Switch>\n\t\t\t</section>\n\t\t)\n\t}\n}\n\nexport default App`



let ReactReduxWithBackend = () => {

  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.mkdirSync(`./${name}/public`)
  fs.writeFile(`./${name}/public/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, reactReduxIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)
  fs.writeFile(`./${name}/src/containers/App/App.js`, appRouter, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer, (err) => {
    if (err) throw err
  })
  // need to write home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  fs.writeFile(`./${name}/src/containers/Home/Home.js`, home, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/configStore.js`, configStore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/actions`)
  fs.writeFile(`./${name}/src/actions/index.js`, '', (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/reducers`)
  fs.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer, (err) => {
    if (err) throw err
  })

  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, reactReduxServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}


let reactReduxWithoutBackend = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.writeFile(`./${name}/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, reactReduxIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)
  fs.writeFile(`./${name}/src/containers/App/App.js`, appRouterNoBackend, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer, (err) => {
    if (err) throw err
  })
  // need to write home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  fs.writeFile(`./${name}/src/containers/Home/Home.js`, home, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/configStore.js`, configStore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/actions`)
  fs.writeFile(`./${name}/src/actions/index.js`, '', (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/reducers`)
  fs.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = {
  ReactReduxWithBackend,
  reactReduxWithoutBackend
}