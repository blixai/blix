const log      = console.log;
const inquirer = require('inquirer')
const prompt   = inquirer.prompt

let commands = {
  type    : 'list',
  message : 'Learn more about:',
  name    : 'help',
  choices : [
    { name: 'new'     },
    { name: 'script'  },
    { name: 'add'     },
    { name: 'remove'  },
    { name: 'help'    },
    { name: 'update'  },
    { name: 'version' }
  ]
}

let runHelp = () => {
  console.clear()
  prompt([commands]).then(answers => {
    switch (answers.help) {
      case 'backend':
        log('Adds an Express.js server along with a MongoDB or Postgres database to your project after asking a series of questions')
        break;
      case 'database':
        log('Adds a MongoDB or Postgres Database to your project')
        break
      case 'help':
        log('See a list of commands or learn more about a specific command')
        break
      case 'new':
        log('Run blix new <projectName> and be asked a series of questions to start a project from scratch')
        break
      case 'redux':
        log('Add redux to an existing react project. Be careful, it can cause file loss.')
        log('Works best with create-react-app projects or blix made react projects.')
        break
      case 'update':
        log('updates blix from npm')
        break
      case 'add':
        log('Choose from a list to add things like servers, databases, webpack, gulp, and redux to a project')
        break
      case 'script':
        log('Asks a series of questions to either add preconfigured blix scripts to a project or build your own')
        break
      case 'webpack':
        log('Add webpack to project. Asks for the entry directory and output folder. Configured for React, Sass, JS, CSS.')
        break
      case 'remove': 
        log('Remove gulp or webpack from a project. Removes common dependencies, npm scripts, and files.')
        break
      case 'gulp':
        log('Add gulp to project. Asks for the entry directory and output folder. Configured for Sass, JS, CSS and Html.')
        break 
      case 'version':
        log('Displays the current version of blix')
        break
      default:
        noCommand()
        break;
    }
  })
}

let help = () => {
  runHelp()
}

module.exports = help 