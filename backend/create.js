let fs = require('fs')
let path = require('path')


let server = fs.readFileSync(path.resolve(__dirname, './files/server.js'), 'utf8')
let enzoCreateEndpoints = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAPI.js'), 'utf8')

let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let enzoEndpointTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
let enzoControllerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')

let backendOnly = () => {
  if (fs.existsSync('./package.json')) {
    fs.mkdirSync(`./server`)
    fs.mkdirSync(`./server/models`)
    fs.mkdirSync(`./server/controllers`)
    fs.writeFile(`./server/server.js`, server, (err) => {
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
      fs.writeFile(`./enzo/templates/enzoModelTemplate.js`, enzoModelTemplate, (err) => {
        if (err) console.error(err)
      })
    }

  } else {
    console.log(`You don't appear to be within a project, please cd into a project and try again.`)
    process.exit(1);
  }
  // need to write enzo command for creating api or pages
  // need to add enzo files
}

module.exports = { backendOnly }