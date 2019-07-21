let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { addProjectInstructions } = require('../addProjectInstructions')
const { database } = require('@blixi/cli-prompts')
const {
  addBookshelfToScripts,
  addMongooseToScripts
} = require('@blixi/cli-new-utils')
const {
  store,
  yarn,
  checkScriptsFolderExist,
  installAllPackages
} = require('@blixi/core')

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