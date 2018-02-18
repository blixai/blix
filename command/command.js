let fs       = require('fs')
let path     = require('path')
let log      = console.log 
let inquirer = require('inquirer')
let prompt   = inquirer.prompt
let helpers  = require('../helpers')


let commands = {
  type    : 'list',
  message : 'Add a enzo command to a project:',
  pageSize: 10,
  name    : 'commands',
  choices : [
    { name: 'custom: create your own' ,                                                                          value: 'custom' },
    { name: 'react: create a new react statefull or stateless component',                                        value: 'react'  },
    { name: 'redux: create a new react component, a redux container, and a new route in your routing component', value: 'redux'  },
    { name: 'api: create new api endpoints and controller',                                                      value: 'api'    },
    { name: 'page: create a new folder, html, css, and js files along with adding the route in pages.js',        value: 'page'   },
    { name: 'model: create a new Bookshelf model and migration or a Mongoose model',                             value: 'model'  },
    { name: 'action: create or add redux action to new or existing reducer',                                     value: 'action' }
  ]
}

let custom = {
  type    : 'input',
  message : 'What do you want to name this command:',
  name    : 'custom'
}

let model = {
  type    : 'list',
  message : 'Pick a model type:',
  name    : 'model',
  choices : [
    { name: 'Mongoose',  value: 'm' },
    { name: 'Bookshelf', value: 'b' }
  ]
}

let template = {
  type    : 'confirm',
  message : 'Do you need a template file',
  name    : 'template'
}

let templateName = {
  type    : 'input',
  message : 'What do you want to name the template file:',
  name    : 'templateName'
}

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
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
  helpers.addScript('action', 'node enzo/action.js')
  checkEnzoExists()

  let action          = loadFile('./files/enzoCreateAction.js')
  let actionTemplate  = loadFile('./templates/actionTemplate.js')
  let reducerTemplate = loadFile('./templates/reducerTemplate.js')

  helpers.writeFile('./enzo/action.js', action)
  helpers.writeFile('./enzo/templates/actionTemplate.js', actionTemplate)
  helpers.writeFile('./enzo/templates/reducerTemplate.js', reducerTemplate)
}

let addModel = () => {
  helpers.addScript('model', 'node enzo/model.js')
  prompt([model]).then(ans => {
    if (ans.model === 'm') {
      // add moongoose
      checkEnzoExists()
      let model          = loadFile('./templates/enzoCreateMongooseModel.js')
      let schemaTemplate = loadFile('./templates/schemaTemplate.js')

      helpers.writeFile('./enzo/model.js', model, 'Created model file in enzo')
      helpers.writeFile('./enzo/templates/schemaTemplate.js', schemaTemplate, 'Created Mongoose schema template in enzo/templates')

    } else {
      // add bookshelf 
      checkEnzoExists()
      let model                      = loadFile('./templates/enzoCreateBookshelfModel.js')
      let migrationTemplate          = loadFile('./templates/migrationTemplate.js')
      let bookshelf                  = loadFile('./templates/bookshelf.js')
      let enzoBookshelfModelTemplate = loadFile('./templates/enzoBookshelfModelTemplate.js')

      helpers.writeFile('./enzo/model.js', model, 'Created model file in enzo')
      helpers.writeFile('./enzo/templates/migrationTemplate.js', migrationTemplate, 'Created knex migration template in enzo/templates')
      helpers.writeFile('./enzo/templates/enzoBookshelfModelTemplate.js', enzoBookshelfModelTemplate, 'Created Bookshelf template file in enzo/templates')

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
  helpers.addScript('react', 'node enzo/react.js')
  let react     = loadFile('./files/enzoReact.js')
  let stateful  = loadFile('./templates/statefulComponent.js')
  let stateless = loadFile('./templates/statelessComponent.js')
  checkEnzoExists()
  helpers.writeFile('./enzo/react.js', react)
  helpers.writeFile('./enzo/templates/statefulComponent.js', stateful)
  helpers.writeFile('./enzo/templates/statelessComponent.js', stateless)
}

let addRedux = () => {
  helpers.addScript('redux', 'node enzo/redux.js')

  let redux                      = loadFile('./files/enzoCreateContainer.js')
  let enzoDumbComponentTemplate  = loadFile('./templates/enzoDumbComponentTemplate.js')
  let dumbReduxContainerTemplate = loadFile('./templates/dumbReduxContainerTemplate.js')
  let smartComponentTemplate     = loadFile('./templates/smartComponentTemplate.js')
  let reduxContainerTemplate     = loadFile('./templates/reduxContainerTemplate.js')

  checkEnzoExists()

  helpers.writeFile('./enzo/redux.js', redux)
  helpers.writeFile('./enzo/templates/enzoDumbComponentTemplate.js',  enzoDumbComponentTemplate)
  helpers.writeFile('./enzo/templates/dumbReduxContainerTemplate.js', dumbReduxContainerTemplate)
  helpers.writeFile('./enzo/templates/smartComponentTemplate.js',     smartComponentTemplate)
  helpers.writeFile('./enzo/templates/reduxContainerTemplate.js',     reduxContainerTemplate)
}

let addAPI = () => {
  helpers.addScript('api', 'node enzo/api.js')

  let api                    = loadFile('./files/enzoCreateAPI.js')
  let enzoControllerTemplate = loadFile('./templates/enzoControllerTemplate.js')
  let enzoEndpointTemplate   = loadFile('./templates/enzoEndpointTemplate.js')

  checkEnzoExists()

  helpers.writeFile('./enzo/api.js', api)
  helpers.writeFile('./enzo/templates/enzoControllerTemplate.js', enzoControllerTemplate)
  helpers.writeFile('./enzo/templates/enzoEndpointTemplate.js'  , enzoEndpointTemplate)
}

let addPage = () => {
  helpers.addScript('page', 'node enzo/page.js')

  let page = loadFile('./files/enzoNewPage.js')
  let html = loadFile('./templates/htmlPageTemplate.html')

  checkEnzoExists()

  helpers.writeFile('./enzo/page.js', page)
  helpers.writeFile('./enzo/templates/htmlPageTemplate.html', html)
}

let createNew = (name) => {
    helpers.addScript(name, `node enzo/${name}.js`)
    checkEnzoExists()
    helpers.writeFile(`./enzo/${name}.js`, '')
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