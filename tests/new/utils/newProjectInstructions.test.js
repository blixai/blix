const store = require('../../../new/store');
const helpers = require('../../../helpers');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const {writeFile} = helpers;
const {
  logCustomScriptInstructions,
  readmeFormatter,
  consoleFormatter,
  newProjectInstructions
} = require('../../../new/utils/newProjectInstructions');

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

beforeAll(() => {
  store.name = "testApp"
  store.env = "development"
  process.chdir('./tests/new/utils')
  fs.mkdirSync(store.name)
  let readMe = loadFile('../../../new/files/common/README.md')
  writeFile("README.md", readMe);
})

afterAll(() => {
  execSync(`rm -rf ${store.name}`)
})
describe("Utils: logCustomScriptInstructions", () => {
  // logCustomScriptInstructions
  it("Calls readMeFormatter", () => {
    // does it call readMeFormatter
    
  })
  
  // Test React
  it("Adds reactComponent option to the readme README.md", () => {
    // set store.reactType to react
    // does README.md include options.reactComponent
  })
  
  // Test React-Router
  it("Adds reactRouterComponent and View options to README.md", () => {
    // set store.reactType to 'react-router'
    // does README.md include options.reactRouterComponent
    // does README.md include options.view
  })

  // Test Redux
  it("Adds reduxComponent and action options to README.md", () => {
    // set store.reactType to 'redux'
    // does README.md include options.reduxComponent
    // does README.md include options.action
  })
  
  it("Adds reactRouterReduxComponent, view and action options to README.md", () => {
    // set store.reactType to 'reactRouter-redux'
    // does README.md include options.reactRouterReduxComponent
    // does README.md include options.view
    // does README.md include options.action
  })
})
 
describe("Utils: readmeFormatter", () => {
  
  it("Adds Project Scripts to ReadMe", () => {
    // does README.md include readmeOutputString

  })

  it("calls consoleFormatter", () => {
    // use sinon - does it call consoleFormatter
  })
})

describe("Utils: consoleFormatter", () => {
  it("Logs Options to console", () => {
    // use sinon.js - does it log something to console?
  })
})

describe("Utils: newProjectInstructions", () => {
  it("Clears the console", () => {
    // is console.clear called

  })

  it("Logs the application name to the console", () => {
    // 
  })

  // If store.userYarn is true
  it("Prompts the user to use yarn start", () => {

  })

  // If store.useYarn is false
  it("Prompts the user to use npm start", () => {
    
  })


  it("Calls logCustomScriptInstructions", () => {

  })
})
  
