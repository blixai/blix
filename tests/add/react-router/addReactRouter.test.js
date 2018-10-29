jest.mock('../../../helpers', () => ({
  yarn: jest.fn(),
  installDevDependenciesToExistingProject: jest.fn(),
  mkdirSync: jest.fn(),
  writeFile: jest.fn(), 
  checkScriptsFolderExist: jest.fn(),
  checkIfScriptIsTaken: jest.fn(),
  addScript: jest.fn(),
  moveAllFilesInDir: jest.fn(),
  rename: jest.fn()
}))
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn()
}))
jest.mock('../../../add/addProjectInstructions')

const fs = require('fs')
const helpers = require('../../../helpers')
const inquirer = require('inquirer')
const {
  addReactRouter,
  projectType,
  createView,
  blixRedux,
  blixReact,
  createReactApp
} = require('../../../add/react-router/addReactRouter')
const mockModule = require('../../../add/react-router/addReactRouter')
const store = require('../../../new/store')
const addProjectInstructions = require('../../../add/addProjectInstructions')

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
    it('creates default files and folders, adds scripts if type passed is undefined', () => {
      createView()

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(1)
      expect(helpers.mkdirSync).toBeCalledWith('src/views')
      expect(helpers.writeFile).toBeCalled()
      expect(helpers.writeFile).toBeCalledTimes(7)
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('src/views/Home.js')
      expect(helpers.writeFile.mock.calls[1][0]).toEqual('src/Router.js')
      expect(helpers.writeFile.mock.calls[2][0]).toEqual('src/index.js')
      expect(helpers.writeFile.mock.calls[3][0]).toEqual('scripts/templates/statelessComponent.js')
      expect(helpers.writeFile.mock.calls[4][0]).toEqual('scripts/templates/statefulComponent.js')
      expect(helpers.writeFile.mock.calls[5][0]).toEqual('scripts/component.js')
      expect(helpers.writeFile.mock.calls[6][0]).toEqual('scripts/view.js')
      expect(helpers.addScript).toBeCalled()
      expect(helpers.addScript).toBeCalledTimes(2)
      expect(helpers.addScript.mock.calls[0][0]).toEqual('component')
      expect(helpers.addScript.mock.calls[1][0]).toEqual('view')
    })

    it('creates default files and folders if type is unknown', () => {
      createView('unknown')

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(1)
      expect(helpers.mkdirSync).toBeCalledWith('src/views')
      expect(helpers.writeFile).toBeCalled()
      expect(helpers.writeFile).toBeCalledTimes(3)
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('src/views/Home.js')
      expect(helpers.writeFile.mock.calls[1][0]).toEqual('src/Router.js')
      expect(helpers.writeFile.mock.calls[2][0]).toEqual('src/index.js')
    })

    it('creates files and folders if redux is passed as type', () => {
      createView('redux')

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(1)
      expect(helpers.mkdirSync).toBeCalledWith('src/views')
      expect(helpers.writeFile).toBeCalled()
      expect(helpers.writeFile).toBeCalledTimes(7)
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('src/views/Home.js')
      expect(helpers.writeFile.mock.calls[1][0]).toEqual('src/Router.js')
      expect(helpers.writeFile.mock.calls[2][0]).toEqual('src/index.js')
      expect(helpers.writeFile.mock.calls[3][0]).toEqual('scripts/templates/statelessComponent.js')
      expect(helpers.writeFile.mock.calls[4][0]).toEqual('scripts/templates/statefulComponent.js')
      expect(helpers.writeFile.mock.calls[5][0]).toEqual('scripts/component.js')
      expect(helpers.writeFile.mock.calls[6][0]).toEqual('scripts/view.js')
      expect(helpers.addScript).toBeCalled()
      expect(helpers.addScript).toBeCalledTimes(2)
      expect(helpers.addScript.mock.calls[0][0]).toEqual('component')
      expect(helpers.addScript.mock.calls[0][1]).toEqual('node scripts/component.js')
      expect(helpers.addScript.mock.calls[1][0]).toEqual('view')
      expect(helpers.addScript.mock.calls[1][1]).toEqual('node scripts/view.js')
    })

    it('checks if script foler exists', () => {
      createView()

      expect(helpers.checkScriptsFolderExist).toBeCalled()
    })

    it('checks if the script is taken', () => {
      createView()

      expect(helpers.checkIfScriptIsTaken).toBeCalled()
    })

    it('sets reactType based on the type passed in', () => {
      store.reactType = ''
      createView()
      expect(store.reactType).toEqual('react-router')

      store.reactType = ''
      createView('unknown')
      expect(store.reactType).toEqual('')

      store.reactType = ''
      createView('redux')
      expect(store.reactType).toEqual('reactRouter-redux')
    })

    it('calls addProjectInstructions', () => {
      createView()

      expect(addProjectInstructions).toBeCalled()
    })
  })

  describe('blixRedux', () => {
    it('makes components and components/App folders', () => {
      blixRedux() 

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(2)
      expect(helpers.mkdirSync.mock.calls[0][0]).toEqual('src/components')
      expect(helpers.mkdirSync.mock.calls[1][0]).toEqual('src/components/App')
    })

    it('moves all files in ./src/App to ./src/components/App', () => {
      blixRedux()

      expect(helpers.moveAllFilesInDir).toBeCalled()
      expect(helpers.moveAllFilesInDir.mock.calls[0]).toEqual(["./src/App", "./src/components/App"])
    })

    it('calls createView with redux as param', () => {
      blixRedux()

      expect(mockModule.createView).toBeCalled() 
      expect(mockModule.createView).toBeCalledWith('redux')
    })
  })

  describe('blixReact', () => {
    it('makes components and components/App folders', () => {
      blixReact() 

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(2)
      expect(helpers.mkdirSync.mock.calls[0][0]).toEqual('src/components')
      expect(helpers.mkdirSync.mock.calls[1][0]).toEqual('src/components/App')
    })

    it('moves all files in ./src/App to ./src/components/App', () => {
      blixReact()

      expect(helpers.moveAllFilesInDir).toBeCalled()
      expect(helpers.moveAllFilesInDir.mock.calls[0]).toEqual(["./src/App", "./src/components/App"])
    })

    it('calls createView without a param', () => {
      blixReact()

      expect(mockModule.createView).toBeCalled() 
      expect(mockModule.createView).toBeCalledWith()
    })
  })

  describe('createReactApp', () => {
    it('makes components and components/App folders', () => {
      createReactApp() 

      expect(helpers.mkdirSync).toBeCalled()
      expect(helpers.mkdirSync).toBeCalledTimes(2)
      expect(helpers.mkdirSync.mock.calls[0][0]).toEqual('src/components')
      expect(helpers.mkdirSync.mock.calls[1][0]).toEqual('src/components/App')
    })

    it('moves ./src/App.js to ./src/components/App/App.js', () => {
      createReactApp()

      expect(helpers.rename).toBeCalled()
      expect(helpers.rename.mock.calls[0]).toEqual(["./src/App.js", "./src/components/App/App.js"])
    })

    it('moves App.css, logo.svg and App.test.js if they exist', () => {
      fs.existsSync.mockReturnValue(true)
      createReactApp()

      expect(helpers.rename).toBeCalled()
      expect(helpers.rename).toBeCalledTimes(4)
      expect(helpers.rename.mock.calls[0]).toEqual(["./src/App.js", "./src/components/App/App.js"])
      expect(helpers.rename.mock.calls[1]).toEqual(["./src/App.css", "./src/components/App/App.css"])
      expect(helpers.rename.mock.calls[2]).toEqual(["./src/logo.svg", "./src/components/App/logo.svg"])
      expect(helpers.rename.mock.calls[3]).toEqual(["./src/App.test.js", "./src/components/App/App.test.js"])
    })

    it('calls createView without a param', () => {
      createReactApp()

      expect(mockModule.createView).toBeCalled() 
      expect(mockModule.createView).toBeCalledWith()
    })
  })
})