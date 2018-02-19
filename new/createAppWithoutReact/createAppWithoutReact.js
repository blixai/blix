let fs      = require('fs')
let path    = require('path')
let helpers = require('../../helpers')
let name    = process.argv[3]

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

// files that dont change
let gitignore              = loadFile('../filesToCopy/commonFiles/gitIgnore.js')
let readme                 = loadFile('../filesToCopy/commonFiles/readme.md')
let routes                 = loadFile('../filesToCopy/commonFiles/routes.js')
let spaNoSQLPck            = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon --watch dist server/cluster.js",\n\t\t"page":"node enzo/page.js",\n\t\t"api": "node enzo/api.js",\n\t\t"build": "webpack --watch",\n\t\t"prod": "webpack --config webpack.prod.js"\n\t}\n}`
let railsPackage           = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "gulp | nodemon --watch dist server/cluster.js",\n\t\t"page":"node enzo/page.js",\n\t\t"api": "node enzo/api.js",\n\t\t"build": "gulp",\n\t\t"prod": "gulp production"\n\t}\n}`
let cluster                = loadFile('../filesToCopy/cluster.js')

let railsServer            = loadFile('./files/railsServer.js')
let railsHtmlFile          = loadFile('./files/railsHtmlFile.html')
let railsRoutes            = loadFile('./files/railsRoutes.js')

let gulpFile               = loadFile('./files/gulpFile.js')

let indexHtml              = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t\t<link rel='stylesheet' type='text/css' href='main.css'/>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t<script src="index.js"></script>\n\t</body>\n</htlm>`
let mainCss                = `h1 {\n\tcolor: blue\n}`

let enzoNewPage            = loadFile('./files/enzoNewPage.js')
let htmlPageTemplate       = loadFile( './templates/htmlPageTemplate.html')
let enzoAPI                = loadFile('./files/enzoAPI.js')
let enzoEndpointTemplate   = loadFile('./templates/enzoEndpointTemplate.js')
let enzoControllerTemplate = loadFile('./templates/enzoControllerTemplate.js')

// pug
let enzoPugPage            = loadFile('./files/enzoPugPage.js')
let pugTemplate            = loadFile('./templates/pugTemplate.pug')
let pugServer              = loadFile('./files/pugServer.js')
let pugRoutes              = loadFile('./files/pugRoutes.js')
let pugHomepage            = loadFile('./templates/pugHomepage.pug')
let error                  = loadFile('./files/error.pug')
let layout                 = loadFile('./files/layout.pug')

//webpack
let webpackConfig          = loadFile('./files/webpack.config.js')
let webpackProd            = loadFile('./files/webpack.prod.js')
let babel                  = loadFile('./files/.babelrc')
let postcss                = loadFile('./files/postcss.config.js')

let railsApp = () => {
  // src folder
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/src/home`)
  helpers.writeFile(`./${name}/src/home/index.html`, railsHtmlFile)
  helpers.writeFile(`./${name}/src/home/index.js`, `console.log('hello world!')`)
  helpers.writeFile(`./${name}/src/home/main.css`, `body {\ncolor: blue;\n}`)
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)
  fs.mkdirSync(`./${name}/dist`)
  fs.writeFileSync(`./${name}/server/server.js`,  railsServer)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  helpers.writeFile(`./${name}/server/routes.js`,  railsRoutes)

  //other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)

  helpers.writeFile(`./${name}/README.md`, readme)
  helpers.writeFile(`./${name}/.env`, '')
  // package json 
  fs.writeFileSync(`./${name}/package.json`, railsPackage)

  helpers.writeFile(`./${name}/gulpfile.js`, gulpFile)

  //enzo files
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  helpers.writeFile(`./${name}/enzo/page.js`, enzoNewPage)
  helpers.writeFile(`./${name}/enzo/templates/htmlPageTemplate.html`, htmlPageTemplate)
  helpers.writeFile(`./${name}/enzo/api.js`, enzoAPI)
  helpers.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)
}

let pugApp = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/src/home`)
  helpers.writeFile(`./${name}/src/home/index.js`, `import './main.css'\nconsole.log('hello world!')`)
  helpers.writeFile(`./${name}/src/home/main.css`, `body {\ncolor: blue;\n}`)
  
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)
  fs.mkdirSync(`./${name}/dist`)
  fs.mkdirSync(`./${name}/server/views`)
  fs.mkdirSync(`./${name}/server/views/home`)

  helpers.writeFile(`./${name}/server/views/home/index.pug`, pugHomepage)
  helpers.writeFile(`./${name}/server/views/error.pug`, error)
  helpers.writeFile(`./${name}/server/views/layout.pug`, layout)
  fs.writeFileSync(`./${name}/server/server.js`, pugServer)
  helpers.writeFile(`./${name}/server/cluster.js`, cluster)
  
  let homeController = `exports.index = (req, res) => {\n\tres.render('home/index', {})\n}`
  helpers.writeFile(`./${name}/server/controllers/home.js`, homeController)

  helpers.writeFile(`./${name}/server/routes.js`, pugRoutes)

  //other files
  helpers.writeFile(`./${name}/.gitignore`, gitignore)

  helpers.writeFile(`./${name}/README.md`, readme)
  helpers.writeFile(`./${name}/.env`, '')
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
  // webpack
  helpers.writeFile(`./${name}/webpack.config.js`, webpackConfig)
  helpers.writeFile(`./${name}/webpack.prod.js`, webpackProd)
  helpers.writeFile(`./${name}/postcss.config.js`, postcss)
  helpers.writeFile(`./${name}/.babelrc`, babel)
  //enzo files
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  helpers.writeFile(`./${name}/enzo/page.js`, enzoPugPage)
  helpers.writeFile(`./${name}/enzo/templates/pugTemplate.pug`, pugTemplate)
  helpers.writeFile(`./${name}/enzo/api.js`, enzoAPI)
  helpers.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`,   enzoEndpointTemplate)
  helpers.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate)
}


let createBasicApp = () => {
  helpers.writeFile(`./${name}/README.md`, readme)
  helpers.writeFile(`./${name}/.gitignore`, gitignore)
  helpers.writeFile(`./${name}/index.js`, `console.log('hello world!')`)
  helpers.writeFile(`./${name}/index.html`, indexHtml)
  helpers.writeFile(`./${name}/main.css`, mainCss)
}

module.exports = {
  railsApp,
  createBasicApp,
  pugApp
}