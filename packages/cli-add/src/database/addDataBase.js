let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { addProjectInstructions } = require('../addProjectInstructions')
const { database } = require('@blixai/cli-prompts')
const {
  addBookshelfToScripts,
  addMongooseToScripts
} = require('@blixai/cli-new-utils')
const {
  store,
  yarn,
  checkScriptsFolderExist,
  installAllPackages
} = require('@blixai/core')

const addDatabase = async () => {
  store.database = await prompt([database])
  await yarn()

  checkScriptsFolderExist()

  if (store.database.database === 'mongo') {
    addMongooseToScripts()
  } else if (store.database.database === 'pg') {
    addBookshelfToScripts()
  }

  installAllPackages()
  addProjectInstructions()
}

module.exports = addDatabase