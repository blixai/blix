let addWebpack  = require('./webpack/addWebpack.js')
let addWebpackDevServer = require('./webpack/addWebpackDevServer')
let addBackend  = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let addReactRouter = require('./react-router/addReactRouter')
let  { addRedux }    = require('./redux/addRedux')
let fs = require('fs')
let chalk = require('chalk')
let inquirer = require('inquirer')
let prompt   = inquirer.prompt

let commands = {
  type: 'list',
  message: 'Select what to add to your project',
  name: 'command',
  choices: [
    { name: 'backend'  },
    { name: 'webpack'  },
    { name: 'webpack-dev-server' },
    { name: 'react-router' },
    { name: 'redux'    },
    { name: 'database' }
  ]
}

let add = () => {
  if (!fs.existsSync('package.json')) {
    console.error(chalk.red`Not inside a project. If you're starting a new project use the blix new command.`)
    process.exit(1)
  }

  console.clear()
  prompt([commands]).then(ans => {
    command = ans.command
    switch (command) {
      case "webpack":  
        addWebpack()
        break;
      case "webpack-dev-server":
        addWebpackDevServer();
        break;
      case "react-router":
        addReactRouter()
        break
      case "redux":
        addRedux()
        break
      case "database":
        addDatabase()
        break
      case "backend":
        addBackend()
        break
      default:
        break;
    }
  })
}

module.exports = add 