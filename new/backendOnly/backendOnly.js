let fs      = require('fs')
let path    = require('path')
let helpers = require('../../helpers')
let name    = process.argv[3]


// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

let server                 = loadFile('./files/server.js')
let gitignore              = loadFile('../filesToCopy/commonFiles/gitIgnore.js')
let readme                 = loadFile('../filesToCopy/commonFiles/readme.md')
let routes                 = loadFile('../filesToCopy/commonFiles/routes.js')
let enzoAPI                = loadFile('./files/enzoAPI.js')
let enzoEndpointTemplate   = loadFile('./templates/enzoEndpointTemplate.js')
let enzoControllerTemplate = loadFile('./templates/enzoControllerTemplate.js')
let cluster                = loadFile('../filesToCopy/cluster.js')

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/cluster.js",\n\t\t\t"api": "node scripts/api.js"\n\t}\n}`


let backendOnly = (test) => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)

  fs.writeFileSync(`./${name}/server/server.js`, server)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  helpers.writeFile(`./${name}/server/routes.js`, routes)

  //enzo 

  fs.mkdirSync(`./${name}/scripts`)
  helpers.writeFile(`./${name}/scripts/api.js`, enzoAPI)
  fs.mkdirSync(`./${name}/scripts/templates`)
  helpers.writeFile(`./${name}/scripts/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
  helpers.writeFile(`./${name}/scripts/templates/enzoControllerTemplate.js`, enzoControllerTemplate)

  //other files
  helpers.writeFile(`./${name}/.gitignore`,  gitignore)
  helpers.writeFile(`./${name}/README.md`,   readme)
  helpers.writeFile(`./${name}/.env`, '')
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
  setupTesting(test)
}

let setupTesting = (test) => {
  if (test === 'mocha') {
    mochaChia()
  } else if (test === 'jest') {
    jest()
  }
}

let mochaChia = () => {
  helpers.addScriptToNewPackageJSON('test', 'mocha', name)
  fs.mkdirSync(`./${name}/test`)
  helpers.writeFile(`./${name}/test/test.js`, loadFile('./files/mochaAPITest.js'))
}

let jest = () => {
  helpers.addScriptToNewPackageJSON('test', 'jest', name)
  fs.mkdirSync(`./${name}/test`)
  helpers.writeFile(`./${name}/test/test.test.js`, loadFile('./files/jestTest.js'))
}

module.exports = { backendOnly }