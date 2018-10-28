jest.mock('../../helpers')

const {createCommonFilesAndFolders} = require('../../new/utils/createCommonFiles')
const {testBackend} = require('../../new/utils/addBackendTests')
const {addLinter} = require('../../new/utils/addLinter')
const {addMongooseToScripts} = require('../../new/utils/addMongoDB')
const {addBookshelfToScripts} = require('../../new/utils/addBookshelf')
const {newProjectInstructions} = require('../../new/utils/newProjectInstructions')
const helpers = require('../../helpers')
const fs = require('fs')
const store = require('../../new/store')
const backend = require('../../new/backend')
const {
  createBackend,
  standard,
  mvcType,
  apiType,
  addDatabase,
  scripts,
  packages,
  envSetup
} = require('../../new/backend')

jest.mock('../../new/utils/addBackendTests')
jest.mock('../../new/utils/addMongoDB')
jest.mock('../../new/utils/addBookshelf')
jest.mock('../../new/utils/newProjectInstructions')
jest.mock('fs', () => ({
  readFileSync: jest.fn()
}))
jest.mock('path', () => ({
  resolve: jest.fn()
}))
jest.mock('../../new/utils/addLinter', () => ({
  addLinter: jest.fn()
}))
jest.mock('../../new/utils/createCommonFiles', () => ({
  createCommonFilesAndFolders: jest.fn()
}))
jest.mock('../../new/utils/addBackendTests', () => ({
  testBackend: jest.fn()
}))


describe('new/backend.js', () => {

  describe('createBackend', () => {
    beforeEach(() => {
      store.backendType = ''
      fs.readFileSync.mockReturnValue(true)
    })

    it('creates common files and folders if backendType is api', () => {
      store.backendType = 'api'

      createBackend()

      expect(createCommonFilesAndFolders).toBeCalled()
    })

    it('creates server folder structure', () => {
      createBackend()

      expect(helpers.mkdirSync).toBeCalledTimes(5)
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('server/routes.js')
      expect(helpers.writeFile.mock.calls[1][0]).toEqual('server/cluster.js')
    })


    it('does not create an assets folder if backend type isn\'t api', () => {
      store.backendType = 'api'

      createBackend()

      expect(helpers.mkdirSync).not.toBeCalledWith('assets')
      store.backendType = ''

      createBackend()

      expect(helpers.mkdirSync).toBeCalledWith('assets')
    })

    it('creates a standard type if backendType is standard', () => {
      const mockStandard = backend.standard = jest.fn()
      store.backendType = 'standard'

      createBackend()

      expect(mockStandard).toBeCalled()
    })

    it('creates a mvc type if backendType is mvc', () => {
      const mockMvcType = backend.mvcType = jest.fn()
      store.backendType = 'mvc'

      createBackend()

      expect(mockMvcType).toBeCalled()
    })

    it('creates a api type if backendType is api', () => {
      const mockApiType = backend.apiType = jest.fn()

      createBackend()

      expect(mockApiType).toBeCalled()
    })

    it('calls addDatabase', () => {
      const mockAddDb = backend.addDatabase = jest.fn()
      store.database = 'pg'

      createBackend()

      expect(mockAddDb).toBeCalled()
      expect(mockAddDb).toBeCalledWith('pg')
    })

    it('calls scripts', () => {
      const mockScripts = backend.scripts = jest.fn()
      store.backendType = 'standard'

      createBackend()

      expect(mockScripts).toBeCalled()
      expect(mockScripts).toBeCalledWith('standard')
    })

    it('calls packages', () => {
      const mockPackages = backend.packages = jest.fn()
      store.backendType = 'standard'

      createBackend()

      expect(mockPackages).toBeCalled()
      expect(mockPackages).toBeCalledWith('standard')
    })

    it('calls testBackend', () => {
      store.serverTesting = 'jest'

      createBackend()

      expect(testBackend).toBeCalled()
      expect(testBackend).toBeCalledWith('jest')
    })

    it('calls envSetup', () => {
      const mockEnvSetup = backend.envSetup = jest.fn()

      createBackend()

      expect(mockEnvSetup).toBeCalled()
    })

    it('calls installAllPackages', () => {
      createBackend()

      expect(helpers.installAllPackages).toBeCalled()
    })

    it('calls newProjectInstructions', () => {
      createBackend()

      expect(newProjectInstructions).toBeCalled()
    })
  })

  describe('standard backend type', () => {
    it('creates a view', () => {
      standard()

      expect(helpers.mkdirSync).toBeCalledWith('server/views')
      expect(helpers.mkdirSync).toBeCalledWith('server/views/home')
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('server/views/home/index.html')
    })

    it('creates a server file', () => {
      standard()

      expect(helpers.writeFile.mock.calls[1][0]).toEqual('server/server.js')
    })

    it('creates a controller', () => {
      standard()

      expect(helpers.writeFile.mock.calls[2][0]).toEqual('server/controllers/home.js')
    })
  })

  // mvc type is not yet implemented
  describe('mvc backend type', () => {
    it('creates a view home view, layout view, and error view', () => {
      mvcType()

      expect(helpers.mkdirSync).toBeCalledWith('server/views')
      expect(helpers.mkdirSync).toBeCalledWith('server/views/home')
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('server/views/error.pug')
      expect(helpers.writeFile.mock.calls[1][0]).toEqual('server/views/layout.pug')
      expect(helpers.writeFile.mock.calls[2][0]).toEqual('server/views/home/index.pug')
    })

    it('creates a server file', () => {
      const mockWrite = helpers.writeFile
      mvcType()

      expect(mockWrite.mock.calls[3][0]).toEqual('server/server.js')
    })
  })

  describe('api backend type', () => {
    it('creates a server', () => {
      apiType()

      expect(helpers.writeFile.mock.calls[0][0]).toEqual('server/server.js')
    })

    it('creates a home controller', () => {
      apiType()

      expect(helpers.writeFile.mock.calls[1][0]).toEqual('server/controllers/home.js')
      expect(addLinter).toBeCalled()
    })
  })

  describe('addDatabase', () => {

    it('adds mongo with mongoose if database selection is mongo', () => {
      addDatabase({database: 'mongo'})

      expect(addMongooseToScripts).toBeCalled()
    })

    it('adds postgres with bookshelf if database selection is postgres', () => {
      addDatabase({database: 'pg'})

      expect(addBookshelfToScripts).toBeCalled()
    })
  })

  describe('scripts', () => {
    it('adds a start script', () => {
      scripts()

      expect(helpers.addScriptToNewPackageJSON).toBeCalledWith('start', 'nodemon server/cluster.js')
    })

    it('adds a different start script for standard backends which use webpack-dev-middleware', () => {
      scripts('standard')

      expect(helpers.addScriptToNewPackageJSON).toBeCalledWith('start', 'nodemon --watch server server/cluster.js')
    })

    it('adds a controller script', () => {
      scripts()

      expect(helpers.addScriptToNewPackageJSON).toBeCalledWith('controller', 'node scripts/controller.js')
    })

    it('adds the controller script with templates to the scripts/ folder', () => {
      scripts()

      expect(helpers.writeFile).toBeCalledTimes(3)
      expect(helpers.writeFile).toBeCalledWith('scripts/controller.js', true)
      expect(helpers.writeFile).toBeCalledWith('scripts/templates/controller.js', true)
      expect(helpers.writeFile).toBeCalledWith('scripts/templates/routes.js', true)
    })

  })

  describe('packages', () => {

    it('adds packages for standard mode', () => {
      packages('standard')

      expect(helpers.addDependenciesToStore).toBeCalledWith('express nodemon body-parser compression helmet dotenv morgan cookie-parser')
      expect(helpers.addDevDependenciesToStore).toBeCalledWith('webpack-dev-middleware webpack-hot-middleware')
    })

    it('adds packages for mvc mode', () => {
      packages('mvc')

      expect(helpers.addDependenciesToStore).toBeCalledWith('express nodemon body-parser compression helmet dotenv morgan cookie-parser pug')
    })

    it('adds packages for api mode', () => {
      packages()

      expect(helpers.addDependenciesToStore).toBeCalledWith('express nodemon body-parser compression helmet dotenv morgan')
    })
  })

  describe('envSetup', () => {
    envSetup()

    expect(helpers.appendFile).toBeCalledWith('.env', '\nWORKERS=1')
  })
})