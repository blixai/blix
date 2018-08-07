let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let { createBackend }   = require('../../new/backend')

const { 
  serverTesting,
  database,
  backendType 
} = require('../../new/prompts')

let addBackend = async () => {
  // get current directory name and add it to the process so createBackend can work
  let name = process.cwd().split('/').pop()
  process.chdir('../')
  process.argv[3] = name

  let mode = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  let databaseSelection = await prompt([database])
  createBackend(mode, serverTestingSelection, databaseSelection)
}

module.exports = addBackend
