let fs = require('fs')
let path = require('path')

let name = process.argv[3]

let server = fs.readFileSync(path.resolve(__dirname, './files/server.js'), 'utf8')

// files that dont change

let gitignore = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/gitIgnore.js'), 'utf8')
let readme = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/readme.md'), 'utf8')
let routes = fs.readFileSync(path.resolve(__dirname, '../filesToCopy/commonFiles/routes.js'), 'utf8')
let enzoAPI = fs.readFileSync(path.resolve(__dirname, './files/enzoAPI.js'), 'utf8')

let spaNoSQLPck = `{\n\t"name": "${name}",\n\t"version": "1.0.0",\n\t"scripts": {\n\t\t"start": "nodemon server/server.js",\n\t\t\t"api": "node enzo/api.js"\n\t}\n}`

let backendOnly = () => {
  fs.mkdirSync(`./${name}/server`)
  fs.mkdirSync(`./${name}/server/models`)
  fs.writeFile(`./${name}/server/server.js`, server, (err) => {
    if (err) throw err
  })

  fs.writeFile(`./${name}/server/routes.js`, routes, (err) => {
    if (err) throw err
  })

  //enzo 

  fs.mkdirSync(`./${name}/enzo`)
  fs.writeFile(`./${name}/enzo/api.js`, enzoAPI, (err) => {
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