let command = process.argv[2]

let noCommand = () => {
  console.log('List of enzo commands')
  console.log('enzo new <projectName>')
  console.log('enzo redux')
  console.log('enzo backend')
  console.log('enzo database')
  console.log('enzo help <command>')
  console.log('enzo update')
}

let help = () => {
  switch (command) {
    case 'backend':
      console.log('Adds an Express.js server along with a MongoDB or Postgres database to your project after asking a series of questions')
      break;
    case 'database':
      console.log('Adds a MongoDB or Postgres Database to your project')
    case 'help':
      console.log('See a list of commands or learn more about a specific command')
    case 'new':
      console.log('Run enzo new <projectName> and be asked a series of questions to start a project from scratch')
    case 'redux':
      console.log('Add redux to an existing react project. Be careful, it can cause file loss. Works best with create-react-app projects or enzo made react projects.')
    case 'update':
      console.log('update enzo')
    default:
      noCommand()
      break;
  }

}

module.exports = help 