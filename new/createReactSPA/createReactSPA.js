let fs = require('fs')
let path = require('path')
let name = process.argv[3]


let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.gitignore'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let babel = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.babelrc'), 'utf8')

// spa 
let spaServer = fs.readFileSync(path.resolve(__dirname, './files/spaServer.js'), 'utf8')
let spaWebpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
let spaIndex = fs.readFileSync(path.resolve(__dirname, './files/spaIndex.js'), 'utf8')
let spaReact = fs.readFileSync(path.resolve(__dirname, './files/spaReact.js'), 'utf8')
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaHtmlFile = fs.readFileSync(path.resolve(__dirname, './files/spaHtmlFile.html'), 'utf8')
let spaNoBE = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "open index.html && webpack --watch"\n\t}\n}`



// this needs to be modified as the readline doesnt exist within this context
let reactSPAWithoutBackend = () => {
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.writeFile(`./${name}/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoBE)
  // need to examine create react app more for hot reloading or use webpack dev server
}

let writeFilesWithSPAReact = () => {
  //frontend
  fs.mkdirSync(`./${name}/src`)
  fs.mkdirSync(`./${name}/build`)
  fs.mkdirSync(`./${name}/public`)
  fs.writeFile(`./${name}/public/index.html`, spaHtmlFile, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/webpack.config.js`, spaWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.babelrc`, babel, (err) => {
    if (err) throw err
  })
  //backend
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, spaServer, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = {reactSPAWithoutBackend, writeFilesWithSPAReact}