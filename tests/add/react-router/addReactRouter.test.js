jest.mock('../../../helpers', () => ({
  yarn: jest.fn(),
  installDevDependenciesToExistingProject: jest.fn()
}))
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))

jest.mock('fs', () => ({
  existsSync: jest.fn()
}))

const fs = require('fs')
const helpers = require('../../../helpers')
const inquirer = require('inquirer')
const {
  addReactRouter,
  projectType,
  createView,
  blixReux,
  blixReact,
  createReactApp
} = require('../../../add/react-router/addReactRouter')
const mockModule = require('../../../add/react-router/addReactRouter')
const addProjectInstructions = require('../../../add/addProjectInstructions')
const store = require('../../../new/store')

describe('add/addReactRouter', () => {

  describe('addReactRouter', () => {
    it('alerts the user that a mutation may cause a loss of files and prompts a confirmation', async () => {
      console.clear = jest.fn()
      console.log = jest.fn()
      inquirer.prompt.mockResolvedValue({confirm: false})
      mockModule.projectType = jest.fn()
      await addReactRouter()

      expect(console.clear).toBeCalled()
      expect(console.log).toBeCalled()
      expect(console.log).toBeCalledWith("Mutating a project can cause loss of files. Make sure you have everything committed.")
      expect(inquirer.prompt).toBeCalled()
      expect(mockModule.projectType).not.toBeCalled()
    })

    it('calls projectType if the user confirms the mutation', async () => {
      inquirer.prompt.mockResolvedValue({confirm: true})
      mockModule.projectType = jest.fn()

      await addReactRouter()

      expect(inquirer.prompt).toBeCalled()
      expect(mockModule.projectType).toBeCalled()
    })
  })

  describe('projectType', () => {
    it('installs reacr-router-dom to existing project devDependencies', async () => {
      fs.existsSync.mockReturnValue(false)
      console.error = jest.fn().mockReturnValue(false)

      await projectType()

      expect(helpers.yarn).toBeCalled()
      expect(helpers.installDevDependenciesToExistingProject).toBeCalled()
      expect(helpers.installDevDependenciesToExistingProject).toBeCalledWith('react-router-dom')
    })

    it('throws an error if a src file does not exist', async () => {
      fs.existsSync.mockReturnValue(false)
      console.error = jest.fn()

      await projectType()
      
      expect(console.error).toBeCalled()
      expect(console.error).toBeCalledTimes(1)
      expect(console.error).toBeCalledWith("No src/ directory found. Unable to add React-Router.")
    })

    it('throws an error if ./src/views already exists', async () => {
      fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true)
      console.error = jest.fn()

      await projectType()

      
      expect(console.error).toBeCalled()
      expect(console.error).toBeCalledTimes(1)
      expect(console.error).toBeCalledWith("A src/views folder already exists.")
    })

    it('calls createView if ./src/components exists', async () => {
      mockModule.createView = jest.fn()
      fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true)

      await projectType()

      expect(mockModule.createView).toBeCalled()
      expect(mockModule.createView).toBeCalledWith('unknown')
    })

    it('calls blixRedux if ./src/App/AppContainer.js exists', async () => {
      const redux = mockModule.blixRedux = jest.fn()
      const react = mockModule.blixReact = jest.fn()
      const cra = mockModule.createReactApp = jest.fn()

      fs.existsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      await projectType()
    
      expect(redux).toBeCalled()
      expect(react).not.toBeCalled()
      expect(cra).not.toBeCalled()
    })

    it('calls blixReact if ./src/App/App.js exists', async () => {
      const redux = mockModule.blixRedux = jest.fn()
      const react = mockModule.blixReact = jest.fn()
      const cra = mockModule.createReactApp = jest.fn()

      fs.existsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      await projectType()

      expect(react).toBeCalled()
      expect(redux).not.toBeCalled()
      expect(cra).not.toBeCalled()

      fs.existsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      await projectType()

      expect(cra).toBeCalled()
      expect(redux).not.toBeCalled()
    })

    it('calls createReactApp if ./src/App.js exists && ./src/components does not exist', async () => {
      const redux = mockModule.blixRedux = jest.fn()
      const react = mockModule.blixReact = jest.fn()
      const cra = mockModule.createReactApp = jest.fn()

      fs.existsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      await projectType()

      expect(cra).toBeCalled()
      expect(redux).not.toBeCalled()
      expect(react).not.toBeCalled()
    })
  })

  describe('createView', () => {

  })

  describe('blixRedux', () => {

  })

  describe('blixReact', () => {

  })

  describe('createReactApp', () => {

  })
})