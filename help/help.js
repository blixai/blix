let command = process.argv[3]
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen');

let str = `new <projectName>

redux

backend <databaseName>

database

webpack

command

help <command>

update

version

`

let noCommand = () => {
  log(chalk.cyanBright('\n\nList of enzo commands:'))
  log()
  log(boxen(str, { padding: 1, borderColor: 'yellow'}));
  log()
  log()
  log(chalk.cyanBright('For more in depth details run ') + chalk.yellow('help <commandToExamine>'))
  log()
  log()
}

let help = () => {
  process.stdout.write('\033c')
  switch (command) {
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
    case 'command':
      log(chalk.cyanBright('Asks a series of questions to either add preconfigured enzo commands to a project or build your own'))
      break
    case 'webpack':
      log(chalk.cyanBright('Add webpack to project. Asks for the entry directory and output folder. Is configured for React, Sass, JS, CSS.'))
      break
    case 'version':
      log(chalk.cyanBright('Displays the current version of enzo'))
      break
    default:
      noCommand()
      break;
  }
  process.exit()
}

module.exports = help 