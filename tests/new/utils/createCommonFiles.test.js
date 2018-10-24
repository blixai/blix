
const fs = require('fs')
const child_process = require('child_process')
const store = require('../../../new/store') 
const chalk = require('chalk')
const helpers = require('../../../helpers')
const {createCommonFilesAndFolders} = require('../../../new/utils/createCommonFiles')
jest.mock('fs', () => ({
  readFileSync: jest.fn()
}))

jest.mock('child_process', () => ({
  execSync: jest.fn()
}))
  
describe('Create Common Files', () => {

  describe('Utils: createCommonFiles', () => {
    afterEach(() => {
      store.name = ''
      store.env = ''
    })

    it('creates a new project folder that matches the store name', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()
      const mockWrite = helpers.writeFile = jest.fn()
      const spy = jest.spyOn(process, 'chdir').mockImplementation(() => {
        return false
      })
      store.name = 'testApp'

      createCommonFilesAndFolders()

      expect(mockMkDir).toBeCalled()
      expect(spy).toBeCalled()
      expect(spy).toBeCalledTimes(2)
      expect(spy.mock.calls[0][0]).toEqual('./testApp')
    });

    it('Initalizes a new Git Repository in the project folder', () => {  
      const gitInit = child_process.execSync.mockReturnValue(false)

      createCommonFilesAndFolders()

      expect(gitInit).toBeCalled()
      expect(gitInit.mock.calls[0][0]).toEqual('git init')
    });

    it('Creates common files and folders', () => {
      const mockWrite = helpers.writeFile = jest.fn()

      createCommonFilesAndFolders()

      expect(mockWrite).toBeCalled()
      expect(mockWrite).toBeCalledTimes(4)
      // Creates .gitignore
      expect(mockWrite.mock.calls[0][0]).toEqual('.gitignore')
      // Creates README.md
      expect(mockWrite.mock.calls[1][0]).toEqual('README.md')
      // Create package.json
      expect(mockWrite.mock.calls[2][0]).toEqual('package.json')
      // Create .env
      expect(mockWrite.mock.calls[3][0]).toEqual('.env')
    })

    it('Creates common folders', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()

      createCommonFilesAndFolders()

      expect(mockMkDir).toBeCalled()
      expect(mockMkDir).toBeCalledTimes(4)
      // Creates project dir
      expect(mockMkDir.mock.calls[0][0]).toEqual('')
      // Creates scripts
      expect(mockMkDir.mock.calls[1][0]).toEqual('scripts')
      // Creates scripts/templates
      expect(mockMkDir.mock.calls[2][0]).toEqual('scripts/templates')
      // Creates test
      expect(mockMkDir.mock.calls[3][0]).toEqual('test')
    })

    it('It throws an error if it fails to initalize a git repository', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()
      mockMkDir.mockReturnValueOnce(true)
      child_process.execSync.mockImplementation(() => {
        throw "error"
      })

      console.error = jest.fn()

      createCommonFilesAndFolders()

      expect(child_process.execSync).toBeCalled()
      expect(console.error).toBeCalled()
    })

    it('It throws a Verbose error if it fails to initalize a git repository in dev', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()
      mockMkDir.mockReturnValueOnce(true)
      child_process.execSync.mockImplementation(() => {
        throw "Error"
      })
      store.env = 'development'

      console.error = jest.fn()

      createCommonFilesAndFolders()

      expect(child_process.execSync).toBeCalled()
      expect(console.error).toBeCalled()
      expect(console.error.mock.calls[0][0]).toEqual('Error')
    })
    it('Throws an error if createCommonFiles fails', () => {
      const mockMkDir = helpers.mkdirSync = jest.fn()
      mockMkDir.mockImplementation(() => {
        throw 'Error'
      })
      console.error = jest.fn()

      createCommonFilesAndFolders()

      expect(console.error).toBeCalled()
    })
    it('Throws a verbose error if fails while in development', () => {
      store.env = 'development'
      const mockMkDir = helpers.mkdirSync = jest.fn()
      mockMkDir.mockImplementation(() => {
        throw 'Error'
      })
      console.error = jest.fn()

      createCommonFilesAndFolders()

      expect(console.error).toBeCalled()
      expect(console.error.mock.calls[0][0]).toEqual('Error')
    })
  });
})