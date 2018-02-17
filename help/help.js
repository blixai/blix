let command = process.argv[3]
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen');
let inquirer = require('inquirer')
let prompt = inquirer.prompt

let commands = {
  type: 'list',
  message: 'Learn more about:',
  name: 'help',
  choices: [
    { name: 'new' },
    { name: 'command' },
    { name: 'add' },
    { name: 'remove' },
    { name: 'help' },
    { name: 'update' },
    { name: 'version' }
  ]
}

let runHelp = () => {
  process.stdout.write('\033c')
  prompt([commands]).then(answers => {
    switch (answers.help) {
      case 'backend':
        log(chalk.cyanBright('Adds an Express.js server along with a MongoDB or Postgres database to your project after asking a series of questions'))
        break;
      case 'database':
        log(chalk.cyanBright('Adds a MongoDB or Postgres Database to your project'))
        break
      case 'help':
        log(chalk.cyanBright('See a list of commands or learn more about a specific command'))
        break
      case 'new':
        log(chalk.cyanBright('Run enzo new <projectName> and be asked a series of questions to start a project from scratch'))
        break
      case 'redux':
        log(chalk.cyanBright('Add redux to an existing react project. Be careful, it can cause file loss.'))
        log(chalk.cyanBright('Works best with create-react-app projects or enzo made react projects.'))
        break
      case 'update':
        log(chalk.cyanBright('updates enzo from npm'))
        break
      case 'add':
        log(chalk.cyanBright('Choose from a list to add things like servers, databases, webpack, gulp, and redux to a project'))
        break
      case 'command':
        log(chalk.cyanBright('Asks a series of questions to either add preconfigured enzo commands to a project or build your own'))
        break
      case 'webpack':
        log(chalk.cyanBright('Add webpack to project. Asks for the entry directory and output folder. Configured for React, Sass, JS, CSS.'))
        break
      case 'remove': 
        log(chalk.cyanBright('Remove gulp or webpack from a project. Removes common dependencies, npm scripts, and files.'))
        break
      case 'gulp':
        log(chalk.cyanBright('Add gulp to project. Asks for the entry directory and output folder. Configured for Sass, JS, CSS and Html.'))
        break 
      case 'version':
        log(chalk.cyanBright('Displays the current version of enzo'))
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