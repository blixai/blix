let inquirer = require('inquirer')
let prompt   = inquirer.prompt
const { database } = require('../../new/prompts')
const { addMongooseToScripts } = require('../backend/addMongoDB')
const { addBookshelfToScripts } = require('../backend/addBookshelf')


const addDatabase = async () => {
  let databaseSelection = await prompt([database])
  if (databaseSelection.database === 'mongo') {
    await addMongooseToScripts()
  } else if (databaseSelection.database === 'pg') {
    await addBookshelfToScripts()
  }
}

module.exports = addDatabase