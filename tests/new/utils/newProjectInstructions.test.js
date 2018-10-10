const store = require('../../../new/store');
const helpers = require('../../../helpers');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const {writeFile} = helpers;
const readFile = fs.readFileSync;
const {
  logCustomScriptInstructions,
  readmeFormatter,
  consoleFormatter,
  newProjectInstructions
} = require('../../../new/utils/newProjectInstructions');
const projectInstructions = require('../../../new/utils/newProjectInstructions')

const loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
};

beforeAll(() => {
  try{
    store.name = "testApp"  
    store.env = "development"
    fs.mkdirSync('./tempTests');
    process.chdir('./tempTests');
    fs.mkdirSync(store.name)
    let readMe = loadFile('../../../new/files/common/README.md')
    writeFile("README.md", readMe);
  } catch(err){
    console.error(err);
  }
})

afterAll(() => {
  try{
    process.chdir("../");
    execSync("rm -rf ./tempTests")
  } catch(err){
    console.error(err);
  }
})

describe("New Project Instructions", () => {

  describe("logCustomScriptInstructions()", () => {  
    // Test React
    it("Adds reactComponent option to the readme README.md", () => {
      store.reactType = "react"
      logCustomScriptInstructions();
      // does README.md include options.reactComponent
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("src/")
    })
    
    // Test React-Router
    it("Adds reactRouterComponent and View options to README.md", () => {
      // set store.reactType to 'react-router'
      store.reactType = "react-router"
      logCustomScriptInstructions();
      // does README.md include options.reactRouterComponent
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("src/components/")
      // does README.md include options.view
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("src/views/")
    })

    // Test Redux
    it("Adds reduxComponent and action options to README.md", () => {
      // set store.reactType to 'redux'
      store.reactType = "redux"
      logCustomScriptInstructions();
      // does README.md include options.reduxComponent
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("Redux container" && "React component" && "src/")
      // does README.md include options.action
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("Create new action")
    })

    it("Adds reactRouterReduxComponent, view and action options to README.md", () => {
      // set store.reactType to 'reactRouter-redux'
      store.reactType = "reactRouter-redux"
      logCustomScriptInstructions();
      // does README.md include options.reactRouterReduxComponent
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("Redux container" && "React component" && "src/components")
      // does README.md include options.view
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("src/views/")
      // does README.md include options.action
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("Create new action")
    })
  })
  
  describe("readmeFormatter()", () => {
    beforeAll(() => {
      logCustomScriptInstructions();
    })
    it("Adds Project Scripts to ReadMe", () => {
      // does README.md include readmeOutputString
      expect(readFile(`${store.name}/README.md`, "utf8")).toContain("|| example:" && "|| use:")
    })
  })

  describe("newProjectInstructions()", () => {
    let outputData = ""
    storeLog = inputs => (outputData += inputs);
    console["log"] = jest.fn(storeLog)

    afterEach(() =>{
      outputData = ""
    })

    it("Logs the application name to the console", () => {
      newProjectInstructions()
      expect(outputData).toContain(store.name)
    })

    // If store.userYarn is true
    it("Prompts the user to use yarn start", () => {
      store.useYarn = true
      newProjectInstructions()
      expect(outputData).toContain("yarn start");
    })

    // If store.useYarn is false
    it("Prompts the user to use npm start", () => {
      store.useYarn = false
      newProjectInstructions()
      expect(outputData).toContain("npm start");
    })
  })
})  
