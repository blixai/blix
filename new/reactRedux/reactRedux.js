let fs      = require('fs')
let path    = require('path')
let name    = process.argv[3]
let helpers = require('../../helpers')

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/cluster.js",\n\t\t"build": "webpack --watch",\n\t\t"redux": "node enzo/createComponentAndContainer.js",\n\t\t"api": "node enzo/enzoCreateAPI.js",\n\t\t"prod": "webpack --config webpack.prod.js",\n\t\t"action": "node enzo/action.js"\n\t}\n}`
let spaWebpack  = loadFile('./files/webpack.config.js')
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<link href="build/main.css" rel="stylesheet">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`

let gitignore = loadFile('../filesToCopy/commonFiles/gitIgnore.js')
let readme    = loadFile('../filesToCopy/commonFiles/readme.md')
let routes    = loadFile('../filesToCopy/commonFiles/routes.js')
let babel     = loadFile('../filesToCopy/commonFiles/.babelrc')
let cluster   = loadFile('../filesToCopy/cluster.js')

let reactReduxServer   = loadFile('./files/reactReduxServer.js')
let rootReducer        = loadFile('./files/rootReducer.js')
let configStore        = loadFile('./files/configStore.js')
let reactReduxIndex    = loadFile('./files/reactReduxIndex.js')
let appContainer       = loadFile('./files/appContainer.js')
let appRouter          = loadFile('./files/appRouter.js')
let homeContainer      = loadFile('./files/homeContainer.js')
let home               = loadFile('./files/home.js')
let appRouterNoBackend = loadFile('./files/appRouterNoBackend.js')

let packageJSONWithoutBackend   = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "webpack-dev-server --output-public-path=/build/ --inline --hot --open",\n\t\t"build": "webpack --watch",\n\t\t"prod": "webpack --config webpack.prod.js",\n\t\t"action": "node enzo/action.js",\n\t\t"redux": "node enzo/createComponentAndContainer.js"\n\t}\n}`
let enzoCreateContainer         = loadFile('./files/enzoCreateContainer.js')
let enzoCreateAPI               = loadFile('./files/enzoCreateAPI.js')
let enzoEndpointTemplate        = loadFile('./templates/enzoEndpointTemplate.js')
let enzoControllerTemplate      = loadFile('./templates/enzoControllerTemplate.js')
let dumbReduxContainerTemplate  = loadFile('./templates/dumbReduxContainerTemplate.js')
let enzoDumbComponentTemplate   = loadFile('./templates/enzoDumbComponentTemplate.js')
let smartComponentTemplate      = loadFile('./templates/smartComponentTemplate.js')
let reduxContainerTemplate      = loadFile('./templates/reduxContainerTemplate.js')
let prodWebpack                 = loadFile('./files/webpack.prod.js')
let action                      = loadFile('./files/enzoCreateAction.js')
let actionTemplate              = loadFile('./templates/actionTemplate.js')
let reducerTemplate             = loadFile('./templates/reducerTemplate.js')
let postcss                     = loadFile('./files/postcss.config.js')


// 404 page
let pageNotFound = loadFile('./files/pageNotFound.js')


let ReactReduxWithBackend = () => {

  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.mkdirSync(`./${name}/public`)
  helpers.writeFile(`./${name}/public/index.html`, spaHtmlFile)
  helpers.writeFile(`./${name}/webpack.config.js`, spaWebpack)
  helpers.writeFile(`./${name}/webpack.prod.js`, prodWebpack)
  helpers.writeFile(`./${name}/postcss.config.js`, postcss)
  helpers.writeFile(`./${name}/src/index.js`, reactReduxIndex)
  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)
  helpers.writeFile(`./${name}/src/containers/App/App.js`, appRouter)
  helpers.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer)
  // need to write home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  helpers.writeFile(`./${name}/src/containers/Home/Home.js`, home, (err) => {
    if (err) throw err
  })
  helpers.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer)
  helpers.writeFile(`./${name}/src/containers/Home/Home.css`, '')
  fs.mkdirSync(`./${name}/src/containers/PageNotFound`)
  helpers.writeFile(`./${name}/src/containers/PageNotFound/PageNotFound.js`, pageNotFound)
  helpers.writeFile(`./${name}/src/configStore.js`, configStore)
  helpers.writeFile(`./${name}/.babelrc`, babel)
  fs.mkdirSync(`./${name}/src/actions`)
  helpers.writeFile(`./${name}/src/actions/index.js`, '')
  fs.mkdirSync(`./${name}/src/reducers`)
  helpers.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer)

  // enzo

  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)

  // create React Components/Containers
  helpers.writeFile(`./${name}/enzo/createComponentAndContainer.js`, enzoCreateContainer)
  helpers.writeFile(`./${name}/enzo/templates/dumbReduxContainerTemplate.js`, dumbReduxContainerTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoDumbComponentTemplate.js`, enzoDumbComponentTemplate)
  helpers.writeFile(`./${name}/enzo/templates/smartComponentTemplate.js`, smartComponentTemplate)
  helpers.writeFile(`./${name}/enzo/templates/reduxContainerTemplate.js`, reduxContainerTemplate)

  // enzo create action
 
  helpers.writeFile(`./${name}/enzo/action.js`, action)
  helpers.writeFile(`./${name}/enzo/templates/actionTemplate.js`, actionTemplate)
  helpers.writeFile(`./${name}/enzo/templates/reducerTemplate.js`, reducerTemplate)

  // create API
  helpers.writeFile(`./${name}/enzo/enzoCreateAPI.js`, enzoCreateAPI)
  helpers.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)

  //backend
  fs.mkdirSync(`./${name}/assets`)
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)

  helpers.writeFile(`./${name}/server/server.js`, reactReduxServer)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  helpers.writeFile(`./${name}/server/routes.js`, routes)

  //other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)

  helpers.writeFile(`./${name}/README.md`, readme)
  helpers.writeFile(`./${name}/.env`, '')

  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}


let reactReduxWithoutBackend = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  helpers.writeFile(`./${name}/index.html`, spaHtmlFile)
  helpers.writeFile(`./${name}/webpack.config.js`, spaWebpack)
  helpers.writeFile(`./${name}/webpack.prod.js`, prodWebpack)
  helpers.writeFile(`./${name}/postcss.config.js`, postcss)
  helpers.writeFile(`./${name}/src/index.js`, reactReduxIndex)

  fs.mkdirSync(`./${name}/src/containers`)
  fs.mkdirSync(`./${name}/src/containers/App`)

  helpers.writeFile(`./${name}/src/containers/App/App.js`, appRouterNoBackend)
  helpers.writeFile(`./${name}/src/containers/App/AppContainer.js`, appContainer)

  // home folder, file and home container
  fs.mkdirSync(`./${name}/src/containers/Home`)
  helpers.writeFile(`./${name}/src/containers/Home/Home.js`, home)
  helpers.writeFile(`./${name}/src/containers/Home/HomeContainer.js`, homeContainer)
  helpers.writeFile(`./${name}/src/containers/Home/Home.css`, '')

  helpers.writeFile(`./${name}/src/configStore.js`, configStore)
  helpers.writeFile(`./${name}/.babelrc`, babel)
  fs.mkdirSync(`./${name}/src/actions`)
  helpers.writeFile(`./${name}/src/actions/index.js`, '')
  fs.mkdirSync(`./${name}/src/reducers`)
  helpers.writeFile(`./${name}/src/reducers/rootReducer.js`, rootReducer)

  // enzo

  fs.mkdirSync(`./${name}/enzo`)
  helpers.writeFile(`./${name}/enzo/createComponentAndContainer.js`, enzoCreateContainer)
  fs.mkdirSync(`./${name}/enzo/templates`)

  // create React Components/Containers
  helpers.writeFile(`./${name}/enzo/createComponentAndContainer.js`, enzoCreateContainer)
  helpers.writeFile(`./${name}/enzo/templates/dumbReduxContainerTemplate.js`, dumbReduxContainerTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoDumbComponentTemplate.js`, enzoDumbComponentTemplate)
  helpers.writeFile(`./${name}/enzo/templates/smartComponentTemplate.js`, smartComponentTemplate)
  helpers.writeFile(`./${name}/enzo/templates/reduxContainerTemplate.js`, reduxContainerTemplate)

  // enzo create action

  helpers.writeFile(`./${name}/enzo/action.js`, action)
  helpers.writeFile(`./${name}/enzo/templates/actionTemplate.js`, actionTemplate)
  helpers.writeFile(`./${name}/enzo/templates/reducerTemplate.js`, reducerTemplate)

  //other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)
  helpers.writeFile(`./${name}/README.md`, readme)

  fs.writeFileSync(`./${name}/package.json`, packageJSONWithoutBackend)
}

module.exports = {
  ReactReduxWithBackend,
  reactReduxWithoutBackend
}