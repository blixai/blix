jest.mock('../../../helpers')
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => 'file'),
  existsSync: jest.fn()
}))
jest.mock('inquirer', () => ({
  prompt: jest.fn()
}))
jest.mock('../../../add/addProjectInstructions')
jest.mock('../../../new/backend')
jest.mock('../../../new/utils/addBackendTests')

const { 
  addBackend,
  createBackend,
  checkScripts,
  pugScript
} = require('../../../add/backend/addBackend')

const {
  packages,
  standard,
  mvcType,
  apiType,
  scripts,
  addDatabase
} = require('../../../new/backend')
const helpers = require('../../../helpers')
const fs = require('fs')
const addBackendModule = require('../../../add/backend/addBackend')
const store = require('../../../new/store')
const { addProjectInstructions } = require('../../../add/addProjectInstructions')
const { testBackend } = require('../../../new/utils/addBackendTests')
const inquirer = require('inquirer')

describe('addBackend', () => {

  describe('addBackend', () => {
    beforeEach(() => {
      inquirer.prompt
      .mockResolvedValueOnce({ mode: 'api' })
      .mockResolvedValueOnce({ server: 'mocha' })
      .mockResolvedValueOnce({ database: 'mongo' })
    })

    it('prompts for backendType, serverTesting, and database options', async () => {
      await addBackend()

      expect(inquirer.prompt).toBeCalledTimes(3)
    })

    it('calls helpers.yarn', async () => {
      await addBackend()
      expect(helpers.yarn).toBeCalled()
    })

    it('calls createBackend with the selections as arguments', async () => {
      addBackendModule.createBackend = jest.fn()

      await addBackend() 

      expect(addBackendModule.createBackend).toBeCalledWith({ mode: 'api' }, { server: 'mocha' }, { database: 'mongo' })
    })
  })

  describe('create backend', () => {
    it('exits if a folder named "server" already exists', () => {
      fs.existsSync = jest.fn().mockReturnValueOnce(true)
      console.error = jest.fn()
      process.exit = jest.fn()

      createBackend({ mode: 'api' })

      expect(console.error).toBeCalledWith('Server folder already exists')
      expect(process.exit).toBeCalled()
    })

    it('makes folders and files', () => {
      createBackend({ mode: 'api' })

      expect(helpers.mkdirSync).toBeCalledTimes(5)
      expect(helpers.mkdirSync).toBeCalledWith('server')
      expect(helpers.mkdirSync).toBeCalledWith('server/models')
      expect(helpers.mkdirSync).toBeCalledWith('server/controllers')
      expect(helpers.mkdirSync).toBeCalledWith('server/helpers')
      expect(helpers.writeFile).toBeCalledWith('server/routes.js', expect.any(String))
      expect(helpers.writeFile).toBeCalledWith('server/cluster.js', expect.any(String))
    })

    it('makes an "assets" folder if mode isn\'t api', () => {
      createBackend({ mode: 'api' }) 

      expect(helpers.mkdirSync).toBeCalledWith('assets')
    })

    it('calls standard if backendType selected is standard', () => {
      createBackend({ mode: 'standard' })

      expect(standard).toBeCalled()
    })

    it('calls mvcType if backendType selected is mvc', () => {
      createBackend({ mode: 'mvc' })

      expect(mvcType).toBeCalled()
    })

    it('calls apiType by default', () => {
      createBackend({ mode: '' })

      expect(apiType).toBeCalled() 
    })

    it('calls several final functions', () => {
      addBackendModule.checkScripts = jest.fn()

      createBackend({ mode: 'api' })

      expect(helpers.checkScriptsFolderExist).toBeCalled()
      expect(addDatabase).toBeCalled()
      expect(addBackendModule.checkScripts).toBeCalled()
      expect(packages).toBeCalled()
      expect(testBackend).toBeCalled()
      expect(helpers.installAllPackages).toBeCalled()
      expect(addProjectInstructions).toBeCalled()
    })
  })

  describe('checkScripts', () => {
    it('calls scripts with argument mode', () => {
      checkScripts('mode')

      expect(scripts).toBeCalledWith('mode')
    })

    it('calls pugScript if backendType selected is mvc', () => {
      addBackendModule.pugScript = jest.fn()

      checkScripts('mvc')

      expect(addBackendModule.pugScript).toBeCalled()
    })
  })


  describe('pugScript', () => {
    it('checks if a view command exists and if it does creates command server:view and writes scripts/pug.js', () => {
      helpers.checkIfScriptIsTaken = jest.fn().mockReturnValueOnce(true)

      pugScript()

      expect(helpers.addScriptToPackageJSON).toBeCalledWith('server:view', 'node scripts/pug.js')
      expect(helpers.writeFile).toBeCalledWith('scripts/pug.js', expect.any(String))
    })

    it('if command view isn\'t taken creates a view command and writes scripts/view.js', () => {
      helpers.checkIfScriptIsTaken = jest.fn().mockReturnValueOnce(false)

      pugScript()

      expect(helpers.addScriptToPackageJSON).toBeCalledWith('view', 'node scripts/view.js')
      expect(helpers.writeFile).toBeCalledWith('scripts/view.js', expect.any(String))
    })

    it('creates a pugTemplate', () => {
      pugScript()

      expect(helpers.writeFile).toBeCalledWith('scripts/templates/pugTemplate.pug', expect.any(String))
    })
  })
})