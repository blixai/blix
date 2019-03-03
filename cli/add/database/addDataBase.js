let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { addProjectInstructions } = require('../addProjectInstructions')
const helpers = require('../../../dist/src')
const { database } = require('../../prompts')
const { addMongooseToScripts } = require('../../new/utils/addMongoDB')
const { addBookshelfToScripts } = require('../../new/utils/addBookshelf')
const store = require('../../../store')

const addDatabase = async () => {
  store.database = await prompt([database])
  await helpers.yarn()

  helpers.checkScriptsFolderExist()

  if (store.database.database === 'mongo') {
    addMongooseToScripts()
  } else if (store.database.database === 'pg') {
    addBookshelfToScripts()
  }
  helpers.installAllPackages()
  addProjectInstructions()
}

module.exports = addDatabase