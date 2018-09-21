const log      = console.log;
const inquirer = require('inquirer')
const prompt   = inquirer.prompt

let commands = {
  type    : 'list',
  message : 'Learn more about:',
  name    : 'help',
  choices : [
    { name: 'new'     },
    { name: 'scripts' },
    { name: 'add'     }
  ]
}

let runHelp = () => {
  console.clear()
  prompt([commands]).then(answers => {
    switch (answers.help) {
      case 'new':
        log('Run blix new <projectName> and be asked a series of questions to start a project from scratch')
        break
      case 'add':
        log('Choose from a list to add things like servers, databases, webpack, and redux to a project')
        log('Try it: blix add')
        break
      case 'scripts':
        log('Asks a series of questions to either add preconfigured blix scripts to a project or build your own')
        log('Try it: blix scripts')
        break
      default:
        break;
    }
  })
}

let help = () => {
  runHelp()
}

module.exports = help 