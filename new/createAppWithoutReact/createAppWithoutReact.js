let fs = require('fs')
let path = require('path')

let name = process.argv[3]



// files that dont change
let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.gitignore'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "gulp | nodemon --watch public server/server.js",\n\t\t"generate":"node enzo/index.js"\n\t}\n}`

let railsServer = fs.readFileSync(path.resolve(__dirname, './files/railsServer.js'), 'utf8')
let railsHtmlFile = fs.readFileSync(path.resolve(__dirname, './files/railsHtmlFile.html'), 'utf8')
let pagesRoutes = fs.readFileSync(path.resolve(__dirname, './files/pagesRoutes.js'), 'utf8')

let gulpFile = fs.readFileSync(path.resolve(__dirname, './files/gulpFile.js'), 'utf8')

let indexHtml = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t\t<link rel='stylesheet' type='text/css' href='main.css'/>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t<script src="index.js"></script>\n\t</body>\n</htlm>`
let mainCss = `h1 {\n\tcolor: blue\n}`


let railsApp = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/src/home`)
  fs.writeFile(`./${name}/src/home/index.html`, railsHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/home/index.js`, `console.log('hello world!')`, (err) => {
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
  fs.writeFile(`./${name}/gulpfile.js`, gulpFile, (err) => {
    if (err) throw err 
  })

  //enzo files
  let enzoIndex = fs.readFileSync(path.resolve(__dirname, './files/enzo.js'), 'utf8')
  fs.mkdirSync(`./${name}/enzo`)
  fs.writeFile(`./${name}/enzo/index.js`, enzoIndex, (err) => {
    if (err) throw err 
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
  createBasicApp
}