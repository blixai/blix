const fs = require('fs')
const store = require('../../../store')
const chalk = require('chalk')
const link = 'blixjs.com'

exports.options = {
  mongooseModel: { command: "model", example: "blix generate model <ModelName> [fieldName]:[Type] [fieldName]:[Type]", use: "Creates Mongoose model" },
  postgresModel: { command: "model", example: "blix generate model <ModelName> [fieldName]:[type] [fieldName]:[type]", use: "Creates Bookself model" },
  reactComponent: { command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/" },
  reactRouterComponent: { command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/components/"},
  reduxComponent: { command: "component", example: "blix generate component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/"},
  view: { command: "view", example: "blix generate view <name>", use: "Create a stateful or stateless React component in src/views/ and add the route to the src/App.js router file. Also imports components in the new view."},
  reactRouterReduxComponent: { command: "component", example: "blix generate component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/components"},
  action: { command: "action", example: "blix generate action", use: "Create new action, and creates or appends a Reducer, and adds the action to selected containers"},
  controller: { command: "controller", example: "blix generate controller <name>", use: "Quickly create api/v1 get|post|put|delete endpoints for a resource"},
  api: { command: "api", example: "blix generate api <resource>", use: "Quickly create client side axios requests to api/v1 get|post|put|delete endpoints for a resource"}
};

exports.logCustomScriptInstructions = () => {
  let optionsToLog = []
  if (store.reactType === "react") {
    optionsToLog.push(this.options.reactComponent)
  } else if (store.reactType === 'react-router') {
    optionsToLog.push(this.options.reactRouterComponent)
    optionsToLog.push(this.options.view)
  } else if (store.reactType === 'redux') {
    optionsToLog.push(this.options.reduxComponent)
    optionsToLog.push(this.options.action)
  } else if (store.reactType === 'reactRouter-redux') {
    optionsToLog.push(this.options.reactRouterReduxComponent)
    optionsToLog.push(this.options.view)
    optionsToLog.push(this.options.action)
  }
  // api
  if (store.reactType) {
    optionsToLog.push(this.options.api)
  }
  //backend
  if (store.backend && store.backend.backend) {
    optionsToLog.push(this.options.controller)
  }

  if (store.database && store.database.database === 'mongo') {
    optionsToLog.push(this.options.mongooseModel)
  } else if (store.database && store.database.database === 'pg') {
    optionsToLog.push(this.options.postgresModel)
  }
  this.readmeFormatter(optionsToLog)
}

exports.readmeFormatter = (options) => {
  let outputString = ''
  options.forEach(option => {
    if (option && option.example && option.command && option.use) {
      if (outputString) {
        outputString += '\n\n' + option.command + ' || example: ' + option.example + ' || use: ' + option.use  
      } else {
        outputString += (option.command + ' || example: ' + option.example + ' || use: ' + option.use)
      }
    }
  })

  let readmeOutputString = ('\n' + '## Project Scripts' + '\n\n' + outputString)
  try {
    fs.appendFileSync(`./${store.name}/README.md`, readmeOutputString)
  } catch (err) {
    store.env === 'development' ? log(err) : ""
  }

  this.consoleFormatter(options)
}

exports.consoleFormatter = (options) => {
  options.forEach(option => {
    if (option && option.example && option.command && option.use) {
      console.log('\n' + '  ' + chalk`{cyan  ${option.example} }` + `\n\t${option.use}`)
    }
  })
}

exports.newProjectInstructions = () => {
  let name = store.name
  console.clear()
  console.log("")
  console.log(`Success! Created new project ${name} at ${process.cwd() + '/' + name}`);
  console.log();
  console.log('Inside that directory you can run these custom scripts:')
  this.logCustomScriptInstructions()
  console.log(`\nWe suggest you begin by typing:`)
  console.log(chalk`\n  {cyan cd} ${name}`)
  console.log(chalk`{cyan   ${store.useYarn ? 'yarn start': 'npm start'}}`)
  console.log(`\nFor examples and other information visit ${link}`)
  console.log('Happy hacking!')
  console.log('')
};


