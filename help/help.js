const inquirer = require('inquirer')
const prompt   = inquirer.prompt
const { helpCommands } = require('../new/prompts')

module.exports = help = async () => {
  console.clear()
  let answers = await prompt([helpCommands])

  switch (answers.help) {
    case 'new':
      console.log('Run blix new <projectName> and be asked a series of questions to start a project from scratch')
      console.log('Try it: blix new <name>')
      break
    case 'add':
      console.log('Choose from a list to add things like servers, databases, webpack, and redux to a project')
      console.log('Try it: blix add')
      break
    case 'scripts':
      console.log('Asks a series of questions to either add preconfigured blix scripts to a project or build your own')
      console.log('Try it: blix scripts')
      break
    case 'generate':
      console.log('Inside a project execute generator scripts')
      console.log('Try it: blix g <command>')
    default:
      break;
  }
}
