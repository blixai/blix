let fs = require('fs')
let path = require('path')
let log = console.log 

let inquirer = require('inquirer')
let prompt = inquirer.prompt

let commands = {
  type: 'list',
  message: 'Add a enzo command to a project:',
  pageSize: 10,
  name: 'commands',
  choices: [
    { name: 'custom: create your own' , value: 'custom'},
    { name: 'react: create a new react statefull or stateless component', value: 'react' },
    { name: 'redux: create a new react component, a redux container, and a new route in your routing component', value: 'redux' },
    { name: 'api: create new api endpoints and controller', value: 'api' },
    { name: 'page: create a new folder, html, css, and js files along with adding the route in pages.js', value: 'page' },
    { name: 'model: create a new Bookshelf model and migration or a Mongoose model', value: 'model' },
    { name: 'action: create or add redux action to new or existing reducer', value: 'action' }
  ]
}

let custom = {
  type: 'input',
  message: 'What do you want to name this command:',
  name: 'custom'
}

let addScript = (command, script) => {
  if (fs.existsSync('./package.json')) {
    let buffer = fs.readFileSync('package.json')
    let json = JSON.parse(buffer)
    json.scripts[command] = script
    let newPackage = JSON.stringify(json, null, 2)
    fs.writeFileSync('package.json', newPackage)
  } else {
    process.exit()
  }
}


let command = () => {
  process.stdout.write('\033c')

  prompt([commands]).then(answer => {
    switch (answer.commands) {
      case "react":
        addReact()
        break;
      case "redux":
        addRedux()
        break;
      case "api":
        addAPI()
        break;
      case "page":
        addPage()
        break
      case "model": 
        addModel()
        break;
      case "action":
        addAction()
        break;
      case "custom":
        prompt([custom]).then(custom => {
          createNew(custom.custom)
        }) 
        break;
      default:
        log('Something went wrong. Please try again')
        break;
    }
  })
}


let addAction = () => {
  addScript('action', 'node enzo/action.js')
  checkEnzoExists()
  let action = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAction.js'), 'utf8')
  let actionTemplate = fs.readFileSync(path.resolve(__dirname, './templates/actionTemplate.js'), 'utf8')
  let reducerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reducerTemplate.js'), 'utf8')
  fs.writeFile('./enzo/action.js', action, (err) => {
    if (err) throw err 
  })
  fs.writeFile('./enzo/templates/actionTemplate.js', actionTemplate, (err) => {
    if (err) throw err 
  })
  fs.writeFile('./enzo/templates/reducerTemplate.js', reducerTemplate, (err) => {
    if (err) throw err 
  })
}

let model = {
  type: 'list',
  message: 'Pick a model type:',
  name: 'model',
  choices: [
    { name: 'Mongoose', value: 'm' },
    { name: 'Bookshelf', value: 'b' }
  ]
}


let addModel = () => {
  addScript('model', 'node enzo/model.js')
  prompt([model]).then(ans => {
    if (ans.model === 'm') {
      checkEnzoExists()
      let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateMongooseModel.js'), 'utf8')
      let schemaTemplate = fs.readFileSync(path.resolve(__dirname, './templates/schemaTemplate.js'), 'utf8')
      fs.writeFile('./enzo/model.js', model, (err) => {
        if (err) throw err 
        log('Created model file in enzo')
      })
      fs.writeFile('./enzo/templates/schemaTemplate.js', schemaTemplate, (err) => {
        if (err) throw err 
        log('Created Mongoose schema template in enzo/templates')
      })
      // add moongoose
    } else {
      checkEnzoExists()
      let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateBookshelfModel.js'), 'utf8')
      let migrationTemplate = fs.readFileSync(path.resolve(__dirname, './templates/migrationTemplate.js'), 'utf8')
      let bookshelf = fs.readFileSync(path.resolve(__dirname, './templates/bookshelf.js'), 'utf8')
      let enzoBookshelfModelTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoBookshelfModelTemplate.js'), 'utf8')
      fs.writeFile('./enzo/model.js', model, (err) => {
        if (err) throw err 
        log('Created model file in enzo')
      })
      fs.writeFile('./enzo/templates/migrationTemplate.js', migrationTemplate, (err) => {
        if (err) throw err 
        log('Created knex migration template in enzo/templates')
      })
      fs.writeFile('./enzo/templates/enzoBookshelfModelTemplate.js', enzoBookshelfModelTemplate, (err) => {
        if (err) throw err 
        log('Created Bookshelf template file in enzo/templates')
      })
      try {
        fs.writeFileSync('./server/models/bookshelf.js', bookshelf)
        log('Created Bookshelf file in server/models/bookshelf.js')
      } catch(e) {
        log(`Failed to create a bookshelf.js file in server/models. You'll need to create this yourself.`)
      }
    }
  })
}

let addReact = () => {
  // always add script first because if there is no package.json it'll process.exit()
  addScript('react', 'node enzo/react.js')
  let react = fs.readFileSync(path.resolve(__dirname, './files/enzoReact.js'), 'utf8')
  let stateful = fs.readFileSync(path.resolve(__dirname, './templates/statefulComponent.js'), 'utf8')
  let stateless = fs.readFileSync(path.resolve(__dirname, './templates/statelessComponent.js'), 'utf8')
  checkEnzoExists()
  fs.writeFile('./enzo/react.js', react, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/statefulComponent.js', stateful, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/statelessComponent.js', stateless, (err) => {
    if (err) console.error(err)
  })
}

let addRedux = () => {
  addScript('redux', 'node enzo/redux.js')
  let redux = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateContainer.js'), 'utf8')
  let enzoDumbComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoDumbComponentTemplate.js'), 'utf8')
  let dumbReduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/dumbReduxContainerTemplate.js'), 'utf8') 
  let smartComponentTemplate = fs.readFileSync(path.resolve(__dirname, './templates/smartComponentTemplate.js'), 'utf8')
  let reduxContainerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/reduxContainerTemplate.js'), 'utf8')
  checkEnzoExists()
  fs.writeFile('./enzo/redux.js', redux, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/enzoDumbComponentTemplate.js', enzoDumbComponentTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/dumbReduxContainerTemplate.js', dumbReduxContainerTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/smartComponentTemplate.js', smartComponentTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/reduxContainerTemplate.js', reduxContainerTemplate, (err) => {
    if (err) console.error(err)
  })
}

let addAPI = () => {
  addScript('api', 'node enzo/api.js')
  let api = fs.readFileSync(path.resolve(__dirname, './files/enzoCreateAPI.js'), 'utf8')
  let enzoControllerTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoControllerTemplate.js'), 'utf8')
  let enzoEndpointTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoEndpointTemplate.js'), 'utf8')
  checkEnzoExists()
  fs.writeFile('./enzo/api.js', api, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/enzoControllerTemplate.js', enzoControllerTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/enzoEndpointTemplate.js', enzoEndpointTemplate, (err) => {
    if (err) console.error(err)
  })
}

let addPage = () => {
  addScript('page', 'node enzo/page.js')
  let page = fs.readFileSync(path.resolve(__dirname, './files/enzoNewPage.js'), 'utf8')
  let html = fs.readFileSync(path.resolve(__dirname, './templates/htmlPageTemplate.html'), 'utf8')
  checkEnzoExists()
  fs.writeFile('./enzo/page.js', page, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/htmlPageTemplate.html', html, (err) => {
    if (err) console.error(err)
  })
}

let template = {
  type: 'confirm',
  message: 'Do you need a template file',
  name: 'template'
}

let templateName = {
  type: 'input',
  message: 'What do you want to name the template file:',
  name: 'templateName'
}

let createNew = (name) => {
    addScript(name, `node enzo/${name}.js`)
    checkEnzoExists()
    fs.writeFile(`./enzo/${name}.js`, '', (err) => {
      if (err) console.error(err)
    })
    prompt([template]).then(a => {
      a = a.template
      if (a) {
        prompt([templateName]).then(ans => {
          ans = ans.templateName
          let importTemplate = `let fs = require('fs')\nlet path = require('path')\n\nlet ${ans}Template = fs.readFileSync(path.resolve(__dirname, './templates/${ans}.js'), 'utf8')`
          fs.appendFile(`./enzo/${name}.js`, importTemplate, (err) => {
            if (err) console.error(err)
            log(`Imported the template ${ans} into enzo/${name}.js`)
          })
          fs.writeFileSync(`./enzo/templates/${ans}.js`, '', 'utf8')
          log('Done!')
        })
      } else {
        log('Done!')
        process.exit()
      }
    })
}

let checkEnzoExists = () => {
  if (fs.existsSync('./enzo')) {
    if (fs.existsSync('./enzo/templates')) {
      return 
    } else {
      fs.mkdirSync('./enzo/templates')
    }
  } else {
    fs.mkdirSync('./enzo')
    fs.mkdirSync('./enzo/templates')
  }
}



module.exports = command