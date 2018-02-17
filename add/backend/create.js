let fs = require('fs')
let path = require('path')


let apiServer = fs.readFileSync(path.resolve(__dirname, './files/server.js'), 'utf8')
let enzoCreateEndpoints = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAPI.js'), 'utf8')
let cluster = fs.readFileSync(path.resolve(__dirname, './files/cluster.js'), 'utf8')

let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let enzoEndpointTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
let enzoControllerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')

let backendOnly = () => {
  commonFiles()
  fs.writeFile(`./server/server.js`, apiServer, (err) => {
    if (err) throw err 
  })
}


let pugBackend = () => {
  commonFiles()
  fs.mkdirSync(`./server/views`)
  
  // need pug template
  // need page command for pug
  // need pug server 
} 


let htmlBackend = () => {
  commonFiles()
  // need html page command
  // need html template
  // need html server?
}

let commonFiles = () => {
  if (fs.existsSync('./package.json')) {
    fs.mkdirSync(`./server`)
    fs.mkdirSync(`./server/models`)
    fs.mkdirSync(`./server/controllers`)
    // add your own server/server.js file depending on project type 
    fs.writeFile(`./server/cluster.js`, cluster, (err) => {
      if (err) throw err
    })
    fs.writeFile(`./server/routes.js`, routes, (err) => {
      if (err) throw err
    })
    // need to see if enzo exists, if not make folder sync then create this file
    if (fs.existsSync('./enzo')) {
      if (fs.existsSync('./enzo/api.js')) {

      } else {
        fs.writeFile(`./enzo/api.js`, enzoCreateEndpoints, (err) => {
          if (err) console.error(err)
        })
        fs.writeFile(`./enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate, (err) => {
          if (err) console.error(err)
        })
        fs.writeFile(`./enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate, (err) => {
          if (err) console.error(err)
        })
      }
    } else {
      fs.mkdirSync('./enzo')
      fs.writeFile(`./enzo/api.js`, enzoCreateEndpoints, (err) => {
        if (err) throw err
      })
      fs.mkdirSync('./enzo/templates')
      fs.writeFile(`./enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate, (err) => {
        if (err) console.error(err)
      })
      fs.writeFile(`./enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate, (err) => {
        if (err) console.error(err)
      })
    }

  } else {
    console.log(`You don't appear to be within a project, please cd into a project and try again.`)
    process.exit(1);
  } 
}

module.exports = { backendOnly, pugBackend, htmlBackend }