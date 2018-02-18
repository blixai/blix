let fs = require('fs')
let path = require('path')
let helpers = require('../../helpers')

let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

let apiServer           = loadFile('./files/server.js')
let enzoCreateEndpoints = loadFile('./files/enzoCreateAPI.js')
let cluster             = loadFile('./files/cluster.js')

let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let enzoEndpointTemplate   = loadFile('./templates/enzoEndpointTemplate.js')
let enzoControllerTemplate = loadFile('./templates/enzoControllerTemplate.js')

//pug
let pugServer = loadFile('./files/pugServer.js')
let pugLayout = loadFile('./files/pugLayout.pug')
let pugError  = loadFile('./files/error.pug')
let pugPage   = loadFile('./files/enzoPugPage.js')
let pugTemp   = loadFile('./templates/pugTemplate.pug')

//htmlBackend 
let htmlServer = loadFile('./files/htmlServer.js')

let backendOnly = () => {
  commonFiles()
  fs.writeFileSync(`./server/server.js`, apiServer)
}

let pugBackend = () => {
  commonFiles()
  fs.mkdirSync(`./server/views`)
  fs.writeFileSync(`./server/server.js`, pugServer)
  helpers.writeFile(`./server/views/layout.pug`, pugLayout)
  helpers.writeFile(`./server/views/error.pug`, pugError)
  helpers.writeFile(`./enzo/page.js`, pugPage)
  helpers.writeFile(`./enzo/templates/pugTemplate.pug`, pugTemp)
}

let htmlBackend = () => {
  commonFiles()
  fs.writeFileSync(`./server/server.js`, htmlServer)
}


let commonFiles = () => {
  checkForPackageJSON()
  fs.mkdirSync(`./server`)
  fs.mkdirSync(`./server/models`)
  fs.mkdirSync(`./server/controllers`)
  helpers.writeFile(`./server/cluster.js`, cluster)
  helpers.writeFile(`./server/routes.js`, routes)
  helpers.writeFile(`./.env`, '')
  // need to see if enzo exists, if not make folder sync then create this file
  if (fs.existsSync('./enzo')) {
    if (!fs.existsSync('./enzo/api.js')) {
      helpers.writeFile(`./enzo/api.js`, enzoCreateEndpoints)
      helpers.writeFile(`./enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
      helpers.writeFile(`./enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)
    }
  } else {
    fs.mkdirSync('./enzo')
    helpers.writeFile(`./enzo/api.js`, enzoCreateEndpoints)
    fs.mkdirSync('./enzo/templates')
    helpers.writeFile(`./enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
    helpers.writeFile(`./enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)
  }
}

let checkForPackageJSON = () => {
  if (!fs.existsSync('./package.json')) {
    console.log(`You don't appear to be within a project, please cd into a project and try again.`)
    process.exit(1);
  }
}

module.exports = { backendOnly, pugBackend, htmlBackend }