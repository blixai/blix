const { options } = require('@blixai/cli-new-utils')
const { store, insert } = require('@blixai/core')
const chalk = require('chalk')

exports.selected = []

exports.getOptions = () => {
    // frontend
    if (store.reactType === 'react-router') {
        this.selected.push(options.reactRouterComponent)
        this.selected.push(options.view)
    } else if (store.reactType === 'redux') {
        this.selected.push(options.reduxComponent)
        this.selected.push(options.action)
    } else if (store.reactType === 'reactRouter-redux') {
        this.selected.push(options.reactRouterReduxComponent)
        this.selected.push(options.view)
        this.selected.push(options.action)
    }

    // backend
    if (store.backendType) {
        this.selected.push(options.controller)
    }

    // database
    if (store.database.database === 'mongo') {
        this.selected.push(options.mongooseModel)
    } else if (store.database.database === 'pg') {
        this.selected.push(options.postgresModel)
    }
}

exports.readMeFormatter = () => {
    let outputString = ''
    this.selected.forEach(option => {
      if (option && option.example && option.command && option.use) {
        if (outputString) {
          outputString += '\n\n' + option.command + ' || example: ' + option.example + ' || use: ' + option.use  
        } else {
          outputString += (option.command + ' || example: ' + option.example + ' || use: ' + option.use)
        }
      }
    })
  
    if (outputString) {
        insert(`README.md`, `${outputString}\n`, '## Project Scripts')
    }
}

exports.consoleFormatter = () => {
    this.selected.forEach(option => {
      if (option && option.example && option.command && option.use) {
        console.log('\n' + '  ' + chalk`{cyan  ${option.example} }` + `\n\t${option.use}`)
      }
    })
  }

exports.addProjectInstructions = () => {
    this.getOptions()
    this.readMeFormatter()
    console.clear()
    console.log("")
    console.log('Success!')
    console.log(`We've added these custom scripts to your project:`)
    this.consoleFormatter()
    console.log('')
    console.log('For examples and other information visit blixjs.com')
    console.log('Happy hacking!')
    console.log('')
}
