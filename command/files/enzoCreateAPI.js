let fs = require('fs')
let path = require('path')

let name = process.argv[2]
if (name) {
  name = name.toLowerCase()
} else {
  console.log('No name provided. Try: npm run api <name>')
  process.exit()
}

let addLines = (data) => {
  data = data.split('\n')
  data.splice(0, 0, '\n\n')
  let final = data.join('\n')
  return final
}


let endpoints = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
endpoints = endpoints.replace(/Name/g, `${name}`)
let controller = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')
controller = controller.replace(/Name/g, `${name}`)


if (fs.existsSync(`./server/controllers/${name}.js`)) {
  endpoints = endpoints.split('\n').slice(3).join('\n')
  endpoints = addLines(endpoints)
  controller = addLines(controller)
  // append
  fs.appendFile(`./server/controllers/${name}.js`, controller, (err) => {
    if (err) throw err 
    console.log(`${name} controller appended.`)
  })
} else {
  // create
  fs.writeFile(`./server/controllers/${name}.js`, controller, (err) => {
    if (err) throw err
    console.log(`${name} controller created`)
  })
}


fs.appendFile('./server/routes.js', endpoints, (err) => {
  if (err) throw err
  console.log('Created Routes:')
  console.log('')
  console.log(`GET:    api/v1/${name}`)
  console.log(`PUT:    api/v1/${name}/:id`)
  console.log(`DELETE: api/v1/${name}/:id `)
  console.log(`POST:   api/v1/${name} `)
})


