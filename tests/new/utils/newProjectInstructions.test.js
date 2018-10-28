const store = require('../../../new/store');
const helpers = require('../../../helpers');
const fs = require('fs');
const readFile = fs.readFileSync;
const {
  logCustomScriptInstructions,
  readmeFormatter,
  consoleFormatter,
  newProjectInstructions
} = require('../../../new/utils/newProjectInstructions');
const projectInstructions = require('../../../new/utils/newProjectInstructions')


describe("New Project Instructions", () => {
  describe("logCustomScriptInstructions", () => {  
    it('calls readmeFormatter', () => {
      const mockFormatter = projectInstructions.readmeFormatter = jest.fn()

      logCustomScriptInstructions()

      expect(mockFormatter).toBeCalled()
    })
    it('sets options to log based on reactType', () => {
      const mockFormatter = projectInstructions.readmeFormatter = jest.fn()
      const reactComponent = { command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/" }
      store.reactType = 'react'

      logCustomScriptInstructions()

      expect(mockFormatter).toBeCalled()
      expect(mockFormatter.mock.calls[0][0]).toEqual([reactComponent])
    })
  })
  
  describe.skip("readmeFormatter()", () => {
    it("Adds Project Scripts to ReadMe", () => {
      // does README.md include readmeOutputString
      
    })
  })

  describe.skip("newProjectInstructions()", () => {
    let outputData = ""
    storeLog = inputs => (outputData += inputs);
    console["log"] = jest.fn(storeLog)

    afterEach(() =>{
      outputData = ""
    })

    it("Logs the application name to the console", () => {
      
      expect(outputData).toContain(store.name)
    })

    // If store.userYarn is true
    it("Prompts the user to use yarn start", () => {
      store.useYarn = true
      
      expect(outputData).toContain("yarn start");
    })

    // If store.useYarn is false
    it("Prompts the user to use npm start", () => {
      store.useYarn = false
      
      expect(outputData).toContain("npm start");
    })
  })
})  
