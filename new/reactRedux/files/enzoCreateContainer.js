let fs = require('fs')

let name = process.argv[2]
let capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
name = capitalizeFirstLetter(name)
let type = process.argv[3]

let dumbComponent = `import React from 'react'\n\nexport const ${name} = (props) => {\n\treturn(\n\t\t<div></div>\n\t)\n}`
let dumbReduxContainer = `import { connect } from react-redux\nimport { ${name} } from './${name}'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps, null)(${name})`

let smartComponent = `import React, { Component } from 'react'\nimport './${name}.css'\n\nclass ${name} extends Component {\n\tconstructor(props) {\n\t\tsuper(props)\n \t\tthis.state = {}\n\t}\n\n\trender() {\n\t\treturn (\n\t\t\t<div>Hello ${name}</div>\n\t\t)\n\t}\n}\n\n export default ${name}`
let reduxContainer = `import { connect } from 'react-redux'\nimport ${name} from './${name}'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps, null)(${name})`

if (name) {
  fs.mkdirSync(`./src/containers/${name}`)
  if (type === 'dumb') {
    fs.writeFile(`./src/containers/${name}/${name}.js`, dumbComponent, (err) => {
      if (err) return console.log(err)
      console.log(`The Component ${name} was created!`)
    })
    fs.writeFile(`./src/containers/${name}/${name}Container.js`, dumbReduxContainer, (err) => {
      if (err) return console.log(err)
      console.log(`The Container ${name} was created!`)
    })
  } else {
    fs.writeFile(`./src/containers/${name}/${name}.js`, smartComponent, (err) => {
      if (err) return console.log(err)
      console.log(`The Component ${name} was created!`)
    })
    fs.writeFile(`./src/containers/${name}/${name}Container.js`, reduxContainer, (err) => {
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