let fs = require('fs')
let path = require('path')

let name = process.argv[3]

let server = `let express = require('express')\nlet app = express()\nlet bodyParser = require('body-parser')\nconst routes = require('./routes')\nlet port = (process.env.PORT || 3000)\napp.use(bodyParser.json())\n\napp.use('/api/v1', routes)\n\napp.listen(port, () => {\n\tconsole.log('Listening at port 3000')\n})`

// files that dont change
let gitignore = 'node_modules\n.DS_Store\n.env'
let readme = '## bootstrapped with enzo'
let routes = `const express = require('express')\nconst r = express.Router()\nmodule.exports = r`
let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t"build": "webpack --watch"\n\t}\n}`

let backendOnly = () => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, server, (err) => {
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
  fs.writeFile(`./${name}/.env`, '', (err) => {
    if (err) throw err
  })
  fs.writeFileSync(`./${name}/package.json`, spaNoSQLPck)
}

module.exports = { backendOnly }