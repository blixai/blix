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

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/cluster.js",\n\t\t\t"api": "node enzo/api.js"\n\t}\n}`


let backendOnly = () => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)

  fs.writeFileSync(`./${name}/server/server.js`, server)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  helpers.writeFile(`./${name}/server/routes.js`, routes)

  //enzo 

  fs.mkdirSync(`./${name}/enzo`)
  helpers.writeFile(`./${name}/enzo/api.js`, enzoAPI)
  fs.mkdirSync(`./${name}/enzo/templates`)
  helpers.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)

  //other files
  helpers.writeFile(`./${name}/.gitignore`,  gitignore)
  helpers.writeFile(`./${name}/README.md`,   readme)
  helpers.writeFile(`./${name}/.env`, '')
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = { backendOnly }