let fs = require('fs')
let path = require('path')
let name = process.argv[3]

// files that dont change
let gitignore = 'node_modules\n.DS_Store\n.env'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let babel = `{\n\t"presets": [\n\t\t"es2015",\n\t\t"react"\n\t]\n}`

// backend files 
let server = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`

// spa 
let spaServer = `let express = require('express')\nlet app = express()\nlet path = require('path')\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\nlet compression = require('compression')\napp.use(compression())\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.use("/build", express.static(path.join(__dirname, "../build")))\n\napp.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`
let spaWebpack = `const path = require('path')\n\nmodule.exports = {\n\tentry: './src/index.js',\n\toutput: {\n\t\tfilename: 'bundle.js',\n\t\tpath: path.resolve(__dirname, 'build')\n\t},\n\tmodule: {\n\t\tloaders: [\n\t\t\t{\n\t\t\t\ttest: /\\.js$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.jsx$/,\n\t\t\t\tloaders: "babel-loader",\n\t\t\t\texclude: /node_modules/\n\t\t\t},\n\t\t\t{\n\t\t\t\ttest: /\\.css$/,\n\t\t\t\tloaders: "style-loader!css-loader"\n\t\t\t}\n\t\t]\n\t},\n\tresolve: {\n\t\textensions: ['.js', '.jsx', '.css']\n\t}\n}`
let spaIndex = `import React from 'react'\nimport ReactDOM from 'react-dom'\nimport App from './App/App'\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n)`
let spaReact = `import React, { Component } from 'react' \n \nclass App extends Component {\n\tconstructor(props) {\n\t\tsuper(props) \n \t\tthis.state = {}\n\t } \n\n\trender() {\n\t\treturn(\n\t\t\t<div>Hello World</div>\n\t\t)\n\t}\n}\n\nexport default App`
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`
let spaHtmlFile = `<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset="utf-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">\n\t\t<title>Home</title>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script src="build/bundle.js"></script>\n\t</body>\n</htlm>`
let spaNoBE = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "open index.html && webpack --watch"\n\t}\n}`




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
  rl.close();
  console.log('Installing dependencies and running setup, this may take a moment')
  shell.cd(`${name}`)
  install('react react-dom webpack')
  installDevDependencies('babel-loader css-loader babel-core babel-preset-es2015 babel-preset-react')
  process.stdout.write('\033c')
  console.log('The project was created!')
  console.log(`cd into ${name} and run npm start, then refresh the page after a second`)
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