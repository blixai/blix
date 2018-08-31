let webpack     = require('./webpack/webpack.js')
let addBackend  = require('./backend/addBackend')
let addDatabase = require('./database/addDataBase')
let addRedux    = require('./redux/addRedux')

let inquirer = require('inquirer')
let prompt   = inquirer.prompt

let commands = {
  type: 'list',
  message: 'Select what to add to your project',
  name: 'command',
  choices: [
    { name: 'backend'  },
    { name: 'webpack'  },
    { name: 'redux'    },
    { name: 'database' }
  ]
}

let add = () => {
  process.stdout.write('\033c')
  prompt([commands]).then(ans => {
    command = ans.command
    switch (command) {
      case "webpack":  
        webpack()
        break;
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