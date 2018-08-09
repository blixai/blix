let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let name;
const helpers = require('../../helpers')
const fs = require('fs')
const path = require('path')

const loadFile = filePath => {
  let root = '../../new/files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), 'utf8')
}

const {
  serverTesting,
  database,
  backendType
} = require('../../new/prompts')

let addBackend = async () => {
  let mode = await prompt([backendType])
  let serverTestingSelection = await prompt([serverTesting])
  let databaseSelection = await prompt([database])
  createBackend(mode, serverTestingSelection, databaseSelection)
}


// load files 
const cluster = loadFile('backend/common/cluster.js')
const routes = loadFile('backend/common/routes.js')

const createBackend = (mode, serverTestingSelection, databaseSelection) => {
  try {
    fs.mkdirSync('./server')
  } catch (err) {
    console.error('Server folder already exists')
    process.exit(1)
  }
  fs.mkdirSync('./server/models')
  fs.mkdirSync('./server/controllers')
  fs.mkdirSync('./server/helpers')
  if (mode !== 'api') {
    try {
      fs.mkdirSync('./assets')
    } catch (err) {
      console.error('Tried to create assets folder but one already exists')
    }
  }

  helpers.writeFile('./server/routes.js', routes)
  helpers.writeFile('./server/cluster.js', cluster)

  mode.mode === "standard" ? standard() : mode === "mvc" ? mvc() : api();
}

const standard = () => {
  console.log("FIRED")
  const html = loadFile('frontend/other/index.html')
  const server = loadFile('backend/backend/server.js')
  const controller = loadFile('backend/backend/home.js')

  helpers.writeFile('./server/server.js', server)
  helpers.writeFile('./server/controllers/home.js', controller)
  fs.mkdirSync('./server/views')
  fs.mkdirSync('./server/views/home')
  helpers.writeFile('./server/views/home/index.html', html)
}

const mvc = () => {

}

const api = () => {

}



module.exports = addBackend
