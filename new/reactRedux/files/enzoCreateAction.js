let fs = require('fs')
let path = require('path')
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
let log = console.log
let lowercase;
let upperCase;
let globalReducer;

rl.question('? What is the actions name: ', (ans) => {
  lowercase = ans.toLowerCase()
  upperCase = ans.toUpperCase()
  let existingActions = fs.readFileSync('./src/actions/index.js', 'utf8').toString()
  if (existingActions.indexOf(lowercase) !== -1) {
    log(`Action ${lowercase} already exists.`)
  } else {
    let actionTemplate = fs.readFileSync(path.resolve(__dirname, './templates/actionTemplate.js'), 'utf8')
    actionTemplate = actionTemplate.replace(/name/g, lowercase)
    actionTemplate = actionTemplate.replace(/NAME/g, upperCase)
    fs.appendFile('./src/actions/index.js', actionTemplate, (err) => {
      if (err) throw err
    })
  }
  rl.question('? What is the reducers name: ', (reducer) => {
    globalReducer = reducer.toLowerCase()
    if (fs.existsSync(`./src/reducers/${globalReducer}.js`)) {
      // add it to the switch
      let body = fs.readFileSync(`./src/reducers/${globalReducer}.js`, 'utf8').toString()
      if (body.indexOf(`case "${upperCase}":`) !== -1) {
        // action exists in reducer, dont add 
        log(`Action ${lowercase} already exists in ${globalReducer}`)
        importAction()
      } else {
        let search = `switch (action.type) {`
        let position = body.indexOf(search)
        if (position !== -1) {
          let newAction = `\n\t\tcase "${upperCase}":\n\t\t\treturn action.payload`
          let output = [body.slice(0, position + 22), newAction, body.slice(position + 22)].join('')
          fs.writeFile(`./src/reducers/${globalReducer}.js`, output, (err) => {
            if (err) throw err
            importAction()
          })
        } else {
          console.log('Reducer file found but something went wrong. Check the file for a switch statement.')
          rl.close()
        }
      }
    } else {
      // create reducer
      let reducerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reducerTemplate.js'), 'utf8')
      reducerTemplate = reducerTemplate.replace(/NAME/g, upperCase)
      reducerTemplate = reducerTemplate.replace(/name/g, globalReducer)
      fs.writeFile(`./src/reducers/${reducer}.js`, reducerTemplate, (err) => {
        if (err) throw err
      })

      // append it to rootreducer
      let search = 'combineReducers({'
      let body = fs.readFileSync('./src/reducers/rootReducer.js', 'utf8').toString().split('\n')
      body.splice(1, 0, `import ${reducer} from './${reducer}'`)
      let newBody = body.join('\n')
      let output;
      let position;
      let newReducer;
      let commaDeterminer = `combineReducers({})`
      if (newBody.indexOf(commaDeterminer) !== -1) {
        position = newBody.indexOf(search)
        newReducer = `\n\t${reducer}\n`
        output = [newBody.slice(0, position + 17), newReducer, newBody.slice(position + 17)].join('')
      } else {
        position = newBody.indexOf(search)
        newReducer = `\n\t${reducer},`
        output = [newBody.slice(0, position + 17), newReducer, newBody.slice(position + 17)].join('')
      }
      fs.writeFile('./src/reducers/rootReducer.js', output, (err) => {
        if (err) throw err
        importAction()
      })
    }
  })
})

let importAction = () => {
  let folders = []
  let p = `./src/containers`

  fs.readdirSync('./src/containers').forEach(file => {
    let filePath = `${p}/` + `${file}`
    let stats = fs.statSync(filePath, 'utf8')
    if (stats.isDirectory()) {
      folders.push(file)
    }
  })
  log('Containers: ', folders)
  rl.question('Which containers should this action apply to? ', (containers) => {
    containers = containers.toLowerCase().split(' ')
    containers.map(folder => {
      folder = folder.charAt(0).toUpperCase() + folder.slice(1)
      if (folders.includes(folder)) {
        let container = fs.readFileSync(`./src/containers/${folder}/${folder}Container.js`, 'utf8').toString()
        let search = `} from '../../actions'`
        if (container.indexOf(search) !== -1) {
          // if import from actions already exists then insert a new one with a comma before it
          let index = container.indexOf(search)
          let action = `, ${lowercase} `
          container = [container.slice(0, index), action, container.slice(index)]
          let mapDispatchToProps = `const mapDispatchToProps`
          container = container.join('')
          if (container.indexOf(mapDispatchToProps) !== -1) {
            // if mapDispatch to props function exists then insert the handle action to it
            let capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1)
            let handler = `handle${capitalizeAction}: (input) => {\n\t\t\tdispatch(${lowercase}(input))\n\t\t},\n\t\t`
            let find = `const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\t`
            let foundIndex = container.indexOf(find)
            container = [container.slice(0, foundIndex + find.length), handler, container.slice(foundIndex + find.length)].join('')
            fs.writeFile(`./src/containers/${folder}/${folder}Container.js`, container, (err) => {
              if (err) console.error(err)
            })
          } else {
            // mapDispatch doesnt exist create it, probably also see if its connected 
            container = container.split('\n')
            let capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1)
            let addDispatch = `const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\thandle${capitalizeAction}: (input) =>{\n\t\t\tdispatch(${lowercase}(input))\n\t\t}\n\t}\n}`
            container.splice(8, 0, addDispatch)
            container = container.join('\n')
            container = container.replace(/null/g, 'mapDispatchToProps')
            fs.writeFile(`./src/containers/${folder}/${folder}Container.js`, container, (err) => {
              if (err) console.error(err)
              log(`imported ${lowercase} into ${folder}Container and created mapDispatchToProps`)
            })
          }
        } else {
          // add import action, add mapDispatchToProps, and add mapDispatchtoprops to connect at bottom of file
          container = container.split('\n')
          let capitalizeAction = lowercase.charAt(0).toUpperCase() + lowercase.slice(1)
          container.splice(1, 0, `import { ${lowercase} } from '../../actions'`)
          let addDispatch = `const mapDispatchToProps = (dispatch) => {\n\treturn {\n\t\thandle${capitalizeAction}: (input) => {\n\t\t\tdispatch(${lowercase}(input))\n\t\t}\n\t}\n}\n\n`
          container.splice(8, 0, addDispatch)
          container = container.join('\n')
          container = container.replace(/null/g, 'mapDispatchToProps')
          fs.writeFile(`./src/containers/${folder}/${folder}Container.js`, container, (err) => {
            if (err) throw err
            log(`imported ${lowercase} into ${folder}Container and created mapDispatchToProps`)
          })
          // probably need to dispatch it and make sure it is connected when exported
        }
      }
    })
    rl.close()
  })
}

