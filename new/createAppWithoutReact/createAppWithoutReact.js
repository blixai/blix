let fs = require('fs')
let path = require('path')

let name = process.argv[3]



// files that dont change
let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/gitIgnore.js'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon --watch public server/cluster.js",\n\t\t"page":"node enzo/page.js",\n\t\t"api": "node enzo/api.js",\n\t\t"build": "webpack --watch",\n\t\t"prod": "webpack --config webpack.prod.js"\n\t}\n}`
let railsPackage = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "gulp | nodemon --watch public server/cluster.js",\n\t\t"page":"node enzo/page.js",\n\t\t"api": "node enzo/api.js",\n\t\t"build": "gulp",\n\t\t"prod": "gulp production"\n\t}\n}`
let cluster = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/cluster.js'), 'utf8')

let railsServer = fs.readFileSync(path.resolve(__dirname, './files/railsServer.js'), 'utf8')
let railsHtmlFile = fs.readFileSync(path.resolve(__dirname, './files/railsHtmlFile.html'), 'utf8')
let pagesRoutes = fs.readFileSync(path.resolve(__dirname, './files/pagesRoutes.js'), 'utf8')

let gulpFile = fs.readFileSync(path.resolve(__dirname, './files/gulpFile.js'), 'utf8')

let indexHtml = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t\t<link rel='stylesheet' type='text/css' href='main.css'/>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t<script src="index.js"></script>\n\t</body>\n</htlm>`
let mainCss = `h1 {\n\tcolor: blue\n}`

let enzoNewPage = fs.readFileSync(path.resolve(__dirname, './files/enzoNewPage.js'), 'utf8')
let htmlPageTemplate = fs.readFileSync(path.resolve(__dirname, './templates/htmlPageTemplate.html'), 'utf8')
let enzoAPI = fs.readFileSync(path.resolve(__dirname, './files/enzoAPI.js'), 'utf8')
let enzoEndpointTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
let enzoControllerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')

// pug
let enzoPugPage = fs.readFileSync(path.resolve(__dirname, './files/enzoPugPage.js'), 'utf8')
let pugTemplate = fs.readFileSync(path.resolve(__dirname, './templates/pugTemplate.pug'), 'utf8')
let enzoPugEndpoint = fs.readFileSync(path.resolve(__dirname, './templates/pugEndpointTemplate.js'), 'utf8')
let pugServer = fs.readFileSync(path.resolve(__dirname, './files/pugServer.js'), 'utf8')
let pugRoutes = fs.readFileSync(path.resolve(__dirname, './files/pugRoutes.js'), 'utf8')
let pugHomepage = fs.readFileSync(path.resolve(__dirname, './templates/pugHomepage.pug'), 'utf8')
let error = fs.readFileSync(path.resolve(__dirname, './files/error.pug'), 'utf8')
let layout = fs.readFileSync(path.resolve(__dirname, './files/layout.pug'), 'utf8')

//webpack
let webpackConfig = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
let webpackProd = fs.readFileSync(path.resolve(__dirname, './files/webpack.prod.js'), 'utf8')
let babel = fs.readFileSync(path.resolve(__dirname, './files/.babelrc'), 'utf8')
let postcss = fs.readFileSync(path.resolve(__dirname, './files/postcss.config.js'), 'utf8')

let railsApp = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/src/home`)
  fs.writeFile(`./${name}/src/home/index.html`, railsHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/home/index.js`, `import './main.css'\nconsole.log('hello world!')`, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/home/main.css`, `body {\ncolor: blue;\n}`, (err) => {
    if (err) throw err
  })  
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)
  fs.mkdirSync(`./${name}/public`)
  fs.writeFile(`./${name}/server/server.js`, railsServer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/server/cluster.js`, cluster, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/server/pages.js`, pagesRoutes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, railsPackage)
  fs.writeFile(`./${name}/gulpfile.js`, gulpFile, (err) => {
    if (err) throw err 
  })

  //enzo files
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  fs.writeFile(`./${name}/enzo/page.js`, enzoNewPage, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/enzo/templates/htmlPageTemplate.html`, htmlPageTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/api.js`, enzoAPI, (err) => {
    if (err) console.error(err) 
  })
  fs.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoEndpointTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate, (err) => {
    if (err) console.error(err)
  })
}

let pugApp = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/src/home`)
  fs.writeFile(`./${name}/src/home/index.js`, `import './main.css'\nconsole.log('hello world!')`, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/home/main.css`, `body {\ncolor: blue;\n}`, (err) => {
    if (err) throw err
  })
  
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.mkdirSync(`./${name}/server/controllers`)
  fs.mkdirSync(`./${name}/assets`)
  fs.mkdirSync(`./${name}/public`)
  fs.mkdirSync(`./${name}/server/views`)
  fs.mkdirSync(`./${name}/server/views/home`)

  fs.writeFile(`./${name}/server/views/home/index.pug`, pugHomepage, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/server/views/error.pug`, error, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/server/views/layout.pug`, layout, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/server/server.js`, pugServer, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/server/cluster.js`, cluster, (err) => {
    if (err) throw err 
  })
  
  let homeController = `exports.index = (req, res) => {\n\tres.render('home/index', {})\n}`
  fs.writeFile(`./${name}/server/controllers/home.js`, homeController, (err) => {
    if (err) throw err 
  })

  fs.writeFile(`./${name}/server/routes.js`, pugRoutes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
  // webpack
  fs.writeFile(`./${name}/webpack.config.js`, webpackConfig, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/webpack.prod.js`, webpackProd, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/postcss.config.js`, postcss, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) console.error(err)
  })
  //enzo files
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  fs.writeFile(`./${name}/enzo/page.js`, enzoPugPage, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/enzo/templates/pugTemplate.pug`, pugTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/api.js`, enzoAPI, (err) => {
    if (err) console.error(err) 
  })
  fs.writeFile(`./${name}/enzo/templates/enzoEndpointTemplate.js`, enzoPugEndpoint, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/enzoControllerTemplate.js`, enzoControllerTemplate, (err) => {
    if (err) console.error(err)
  })
}


let createBasicApp = () => {
  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/index.js`, `console.log('hello world!')`, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/index.html`, indexHtml, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/main.css`, mainCss, (err) => {
    if (err) throw err
  })
}

module.exports = {
  railsApp,
  createBasicApp,
  pugApp
}