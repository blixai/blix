const path = require('path')
const fs = require('fs')
const helpers = require('../../helpers')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

//
const addMongooseToScripts = async () => {
  helpers.checkScriptsFolderExist()
  let model = loadFile('scripts/backend/mongoose.js')
  let schemaTemplate = loadFile('scripts/backend/templates/mongoose.js')
  helpers.writeFile(`./scripts/model.js`, model)
  helpers.writeFile(`./scripts/templates/schemaTemplate.js`, schemaTemplate)

  helpers.addScript('model', 'node scripts/model.js')
  await addMongoDBToProject()
}

const addMongoDBToProject = async () => {
  let server = fs
    .readFileSync(`./server/server.js`, 'utf8')
    .toString()
    .split('\n')
  server.splice(
    0,
    0,
    `const mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO, { useNewUrlParser: true })\n`
  )
  let mongoAddedServer = server.join('\n')

  helpers.writeFile(`./server/server.js`, mongoAddedServer)
  envFileExists()
  await helpers.installDependenciesToExistingProject('mongo mongoose')
}

const envFileExists = () => {
  let name = helpers.getCWDName()
  try {
    if (fs.existsSync('./.env')) {
      fs.appendFileSync('./.env', `MONGO=${`mongodb://localhost:27017/${name}`}`)
    } else {
      helpers.writeFileSync('./.env', `MONGO=${`mongodb://localhost:27017/${name}`}`)
    }
  } catch (err) {
    console.error('Failed to find, create or append .env file')
  }
}

module.exports = {
  addMongooseToScripts
}
