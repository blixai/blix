#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;

let command = process.argv[2]
let name = process.argv[3]

// files that dont change
let gitignore = 'node_modules\n.DS_Store'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let babel = `{\n\t"presets": [\n\t\t"es2015",\n\t\t"react"\n\t]\n}`

// backend files 
let server = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let pck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js"\n\t},\n\t"dependencies": {\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0"\n\t}\n}`

// postgres/knex package.json
let pgpck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"new-endpoints": "pg-endpoints"\n\t},\n\t"dependencies": {\n\t\t"pg-endpoints": "^1.0.2",\n\t\t"body-parser": "^1.17.2",\n\t\t"express": "^4.15.3",\n\t\t"nodemon": "^1.11.0",\n\t\t"knex": "^0.13.0",\n\t\t"pg": "^7.1.2"\n\t}\n}`

// backend serving standard frontend
let frontendServer = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nconst pages = require('./pages')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`

// spa 
let spaServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.use("/build", express.static(path.join(__dirname, "../build")))\n\napp.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let spaWebpack = `const path = require('path')\n\nmodule.exports = {\n\tentry: './src/index.js',\n\toutput: {\n\t\tfilename: 'bundle.js',\n\t\tpath: path.resolve(__dirname, 'build')\n\t},\n\tmodule: {\n\t\tloaders: [\n\t\t\t{\n\t\t\t\ttest: /\\.js$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.jsx$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.css$/,\n\t\t\t\tloaders: "style-loader!css-loader"\n\t\t\t}\n\t\t]\n\t},\n\tresolve: {\n\t\textensions: ['.js', '.jsx', '.css']\n\t}\n}`
let spaIndex = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './App/App'\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n)`
let spaReact = `import React, { Component } from 'react' \n \nclass App extends Component {\n\tconstructor(props) {\n\t\tsuper(props) \n \t\tthis.state = {}\n\t } \n\n\trender() {\n\t\treturn(\n\t\t\t < div ></div >\n\t\t) \n\t } \n } \n\n export default App`
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`
let spaNoBE = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "open index.html && webpack --watch"\n\t}\n}`


// redux apps
let reactReduxServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.use("/build", express.static(path.join(__dirname, "../build")))\n\napp.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let rootReducer = `import { combineReducers } from 'redux'\n\n\nconst rootReducer = combineReducers({})\n\nexport default rootReducer`
let configStore = `import { createStore, applyMiddleware } from 'redux'\nimport rootReducer from './reducers/rootReducer'\n\nconst devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()\n\nexport const configureStore = () => {\n\treturn createStore(\n\t\trootReducer,\n\t\tdevTools\n\t)\n}`
let reactReduxIndex = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './containers/App/AppContainer'\nimport { BrowserRouter as Router, Route } from 'react-router-dom'\nimport { configureStore } from './configStore'\nimport { Provider } from 'react-redux'\nimport createHistory from 'history/createBrowserHistory'\n\n\nconst history = createHistory()\nconst store = configureStore()\n\n\nReactDOM.render(\n\t<Provider store= { store }>\n\t\t<Router history= { history }>\n\t\t\t<Route path='/' component={App}/>\n\t\t</Router>\n\t</Provider>\n, document.getElementById('root'))`
let appContainer = `import { connect } from 'react-redux'\nimport App from './App'\n\nconst mapStateToProps = (state) => {\n\t return state\n}\n\nexport default connect(mapStateToProps)(App)`
let appRouter = `import React, { Component } from 'react'\nimport { Route, Switch, Redirect } from 'react-router-dom'\nimport Home from '../Home/HomeContainer'\n\n\nclass App extends Component {\n\trender() {\n\t\treturn (\n\t\t\t<section>\n\t\t\t\t<Switch>\n\t\t\t\t\t<Route exact path='/' render={(history) => {\n\t\t\t\t\t\treturn <Home history={history}/>\n\t\t\t\t\t}}/>\n\t\t\t\t</Switch>\n\t\t\t</section>\n\t\t)\n\t}\n}\n\nexport default App`
let homeContainer = `import { connect } from 'react-redux'\nimport Home from './Home'\n\nconst mapStateToProps = (state) => {\n\t return state\n}\n\nexport default connect(mapStateToProps)(Home)`
let home = `import React, { Component } from 'react'\n\nclass Home extends Component {\n\tconstructor(props) {\n\t\tsuper(props)\n\t\tthis.state = {}\n\t}\n\n\trender() {\n\t\treturn (\n\t\t\t<div>Hello world!</div>\n\t\t)\n\t}\n}\n\nexport default Home`
let appRouterNoBackend = `import React, { Component } from 'react'\nimport { Route, Switch, Redirect } from 'react-router-dom'\nimport Home from '../Home/HomeContainer'\n\n\nclass App extends Component {\n\trender() {\n\t\treturn (\n\t\t\t<section>\n\t\t\t\t<Switch>\n\t\t\t\t\t<Route path='/' render={(history) => {\n\t\t\t\t\t\treturn <Home history={history}/>\n\t\t\t\t\t}}/>\n\t\t\t\t</Switch>\n\t\t\t</section>\n\t\t)\n\t}\n}\n\nexport default App`

//rails apps
let railsServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nconst pages = require('./pages')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.use('/', pages)\n\napp.use("/public", express.static(path.join(__dirname, "../public")))\n\n\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let railsHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div>Hello World!</div>\n\t\t<script src="public/home/index.js"></script>\n\t</body>\n</htlm>`
let pagesRoutes = `const express = require('express')\nconst r = express.Router()\nconst path = require('path')\nmodule.exports = r\n\nr.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/home/index.html')))`

let indexHtml = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t\t<link rel='stylesheet' type='text/css' href='main.css'/>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t<script src="index.js"></script>\n\t</body>\n</htlm>`
let mainCss = `h1 {\n\tcolor: blue\n}`

let frontend;

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
    shell.exec(`yarn add ${packages}`)
  } else {
    shell.exec(`npm install --save ${packages}`)
  }
}

let installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`)
  } else {
    shell.exec(`npm install --save-dev ${packages}`)
  }
}

let createProject = () => {
  if (name) {
    fs.mkdirSync(`./${name}`)
    
    rl.question('Do you need a Frontend? (Y/N) ', (answer) => {
      answer = answer.toLowerCase()
      if (answer === 'y') {
        rl.question('Will you be using React? (Y/N) ', (react) => {
          react = react.toLowerCase()
          if (react === 'y') {
            rl.question('Is this a Singe Page Application? (Y/N) ', (spa) => {
              spa = spa.toLowerCase()
              if (spa === 'y') {
               createReactSPA() 
              } else {
                createReactRedux()
              }
            })
          } else {
            createAppWithoutReact()
          }
        })
      } else {
        frontend = false 
        createBackend()
      }
    })
  } else {
    // need to include a message
    rl.close()
  }
}


let createReactSPA = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Will you use a postgres or mongo database? (Y/N) ', (database) => {
        database = database.toLowerCase()
        if (database === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (type) => {
            type = type.toLowerCase()
            if (type === 'p') {
              writeFilesWithSPAReact()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                shell.cd(`${name}`)
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                shell.exec('npm install --save express nodemon pg knex body-parser react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
                shell.exec('npm install -g knex')
                shell.exec('knex init')
                modifyKnex()
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            } else {
              writeFilesWithSPAReact()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                fs.writeFileSync(`./${name}/.env`)
                shell.cd(`${name}`)
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                shell.exec('npm install --save express nodemon mongo dotenv body-parser react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            }
        })
      } else {
        writeFilesWithSPAReact()
        fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
          if (err) throw err
          rl.close();
          shell.cd(`${name}`)
          console.log('Downloading dependencies and setting up the project, this may take a moment')
          shell.exec('npm install --save express nodemon body-parser react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
          process.stdout.write('\033c')
          console.log('The project was created!')
          console.log(`cd into ${name} and run npm start`)
        })
      }  
    }) 
  } else {
    reactSPAWithoutBackend()
  }
  })   
}

let reactSPAWithoutBackend = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.writeFile(`./${name}/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoBE)
  rl.close();
  console.log('Installing dependencies and running setup, this may take a moment')
  shell.cd(`${name}`)
  shell.exec('npm install --save react react-dom webpack babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
}


let writeFilesWithSPAReact = () => {
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
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, spaServer, (err) => {
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
}



let createReactRedux = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Do you need a Postgres or MongoDB database? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (database) => {
            database = database.toLowerCase()
            if (database === 'p') {
              ReactReduxWithBackend()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                shell.cd(`${name}`)
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                install('redux react-router-dom react-redux express nodemon pg knex body-parser react react-dom webpack')
                installDevDependencies('babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
                if (shouldUseYarn()) {
                  shell.exec('yarn global add knex')
                  shell.exec('knex init')
                } else {
                  shell.exec('npm install -g knex')
                  shell.exec('knex init')
                }
                modifyKnex()
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            } else {
              // build a react/redux with mongo backend
              ReactReduxWithBackend()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                shell.cd(`${name}`)
                process.stdout.write('\033c')                
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                install('redux react-router-dom react-redux express nodemon mongo dotenv body-parser react react-dom webpack')
                installDevDependencies('babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            }
          })
        } else {
          // build a react/redux without a db
          ReactReduxWithBackend()
          fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
            if (err) throw err
            rl.close();
            shell.cd(`${name}`)
            process.stdout.write('\033c')
            console.log('Downloading dependencies and setting up the project, this may take a moment')
            install('redux react-router-dom react-redux express nodemon dotenv body-parser react react-dom webpack')
            installDevDependencies('babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
            process.stdout.write('\033c')
            console.log('The project was created!')
            console.log(`cd into ${name} and run npm start`)
          })
        }
      })
    } else {
      // create react redux without a backend
      reactReduxWithoutBackend()
      fs.writeFile(`./${name}/package.json`, spaNoBE, (err) => {
        if (err) throw err
        rl.close();
        shell.cd(`${name}`)
        process.stdout.write('\033c')
        console.log('Downloading dependencies and setting up the project, this may take a moment')
        install('redux react-router-dom react-redux body-parser react react-dom webpack')
        installDevDependencies('babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
        process.stdout.write('\033c')
        console.log('The project was created!')
        console.log(`cd into ${name} and run npm start`)
      })
    }
  })
}


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
}

let createAppWithoutReact = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Do you want to use a Postgres or MongoDB database? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (database) => {
            database = database.toLowerCase()
            if (database === 'p') {
              // create project with postgres
              railsApp()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                shell.cd(`${name}`)
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                install('express nodemon pg knex body-parser')
                if (shouldUseYarn()) {
                  shell.exec('yarn global add knex')
                  shell.exec('knex init')
                } else {
                  shell.exec('npm install -g knex')
                  shell.exec('knex init')
                }
                modifyKnex()
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            } else {
              // create project with mongoDB
              railsApp()
              fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
                if (err) throw err
                rl.close();
                shell.cd(`${name}`)
                console.log('Downloading dependencies and setting up the project, this may take a moment')
                install('express nodemon mongo body-parser')
                process.stdout.write('\033c')
                console.log('The project was created!')
                console.log(`cd into ${name} and run npm start`)
              })
            }
          })
        } else {
          // create project without db
          railsApp()
          fs.writeFile(`./${name}/package.json`, spaNoSQLPck, (err) => {
            if (err) throw err
            rl.close();
            shell.cd(`${name}`)
            console.log('Downloading dependencies and setting up the project, this may take a moment')
            install('express nodemon body-parser')
            process.stdout.write('\033c')
            console.log('The project was created!')
            console.log(`cd into ${name} and run npm start`)
          })
        }
      })
    } else {
      // create project without react or backend
      // readme, gitignore, index.html, index.js, main.css
      createBasicApp()
      rl.close()
      console.log(`Project created! cd into ${name} and open index.html`)
    }
  })
}

let railsApp = () => {
  fs.mkdirSync(`./${name}/public`)
  fs.mkdirSync(`./${name}/public/home`)
  fs.writeFile(`./${name}/public/home/index.html`, railsHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/public/home/index.js`, `console.log('hello world!')`, (err) => {
    if (err) throw err
  })

  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, railsServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/server/pages.js`, pagesRoutes, (err) => {
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
}

let createBasicApp = () => {
  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/index.js`, `console.log('hello world!')`, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/index.html`, indexHtml, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/main.css`, mainCss, (err) => {
    if (err) throw err 
  })
}

// create a backend only project
let createBackend = () => {
 
}

let checkCommand = (command) => {
  switch (command) {
    case "new":
      createProject()
      break;

    default:
    break;
  }
}

checkCommand(command)

// need to check if project already exists



let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`

let modifyKnex = () => {
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      shell.exec('knex migrate:make initial')
    })
  }
}
