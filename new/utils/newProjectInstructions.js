// need to create a reusable console log of instructions: ie run npm start
// also need to add the instructions to the README (should be easy)
const log = console.log;
const fs = require('fs')
const boxen = require("boxen");
const store = require('../store')
const name = process.argv[3];

const options = {
  mongooseModel: { command: "model", example: "npm run model User email:String age:Number", use: "Creates Mongoose model" },
  postgresModel: { command: "model", example: "npm run model User email:string age:number", use: "Creates Bookself model" },
  reactComponent: { command: "component", example: "npm run component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/" },
  reactRouterComponent: { command: "component", example: "npm run component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/components/"},
  reduxComponent: { command: "component", example: "npm run component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/"},
  view: { command: "view", example: "npm run view about", use: "Create a stateful or stateless React component in src/views/ and add the route to the src/App.js router file. Also imports components in the new view."},
  reactRouterReduxComponent: { command: "component", example: "npm run component <name>", use: "Create a React component, Redux container, and CSS file in a folder within src/components"},
  action: { command: "action", example: "npm run action", use: "Create new action, and creates or appends a Reducer, and adds the action to selected containers"},
  controller: { command: "controller", example: "npm run controller <name>", use: "Quickly create api/v1 get|post|put|delete endpoints for a resource"},
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
  boxenLogger()
}

const boxenLogger = () => {
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

  log(boxen(outputString, { padding: 1, borderColor: 'yellow' }))

  let readmeOutputString = ('\n' + '## Project Scripts' + '\n\n' + outputString)
  fs.appendFileSync(`./${name}/README.md`, readmeOutputString)
}

const newProjectInstructions = () => {
  console.clear();
  log("New Project created!");
  log(`To start: cd into ${name}`);
  log();
  log('Unique package.json scripts')
  logCustomScriptInstructions()
};

module.exports = { newProjectInstructions };
