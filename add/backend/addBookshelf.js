const fs = require('fs')
const helpers = require('../../helpers')
const execSync = require('child_process').execSync
const path = require('path')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const addBookshelfToScripts = () => {
  // load files for scripts folder
  const bookshelf = loadFile('scripts/backend/bookshelf.js')
  const model = loadFile('scripts/backend/templates/bookshelf.js')
  const migration = loadFile('scripts/backend/templates/migration.js')

  // load model to be placed into project directly
  const bookshelfModel = loadFile('backend/models/bookshelf.js')

  // write loaded files to new project
  helpers.writeFile(`./server/models/bookshelf.js`, bookshelfModel)
  // the following files are loaded into the scripts folder
  helpers.writeFile(`./scripts/model.js`, bookshelf)
  helpers.writeFile(`./scripts/templates/migration.js`, migration)
  helpers.writeFile(`./scripts/templates/bookshelf.js`, model)

  helpers.addScript('model', 'node scripts/model.js')
  installKnexGlobal()
  helpers.modifyKnexExistingProject(helpers.getCWDName())
  helpers.installDependenciesToExistingProject('pg bookshelf knex')
}

module.exports = {
  addBookshelfToScripts
}

const installKnexGlobal = () => {
  let name = helpers.getCWDName()
  try {
    execSync('npm install -g knex', { stdio: [0, 1, 2] })

    execSync(`createdb ${name}`, { stdio: [0, 1, 2] })
  } catch (err) {
    console.error(
      `Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`
    )
  }
}
