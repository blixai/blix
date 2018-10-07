const log = console.log;
const fs = require('fs')
const store = require('../store')
const chalk = require('chalk')
const link = 'blixjs.com'

const options = {
  mongooseModel: { command: "model", example: "blix generate model <ModelName> [fieldName]:[Type] [fileName]:[Type]", use: "Creates Mongoose model" },
  postgresModel: { command: "model", example: "blix generate model <ModelName> [fieldName]:[type] [fieldName]:[type]", use: "Creates Bookself model" },
  reactComponent: { command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/" },
  reactRouterComponent: { command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/components/"},
  reduxComponent: { command: "component", example: "blix generate component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/"},
  view: { command: "view", example: "blix generate view <name>", use: "Create a stateful or stateless React component in src/views/ and add the route to the src/App.js router file. Also imports components in the new view."},
  reactRouterReduxComponent: { command: "component", example: "blix generate component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/components"},
  action: { command: "action", example: "blix generate action", use: "Create new action, and creates or appends a Reducer, and adds the action to selected containers"},
  controller: { command: "controller", example: "blix generate controller <name>", use: "Quickly create api/v1 get|post|put|delete endpoints for a resource"},
};

let optionsToLog = []

const logCustomScriptInstructions = () => {
  // frontend
  if (store.reactType === "react") {
    optionsToLog.push(options.reactComponent)
  } else if (store.reactType === 'react-router') {
    optionsToLog.push(options.reactRouterComponent)
    optionsToLog.push(options.view)
  } else if (store.reactType === 'redux') {
    optionsToLog.push(options.reduxComponent)
    optionsToLog.push(options.action)
  } else if (store.reactType === 'reactRouter-redux') {
    optionsToLog.push(options.reactRouterReduxComponent)
    optionsToLog.push(options.view)
    optionsToLog.push(options.action)
  }
  //backend
  if (store.backend && store.backend.backend) {
    optionsToLog.push(options.controller)
  }

  if (store.database && store.database.database === 'mongo') {
    optionsToLog.push(options.mongooseModel)
  } else if (store.database && store.database.database === 'pg') {
    optionsToLog.push(options.postgresModel)
  }
  readmeFormatter()
}

const readmeFormatter = () => {
  let outputString = ''
  optionsToLog.forEach(option => {
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

  consoleFormatter()
}

const consoleFormatter = () => {
  optionsToLog.forEach(option => {
    if (option && option.example && option.command && option.use) {
      log('\n' + '  ' + chalk`{cyan  ${option.example} }` + `\n\t${option.use}`)
    }
  })
}

const newProjectInstructions = () => {
  let name = store.name
  console.clear()
  log("")
  log(`Success! Created new project ${name} at ${process.cwd() + '/' + name}`);
  log();
  log('Inside that directory you can run these custom scripts:')
  logCustomScriptInstructions()
  log(`\nWe suggest you begin by typing:`)
  log(chalk`\n  {cyan cd} ${name}`)
  log(chalk`{cyan   ${store.useYarn ? 'yarn start': 'npm start'}}`)
  log(`\nFor examples and other information visit ${link}`)
  log('Happy hacking!')
  log('')
};

module.exports = { 
  logCustomScriptInstructions,
  readmeFormatter,
  consoleFormatter,
  newProjectInstructions
 };
