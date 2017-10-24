let fs = require('fs')
let path = require('path')

let name = process.argv[2]
if (name) {
  let endpoints = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
  endpoints = endpoints.replace(/Name/g, `${name}`)
  let models = fs.readFileSync(path.resolve(__dirname, './templates/enzoModelTemplate.js'), 'utf8')
  models = models.replace(/Name/g, `${name}`)
  fs.appendFile('./server/routes.js', endpoints, (err) => {
    if (err) throw err
    console.log('controller endpoints created')
  })

  fs.writeFile(`./server/models/${name}.js`, models, (err) => {
    if (err) throw err
    console.log(`${name} models created`)
  })
}