let fs = require('fs')
let path = require('path')
let name = process.argv[3]


let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/gitIgnore.js'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let babel = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/.babelrc'), 'utf8')

// spa 
let spaServer = fs.readFileSync(path.resolve(__dirname, './files/spaServer.js'), 'utf8')
let spaWebpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
let prodWebpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.prod.js'), 'utf8')
let spaIndex = fs.readFileSync(path.resolve(__dirname, './files/spaIndex.js'), 'utf8')
let spaReact = fs.readFileSync(path.resolve(__dirname, './files/spaReact.js'), 'utf8')
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch",\n\t\t"prod": "webpack --config webpack.prod.js"\n\t}\n}`
let spaHtmlFile = fs.readFileSync(path.resolve(__dirname, './files/spaHtmlFile.html'), 'utf8')
let spaNoBE = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "open index.html && webpack --watch",\n\t\t"react": "node enzo/react.js",\n\t\t"prod": "webpack --config webpack.prod.js"\n\t}\n}`

//enzo
let stateless = fs.readFileSync(path.resolve(__dirname, './files/statelessComponent.js'), 'utf8')
let stateful = fs.readFileSync(path.resolve(__dirname, './files/statefulComponent.js'), 'utf8')
let enzoReact = fs.readFileSync(path.resolve(__dirname, './files/enzoReact.js'), 'utf8')

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
  fs.writeFile(`./${name}/webpack.prod.js`, prodWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/App/App.css`, '', (err) => {
    if (err) throw err
  })

  //enzo files 
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  fs.writeFile(`./${name}/enzo/react.js`, enzoReact, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/statelessComponent.js`, stateless, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/statefulComponent.js`, stateful, (err) => {
    if (err) console.error(err)
  })
  

  // other files
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
  fs.writeFile(`./${name}/webpack.prod.js`, prodWebpack, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/index.js`, spaIndex, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`./${name}/src/App`)
  fs.writeFile(`./${name}/src/App/App.js`, spaReact, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/src/App/App.css`, '', (err) => {
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

  //enzo files 
  fs.mkdirSync(`./${name}/enzo`)
  fs.mkdirSync(`./${name}/enzo/templates`)
  fs.writeFile(`./${name}/enzo/react.js`, enzoReact, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/statelessComponent.js`, stateless, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/statefulComponent.js`, stateful, (err) => {
    if (err) console.error(err)
  })

  //other files
  fs.writeFile(`./${name}/.gitignore`, gitignore, (err) => {
    if (err) throw err
  })
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err 
  })

  fs.writeFile(`./${name}/README.md`, readme, (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = {reactSPAWithoutBackend, writeFilesWithSPAReact}