let fs = require('fs')
let path = require('path')

let name = process.argv[3]



// files that dont change
let gitignore = 'node_modules\n.DS_Store\n.env'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let babel = `{\n\t"presets": [\n\t\t"es2015",\n\t\t"react"\n\t]\n}`
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`

let railsServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nlet compression = require('compression')\napp.use(compression())\nconst routes = require('./routes')\nconst pages = require('./pages')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\napp.use('/', pages)\n\napp.use("/public", express.static(path.join(__dirname, "../public")))\n\n\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let railsHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div>Hello World!</div>\n\t\t<script src="public/home/index.js"></script>\n\t</body>\n</htlm>`
let pagesRoutes = `const express = require('express')\nconst r = express.Router()\nconst path = require('path')\nmodule.exports = r\n\nr.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/home/index.html')))`

let indexHtml = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t\t<link rel='stylesheet' type='text/css' href='main.css'/>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t<script src="index.js"></script>\n\t</body>\n</htlm>`
let mainCss = `h1 {\n\tcolor: blue\n}`


let railsApp = () => {
  fs.mkdirSync(`./${name}/public`)
  fs.mkdirSync(`./${name}/public/home`)
  fs.writeFile(`./${name}/public/home/index.html`, railsHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/public/home/index.js`, `console.log('hello world!')`, (err) => {
    if (err) throw err
  })

  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, railsServer, (err) => {
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
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
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
  createBasicApp
}