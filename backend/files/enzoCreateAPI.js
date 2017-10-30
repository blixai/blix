let fs = require('fs')
let path = require('path')

let name = process.argv[2]
if (name) {
  let endpoints = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
  endpoints = endpoints.replace(/Name/g, `${name}`)
  let controller = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')
  controller = models.replace(/Name/g, `${name}`)
  fs.appendFile('./server/routes.js', endpoints, (err) => {
    if (err) throw err
    console.log('Created Routes:')
    console.log(`GET: api/v1/${name}`)
    console.log(`PUT: api/v1/${name}/:id`)
    console.log(`DELETE: api/v1/${name}/:id `)
    console.log(`POST: api/v1/${name} `)
  })

  fs.writeFile(`./server/controllers/${name}.js`, controller, (err) => {
    if (err) throw err
    console.log(`${name} controllers created`)
  })
}