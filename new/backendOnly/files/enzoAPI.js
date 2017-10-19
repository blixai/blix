let fs = require('fs')

let name = process.argv[2]
if (name) {
  let endpoints = `\n\nconst ${name} = require('./models/${name}')\n\nr.get('/${name}', ${name}.get)\nr.put('/${name}/:id', ${name}.put)\nr.delete('/${name}/:id', ${name}.delete${name})\nr.post('/${name}', ${name}.post)`
  let models = `const get = (req, res) => {}\n\nconst put = (req, res) => {}\n\nconst delete${name} = (req, res) => {}\n\nconst post = (req, res) => {}\n\nmodule.exports = {\n\tget:get,\n\tput:put,\n\tdelete${name}:delete${name},\n\tpost:post\n}`

  fs.appendFile('./server/routes.js', endpoints, (err) => {
    if (err) throw err
    console.log('controller endpoints created')
  })

  fs.writeFile(`./server/models/${name}.js`, models, (err) => {
    if (err) throw err
    console.log(`${name} models created`)
  })
}