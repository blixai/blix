let fs = require('fs')
let path = require('path')


let server = fs.readFileSync(path.resolve(__dirname, './files/server.js'), 'utf8')
let enzoCreateEndpoints = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAPI.js'), 'utf8')

let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`


let backendOnly = () => {
  if (fs.existsSync('./package.json')) {
    fs.mkdirSync(`./server`)
    fs.mkdirSync(`./server/models`)
    fs.writeFile(`./server/server.js`, server, (err) => {
      if (err) throw err
    })  
    fs.writeFile(`./server/routes.js`, routes, (err) => {
      if (err) throw err
    })
    // need to see if enzo exists, if not make folder sync then create this file
    if (fs.existsSync('./enzo')) {
      fs.writeFile(`./enzo/api.js`, enzoCreateEndpoints, (err) => {
        if (err) throw err
      })
    } else {
      fs.mkdirSync('./enzo')
      fs.writeFile(`./enzo/api.js`, enzoCreateEndpoints, (err) => {
        if (err) throw err
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