let command = process.argv[3]

let noCommand = () => {
  console.log('List of enzo commands:')
  console.log('')
  console.log('new <projectName>')
  console.log('redux')
  console.log('backend <databaseName>')
  console.log('database')
  console.log('help <command>')
  console.log('update')
  console.log('')
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
      console.log('Add redux to an existing react project. Be careful, it can cause file loss.')
      console.log('Works best with create-react-app projects or enzo made react projects.')
      break
    case 'update':
      console.log('updates enzo from npm')
      break
    default:
      noCommand()
      break;
  }
  process.exit()
}

module.exports = help 