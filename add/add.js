let log = console.log
let inquirer = require('inquirer')
let prompt = inquirer.prompt

let commands = {
  type: 'list',
  message: 'Select what to add to your project',
  name: 'command',
  choices: [
    { name: 'webpack'  },
    { name: 'redux'    },
    { name: 'database' },
    { name: 'backend'  },
    { name: 'gulp'     }
  ]
}



let add = () => {
  process.stdout.write('\033c')
  prompt([commands]).then(ans => {
    command = ans.command
    switch (command) {
      case "webpack":  
        break;
      case "redux":
        break
      case "database":
        break
      case "backend":
        break
      case "gulp":
        break
      default:
        break;
    }
  })
}

module.exports = add 