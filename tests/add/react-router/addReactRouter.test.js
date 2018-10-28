jest.mock('../../../helpers')
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))

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
const addReactRouterModule = require('../../../add/react-router/addReactRouter')
const addProjectInstructions = require('../../../add/addProjectInstructions')
const store = require('../../../new/store')

describe('add/addReactRouter', () => {

  describe('addReactRouter', () => {
    it('alerts the user that a mutation may cause a loss of files and prompts a confirmation', async () => {
      console.clear = jest.fn()
      console.log = jest.fn()
      inquirer.prompt.mockResolvedValue({confirm: false})
      const mockProjectType = addReactRouterModule.projectType = jest.fn()
      await addReactRouter()

      expect(console.clear).toBeCalled()
      expect(console.log).toBeCalled()
      expect(console.log).toBeCalledWith("Mutating a project can cause loss of files. Make sure you have everything committed.")
      expect(inquirer.prompt).toBeCalled()
      expect(mockProjectType).not.toBeCalled()
    })

    it('calls projectType if the user confirms the mutation', async () => {
      inquirer.prompt.mockResolvedValue({confirm: true})
      const mockProjectType = addReactRouterModule.projectType = jest.fn()
      
      await addReactRouter()

      expect(inquirer.prompt).toBeCalled()
      expect(mockProjectType).toBeCalled()
    })
  })

  describe('projectType', () => {

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