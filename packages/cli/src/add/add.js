let { webpack } = require('./webpack/addWebpack')
let addWebpackDevServer = require('./webpack/addWebpackDevServer')
let { addBackend }  = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let { addReactRouter } = require('./react-router/addReactRouter')
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

let add = async () => {
  if (!fs.existsSync('package.json')) {
    console.error(chalk.red`Not inside a project. If you're starting a new project use the blix new command.`)
    process.exit(1)
  }

  console.clear()
  let command = await prompt([commands])
  switch (command.command) {
    case "webpack":  
      webpack()
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
}

module.exports = add 