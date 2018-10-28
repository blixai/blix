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
    it('alerts the user that a mutation may cause a loss of files', async () => {
      console.clear = jest.fn()
      console.log = jest.fn()
      inquirer.prompt.mockResolvedValue({confirm: ''})
      
      await addReactRouter()

      expect(console.clear).toBeCalled()
      expect(console.log).toBeCalled()
      expect(console.log).toBeCalledWith("Mutating a project can cause loss of files. Make sure you have everything committed.")
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