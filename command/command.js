const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let fs = require('fs')
let path = require('path')
let log = console.log 

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
  log('Here are pre made enzo commands and what they do: ')
  log('')
  log('\treact: create a new react statefull or stateless component')
  log('')
  log('\tredux: create a new react component, a redux container, and a new route in your routing component')
  log('')
  log('\tapi: create new api endpoints and model')
  log('')
  log('\tpage: create a new folder, html, css, and js files along with adding the route in pages.js')
  log('')
  log('\tmodel: create a new Bookshelf or Mongoose model for your database, with preconfired migration file created for use with Knex.js')
  log('')
  log('\taction: create or apply existing action to a existing reducer or creates a reducer and applies action to selected containers')
  log('')
  log('')
  rl.question('Enter one of the listed commands or enter your own: ', (answer) => {
    answer = answer.toLowerCase()
    switch (answer) {
      case "react":
        addReact()
        rl.close()
        console.log('Done!')
        break;
      case "redux":
        addRedux()
        rl.close()
        console.log('Done!')
        break;
      case "api":
        addAPI()
        rl.close()
        console.log('Done!')
        break;
      case "page":
        addPage()
        rl.close()
        console.log('Done!')
      case "model": 
        addModel()
        console.log('Done!')
        break;
      case "action":
        addAction()
        rl.close()
        log('Done!')
        break;
      default:
        createNew(answer)
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


let addModel = () => {
  addScript('model', 'node enzo/model.js')
  rl.question('Do you want to use Mongoose.js or Bookshelf.js? (M/B) ', (ans) => {
    ans = ans.toLowerCase()
    if (ans === 'm') {
      checkEnzoExists()
      let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateMongooseModel.js'), 'utf8')
      let schemaTemplate = fs.readFileSync(path.resolve(__dirname, './templates/schemaTemplate.js'), 'utf8')
      fs.writeFile('./enzo/model.js', model, (err) => {
        if (err) throw err 
      })
      fs.writeFile('./enzo/templates/schemaTemplate.js', schemaTemplate, (err) => {
        if (err) throw err 
      })
      // add moongoose
      rl.close()
    } else if (ans === 'b') {
      checkEnzoExists()
      let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateBookshelfModel.js'), 'utf8')
      let migrationTemplate = fs.readFileSync(path.resolve(__dirname, './templates/migrationTemplate.js'), 'utf8')
      let bookshelf = fs.readFileSync(path.resolve(__dirname, './templates/bookshelf.js'), 'utf8')
      let enzoBookshelfModelTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoBookshelfModelTemplate.js'), 'utf8')
      fs.writeFile('./enzo/model.js', model, (err) => {
        if (err) throw err 
      })
      fs.writeFile('./enzo/templates/migrationTemplate.js', migrationTemplate, (err) => {
        if (err) throw err 
      })
      fs.writeFile('./server/models/bookshelf.js', bookshelf, (err) => {
        if (err) throw err 
      })
      fs.writeFile('./enzo/templates/enzoBookshelfModelTemplate.js', enzoBookshelfModelTemplate, (err) => {
        if (err) throw err 
      })
      rl.close()
    } else {
      rl.close()
      // write a basic model.js file?
      checkEnzoExists()
      fs.writeFile('./enzo/model.js', '', (err) => {
        if (err) throw err 
      })
      console.log('Added model command to package.json and empty model.js file to enzo, have fun!')
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

let createNew = (name) => {
  rl.question('What do you want to name the enzo file? ', (answer) => {
    addScript(name, `node enzo/${answer}.js`)
    checkEnzoExists()
    fs.writeFile(`./enzo/${name}.js`, '', (err) => {
      if (err) console.error(err)
    })
    rl.question('Do you need a template file? (Y/N) ', (a) => {
      a = a.toLowerCase()
      if (a === 'y') {
        rl.question('What is the template file name? ', (ans) => {
          rl.close()
          let importTemplate = `let fs = require('fs')\nlet path = require('path')\n\nlet ${ans}Template = fs.readFileSync(path.resolve(__dirname, './templates/${ans}.js'), 'utf8')`
          fs.appendFile(`./enzo/${name}.js`, importTemplate, (err) => {
            if (err) console.error(err)
          })
          fs.writeFileSync(`./enzo/templates/${ans}.js`, '', 'utf8')
          console.log('Done!')
        })
      } else {
        rl.close()
        console.log('Done!')
      }
    })
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