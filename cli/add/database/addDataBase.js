let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { addProjectInstructions } = require('../addProjectInstructions')
const { database } = require('../../prompts')
const { addMongooseToScripts } = require('../../new/utils/addMongoDB')
const { addBookshelfToScripts } = require('../../new/utils/addBookshelf')
const {
  store,
  yarn,
  checkScriptsFolderExist,
  installAllPackages
} = require('../../../blix')

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