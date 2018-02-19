let fs      = require('fs')
let path    = require('path')
let name    = process.argv[3]
let helpers = require('../../helpers')

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

let gitignore              = loadFile('../filesToCopy/commonFiles/gitIgnore.js')
let readme                 = loadFile('../filesToCopy/commonFiles/readme.md')
let routes                 = loadFile('../filesToCopy/commonFiles/routes.js')
let babel                  = loadFile('../filesToCopy/commonFiles/.babelrc')

// spa 
let spaServer              = loadFile('./files/spaServer.js')
let spaWebpack             = loadFile('./files/webpack.config.js')
let prodWebpack            = loadFile('./files/webpack.prod.js')
let spaIndex               = loadFile('./files/spaIndex.js')
let spaReact               = loadFile('./files/spaReact.js')
let spaNoSQLPck            = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/cluster.js",\n\t\t"build": "webpack --watch",\n\t\t"prod": "webpack --config webpack.prod.js",\n\t\t"react":"node enzo/react.js",\n\t\t"api": "node enzo/api.js"\n\t}\n}`
let spaHtmlFile            = loadFile('./files/spaHtmlFile.html')
let spaNoBE                = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "webpack-dev-server --output-public-path=/dist/ --inline --hot --open",\n\t\t"react": "node enzo/react.js",\n\t\t"prod": "webpack --config webpack.prod.js"\n\t}\n}`
let cluster                = loadFile('../filesToCopy/cluster.js')
let postcss                = loadFile('./files/postcss.config.js')

//enzo
let stateless              = loadFile('./files/statelessComponent.js')
let stateful               = loadFile('./files/statefulComponent.js')
let enzoReact              = loadFile('./files/enzoReact.js')
let enzoEndpointTemplate   = loadFile('./templates/enzoEndpointTemplate.js')
let enzoControllerTemplate = loadFile('./templates/enzoControllerTemplate.js')
let api                    = loadFile('./files/enzoAPI.js')

// this needs to be modified as the readline doesnt exist within this context
let reactSPAWithoutBackend = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/dist`)
  helpers.writeFile(`./${name}/index.html`, spaHtmlFile)
  helpers.writeFile(`./${name}/webpack.config.js`, spaWebpack)
  helpers.writeFile(`./${name}/webpack.prod.js`, prodWebpack)
  helpers.writeFile(`./${name}/postcss.config.js`, postcss)
  helpers.writeFile(`./${name}/src/index.js`, spaIndex)
  fs.mkdirSync(`./${name}/src/App`)
  helpers.writeFile(`./${name}/src/App/App.js`, spaReact)
  helpers.writeFile(`./${name}/src/App/App.css`, '')

  //enzo files 
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  helpers.writeFile(`./${name}/enzo/react.js`, enzoReact)
  helpers.writeFile(`./${name}/enzo/templates/statelessComponent.js`, stateless)
  helpers.writeFile(`./${name}/enzo/templates/statefulComponent.js`, stateful)
  
  // other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)
  helpers.writeFile(`./${name}/README.md`, readme)
  helpers.writeFile(`./${name}/.babelrc`, babel)

  fs.writeFileSync(`./${name}/package.json`, spaNoBE)
}

let writeFilesWithSPAReact = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/dist`)
  fs.mkdirSync(`./${name}/public`)
  helpers.writeFile(`./${name}/public/index.html`, spaHtmlFile)
  helpers.writeFile(`./${name}/webpack.config.js`, spaWebpack)
  helpers.writeFile(`./${name}/webpack.prod.js`, prodWebpack)
  helpers.writeFile(`./${name}/postcss.config.js`, postcss)
  helpers.writeFile(`./${name}/src/index.js`, spaIndex)
  fs.mkdirSync(`./${name}/src/App`)
  helpers.writeFile(`./${name}/src/App/App.js`, spaReact)
  helpers.writeFile(`./${name}/src/App/App.css`, '')
  helpers.writeFile(`./${name}/.babelrc`, babel)

  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/assets`)
  fs.writeFileSync(`./${name}/server/server.js`, spaServer)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  helpers.writeFile(`./${name}/server/routes.js`, routes)

  //enzo files 
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  fs.writeFile(`./${name}/enzo/react.js`, enzoReact)
  fs.writeFile(`./${name}/enzo/templates/statelessComponent.js`, stateless)
  fs.writeFile(`./${name}/enzo/templates/statefulComponent.js`, stateful)
  helpers.writeFile(`./${name}/enzo/api.js`, api)
  helpers.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)

  //other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)
  helpers.writeFile(`./${name}/.env`, '')
  helpers.writeFile(`./${name}/README.md`, readme)

  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = {reactSPAWithoutBackend, writeFilesWithSPAReact}