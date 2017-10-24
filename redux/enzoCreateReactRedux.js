let fs = require('fs')
let path = require('path')

let name = process.argv[2]
let capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
name = capitalizeFirstLetter(name)
let type = process.argv[3]

let dumbComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoDumbComponentTemplate.js'), 'utf8')
dumbComponentTemplate = dumbComponentTemplate.replace(/Name/g, `${name}`)

let dumbReduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/dumbReduxContainerTemplate.js'), 'utf8')
dumbReduxContainerTemplate = dumbReduxContainerTemplate.replace(/Name/g, `${name}`)

let smartComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/smartComponentTemplate.js'), 'utf8')
smartComponentTemplate = smartComponentTemplate.replace(/Name/g, `${name}`)

let reduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reduxContainerTemplate.js'), 'utf8')
reduxContainerTemplate = reduxContainerTemplate.replace(/Name/g, `${name}`)

if (name) {
  fs.mkdirSync(`./src/containers/${name}`)
  if (type === 'dumb') {
    fs.writeFile(`./src/containers/${name}/${name}.js`, dumbComponentTemplate, (err) => {
      if (err) return console.log(err)
      console.log(`The Component ${name} was created!`)
    })
    fs.writeFile(`./src/containers/${name}/${name}Container.js`, dumbReduxContainerTemplate, (err) => {
      if (err) return console.log(err)
      console.log(`The Container ${name} was created!`)
    })
  } else {
    fs.writeFile(`./src/containers/${name}/${name}.js`, smartComponentTemplate, (err) => {
      if (err) return console.log(err)
      console.log(`The Component ${name} was created!`)
    })
    fs.writeFile(`./src/containers/${name}/${name}Container.js`, reduxContainerTemplate, (err) => {
      if (err) return console.log(err)
      console.log(`The Container ${name} was created!`)
    })
    fs.writeFile(`./src/containers/${name}/${name}.css`, '', (err) => {
      if (err) return console.log(err)
      console.log('CSS File was Created')
    })
    if (fs.existsSync('./src/containers/App/App.js')) {
      let search = '<Switch>'
      let body = fs.readFileSync('./src/containers/App/App.js', 'utf8').toString().split('\n')
      body.splice(4, 0, `import ${name}Container from '../${name}/${name}Container'`)
      let newBody = body.join('\n')
      let position = newBody.indexOf(search)
      let newRoute = `\n\t\t\t\t  <Route exact path='/${name.toLowerCase()}' render={(history) => {\n\t\t\t\t\u0020\u0020\u0020\u0020return <${name}Container/>\n\t\t\t\t  }}/>`
      let output = [newBody.slice(0, position + 8), newRoute, newBody.slice(position + 8)].join('')
      fs.writeFile('./src/containers/App/App.js', output, (err) => {
        if (err) console.error(err)
      })
    }
  }
} else {
  console.log(`You need to supply a name in order to create new components/containers.`)
  console.log('Please try again.')
}