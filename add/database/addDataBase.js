let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const helpers = require('../../helpers')
const { database } = require('../../new/prompts')
const { addMongooseToScripts } = require('../backend/addMongoDB')
const { addBookshelfToScripts } = require('../backend/addBookshelf')


const addDatabase = async () => {
  let databaseSelection = await prompt([database])
  await helpers.yarn()
  if (databaseSelection.database === 'mongo') {
    addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    addBookshelfToScripts()
  }
  helpers.installAllPackagesToExistingProject()
}

module.exports = addDatabase