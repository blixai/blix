const helpers = require('../helpers')
const { options } = require('../new/utils/newProjectInstructions')
const store = require('../new/store')
const log = console.log
const chalk = require('chalk')

const selected = []

const getOptions = () => {
    // frontend
    if (store.reactType === 'react-router') {
        selected.push(options.reactRouterComponent)
        selected.push(options.view)
    } else if (store.reactType === 'redux') {
        selected.push(options.reduxComponent)
        selected.push(options.action)
    } else if (store.reactType === 'reactRouter-redux') {
        selected.push(options.reactRouterReduxComponent)
        selected.push(options.view)
        selected.push(options.action)
    }

    // backend
    if (store.backendType) {
        selected.push(options.controller)
    }

    // database
    if (store.database.database === 'mongo') {
        selected.push(options.mongooseModel)
    } else if (store.database.database === 'pg') {
        selected.push(options.postgresModel)
    }
}

const readMeFormatter = () => {
    let outputString = ''
    selected.forEach(option => {
      if (option && option.example && option.command && option.use) {
        if (outputString) {
          outputString += '\n\n' + option.command + ' || example: ' + option.example + ' || use: ' + option.use  
        } else {
          outputString += (option.command + ' || example: ' + option.example + ' || use: ' + option.use)
        }
      }
    })
  
    try {
        if (outputString) {
            helpers.insert(`README.md`, `${outputString}\n`, '## Project Scripts')
        }
    } catch (err) {
      store.env === 'development' ? log(err) : ""
    }
}

const consoleFormatter = () => {
    selected.forEach(option => {
      if (option && option.example && option.command && option.use) {
        log('\n' + '  ' + chalk`{cyan  ${option.example} }` + `\n\t${option.use}`)
      }
    })
  }

const addProjectInstructions = () => {
    getOptions()
    readMeFormatter()
    console.clear()
    log("")
    log('Success!')
    log(`We've added these custom scripts to your project:`)
    consoleFormatter()
    log('')
    log('For examples and other information visit blixjs.com')
    log('Happy hacking!')
    log('')
}

module.exports = addProjectInstructions