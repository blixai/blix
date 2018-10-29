let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const addProjectInstructions = require('../addProjectInstructions')
const helpers = require('../../helpers')
const { database } = require('../../new/prompts')
const { addMongooseToScripts } = require('../../new/utils/addMongoDB')
const { addBookshelfToScripts } = require('../../new/utils/addBookshelf')
const store = require('../../new/store')

const addDatabase = async () => {
  store.database = await prompt([database])
  await helpers.yarn()
  if (store.database.database === 'mongo') {
    addMongooseToScripts()
  } else if (store.database.database === 'pg') {
    addBookshelfToScripts()
  }
  helpers.installAllPackagesToExistingProject()
  addProjectInstructions()
}

module.exports = addDatabase