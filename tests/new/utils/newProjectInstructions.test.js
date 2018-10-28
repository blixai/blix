const store = require('../../../new/store');
const helpers = require('../../../helpers');
const fs = require('fs');
const chalk = require('chalk')
const readFile = fs.readFileSync;
const {
  logCustomScriptInstructions,
  readmeFormatter,
  consoleFormatter,
  newProjectInstructions
} = require('../../../new/utils/newProjectInstructions');
const projectInstructions = require('../../../new/utils/newProjectInstructions')

jest.mock('fs', () => ({
  appendFileSync: jest.fn()
}))

describe('New Project Instructions', () => {

  describe('logCustomScriptInstructions', () => {  
    it('calls readmeFormatter', () => {
      const mockFormatter = projectInstructions.readmeFormatter = jest.fn()

      logCustomScriptInstructions()

      expect(mockFormatter).toBeCalled()
    })
    it('sets options to log based on reactType', () => {
      const mockFormatter = projectInstructions.readmeFormatter = jest.fn()
      const reactComponent = { command: 'component', example: 'blix generate component <name>', use: 'Creates a stateful or stateless React component and CSS file in a folder within src/' }
      store.reactType = 'react'

      logCustomScriptInstructions()

      expect(mockFormatter).toBeCalled()
      expect(mockFormatter.mock.calls[0][0]).toEqual([reactComponent])
    })
  })
  
  describe('readmeFormatter()', () => {
    let options = [{example: 'this'}, {command: 'that', use: 'Thing'}]
    beforeEach(() => {
      projectInstructions.consoleFormatter = jest.fn()
    })

    it('Adds Project Scripts to ReadMe', () => {
      store.name = 'testApp'
      readmeFormatter(options)

      expect(fs.appendFileSync).toBeCalled() 

      expect(fs.appendFileSync.mock.calls[0][0]).toEqual('./testApp/README.md') 
      expect(fs.appendFileSync.mock.calls[0][1]).toEqual('\n' + '## Project Scripts' + '\n\n') 
    })

    it('calls consoleFormatter', () => {
      readmeFormatter(options)
      expect(projectInstructions.consoleFormatter).toBeCalled()
      expect(projectInstructions.consoleFormatter).toBeCalledWith(options)
    })
  })

  describe('consoleFormatter', () => {
    it('Logs the options to the console', () => {
      let options = [ {command: "component", example: "blix generate component <name>", use: "Creates a stateful or stateless React component and CSS file in a folder within src/" },]
      console.log = jest.fn()
      consoleFormatter(options)

      expect(console.log).toBeCalled()
      expect(console.log).toBeCalledTimes(1)
      expect(console.log.mock.calls[0][0]).toContain(options[0].command, options[0].example, options[0].use)
    })
  })

  describe('newProjectInstructions()', () => {
    let outputData = ''
    storeLog = inputs => (outputData += inputs);
    console['log'] = jest.fn(storeLog)
    beforeEach(() => {
      projectInstructions.logCustomScriptInstructions = jest.fn()
    })

    afterEach(() =>{
      outputData = ''
    })

    it('calls logCustomScriptInstructions', () => {
      newProjectInstructions()

      expect(projectInstructions.logCustomScriptInstructions).toBeCalled()
    })

    it('clears the console', () => {
      console.clear = jest.fn()
      
      newProjectInstructions()

      expect(console.clear).toBeCalled()
    })

    it('logs info to the client', () => {
      console.log = jest.fn()
      newProjectInstructions()
      expect(console.log).toBeCalledTimes(10)
    })

    it('logs the application name to the console', () => {
      console.log = jest.fn()
      newProjectInstructions()

      expect(console.log.mock.calls[1][0]).toContain(store.name)
    })

    // If store.userYarn is true
    it('prompts the user to use yarn start', () => { 
      store.useYarn = true
      console.log = jest.fn()

      newProjectInstructions()

      expect(console.log.mock.calls[6][0]).toContain('yarn start')
      expect(console.log.mock.calls[6][0]).not.toContain('npm')
    })

    // If store.useYarn is false
    it('prompts the user to use npm start', () => {
      store.useYarn = false
      console.log = jest.fn()

      newProjectInstructions()

      expect(console.log.mock.calls[6][0]).toContain('npm start')
      expect(console.log.mock.calls[6][0]).not.toContain('yarn')
    })
  })
})  
