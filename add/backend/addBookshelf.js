const fs = require('fs')
const helpers = require('../../helpers')
const execSync = require('child_process').execSync
const path = require('path')
const store = require('../../new/store')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const addBookshelfToScripts = async () => {
  // load files for scripts folder
  helpers.checkScriptsFolderExist()
  const bookshelf = loadFile('scripts/backend/bookshelf.js')
  const model = loadFile('scripts/backend/templates/bookshelf.js')
  const migration = loadFile('scripts/backend/templates/migration.js')

  // load model to be placed into project directly
  const bookshelfModel = loadFile('backend/models/bookshelf.js')

  // write loaded files to new project
  try {
    helpers.writeFile(`./server/models/bookshelf.js`, bookshelfModel)
  } catch (err) {
    console.error(err)
  }
  // the following files are loaded into the scripts folder
  helpers.writeFile(`./scripts/model.js`, bookshelf)
  helpers.writeFile(`./scripts/templates/migration.js`, migration)
  helpers.writeFile(`./scripts/templates/bookshelf.js`, model)

  helpers.addScript('model', 'node scripts/model.js')
  await installKnexGlobal()
  helpers.modifyKnexExistingProject(helpers.getCWDName())
  await helpers.installDependenciesToExistingProject('pg bookshelf knex')
}

module.exports = {
  addBookshelfToScripts
}

const installKnexGlobal = async () => {
  let name = helpers.getCWDName()
  await helpers.checkIfNeedYarnAnswer()
  try {
    if (store.useYarn) {
      execSync(`yarn add knex global`, { stdio: [0, 1, 2] })
    } else {
      execSync('npm install -g knex', { stdio: [0, 1, 2] })
    }

    execSync(`createdb ${name}`, { stdio: [0, 1, 2] })
  } catch (err) {
    console.error(
      `Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`
    )
  }
}
