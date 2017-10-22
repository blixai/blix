let command = process.argv[3]

let noCommand = () => {
  console.log('List of enzo commands:')
  console.log('')
  console.log('')
  console.log('enzo new <projectName>')
  console.log('enzo redux')
  console.log('enzo backend')
  console.log('enzo database')
  console.log('enzo help <command>')
  console.log('enzo update')
}

let help = () => {
  process.stdout.write('\033c')
  switch (command) {
    case 'backend':
      console.log('Adds an Express.js server along with a MongoDB or Postgres database to your project after asking a series of questions')
      break;
    case 'database':
      console.log('Adds a MongoDB or Postgres Database to your project')
      break
    case 'help':
      console.log('See a list of commands or learn more about a specific command')
      break
    case 'new':
      console.log('Run enzo new <projectName> and be asked a series of questions to start a project from scratch')
      break
    case 'redux':
      console.log('Add redux to an existing react project. Be careful, it can cause file loss. Works best with create-react-app projects or enzo made react projects.')
      break
    case 'update':
      console.log('update enzo')
      break
    default:
      noCommand()
      break;
  }
  return

}

module.exports = help 