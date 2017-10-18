let fs = require('fs')

let name = process.argv[2]
let type = process.argv[3]

let dumbComponent = `import React from 'react'\n\nexport const ${name} = (props) => {\n\treturn(\n\t\t<div></div>\n\t)\n}`
let dumbReduxContainer = `import { connect } from react-redux\nimport { ${name} } from './${name}'\n\nconst mapStateToProps = (state) => {\n\treturn state\n}\n\nexport default connect(mapStateToProps, null)(${name})`

let smartComponent = `import React, { Component } from 'react'\nimport './${name}.css'\n\nclass ${name} extends Component {\n\tconstructor(props) {\n\t\tsuper(props)\n \t\tthis.state = {}\n\t}\n\n\trender() {\n\t\treturn (\n\t\t\t<div></div>\n\t\t)\n\t}\n}\n\n export default ${name}`
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
  }
}