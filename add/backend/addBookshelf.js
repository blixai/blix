const fs = require('fs')
const helpers = require('../../helpers')
const execSync = require('child_process').execSync
const path = require('path')
const chalk = require('chalk')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const addBookshelfToScripts = async () => {
  // load files for scripts folder
  const bookshelf = loadFile('scripts/backend/bookshelf.js')
  const model = loadFile('scripts/backend/templates/bookshelf.js')
  const migration = loadFile('scripts/backend/templates/migration.js')

  // load model to be placed into project directly
  const bookshelfModel = loadFile('backend/models/bookshelf.js')

  // write loaded files to new project
  helpers.writeFile(`server/models/bookshelf.js`, bookshelfModel)
  // the following files are loaded into the scripts folder
  helpers.writeFile(`scripts/model.js`, bookshelf)
  helpers.writeFile(`scripts/templates/migration.js`, migration)
  helpers.writeFile(`scripts/templates/bookshelf.js`, model)

  helpers.addScriptToPackageJSON('model', 'node scripts/model.js')
  helpers.installKnexGlobal()
  helpers.modifyKnex()
  helpers.addDependenciesToStore('pg bookshelf knex')
}

module.exports = {
  addBookshelfToScripts
}

