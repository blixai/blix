const store = require('../../../new/store')
let helpers = require('../../../helpers')

jest.mock('../../../helpers')
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  writeFileSync: jest.fn()
}))

let fs = require('fs')

let {
  mochaTestBackend,
  testJestBackend,
  testBackend
} = require('../../../new/utils/addBackendTests')

describe('New Utils module: addBackendTests', () => {

  describe('testBackend', () => {

    beforeEach(() => {
      store.serverTesting = ''
    })

    it('invokes mochaTestBackend() if mocha testing selected', () => {
      store.serverTesting = { server: 'mocha' }
      fs.readFileSync.mockReturnValue('{ "test": 1 }')
      fs.existsSync.mockReturnValue(false)

      testBackend()

      expect(helpers.addDevDependenciesToStore).toBeCalledWith('mocha chai chai-http')
    })

    it('invokes testJestBackend() if jest testing selected', () => {
      store.serverTesting = { server: 'jest' }
      fs.readFileSync.mockReturnValue('{ "test": 1 }')
      fs.existsSync.mockReturnValue(false) 

      testBackend()

      expect(helpers.addDevDependenciesToStore).toBeCalledWith('jest supertest')
    })

    it('won\'t create a server folder if one already exists', () => {
      store.serverTesting = { server: 'mocha' }
      fs.readFileSync.mockReturnValue('{ "test": 1 }')
      fs.existsSync.mockReturnValue(true) 

      testBackend()

      expect(helpers.mkdirSync).not.toBeCalled()
    })
  })

  describe('mochaTestBackend', () => {
    it('sets up mocha with chia-http for server testing', () => {
      fs.readFileSync.mockReturnValue('{ "jest": {} }')
      fs.existsSync.mockReturnValue(false) // make the checkOrCreateServerTestFolder function fire

      mochaTestBackend()

      expect(helpers.addDevDependenciesToStore).toBeCalledWith('mocha chai chai-http')
      expect(helpers.addScript).toBeCalled()
      expect(helpers.addScript).toBeCalledWith('mocha', 'mocha test/server')
      expect(fs.existsSync).toHaveBeenCalled()
      expect(helpers.mkdirSync).toHaveBeenCalledWith('test/server')
      // called twice due to file loading to write the test file
      expect(fs.readFileSync).toBeCalledTimes(2)
      expect(helpers.writeFile).toBeCalledTimes(1)
      expect(fs.writeFileSync).toBeCalledTimes(1)
      expect(fs.writeFileSync.mock.calls[0][1]).toContain('modulePathIgnorePatterns');
    })

    it('doesn\'t add jest configuration modules if jest isn\'t used on the frontend', () => {
      fs.readFileSync.mockReturnValue('{ "scripts": {} }')
      fs.existsSync.mockReturnValue(false) // make the checkOrCreateServerTestFolder function fire 

      mochaTestBackend()

      expect(fs.writeFileSync.mock.calls[0][1]).not.toContain('modulePathIgnorePatterns')
    })
  })

  describe('testJestBackend', () => {
    it('sets up jest for backend testing', () => {
      fs.readFileSync.mockReturnValue('{ "scripts": {} }')
      fs.existsSync.mockReturnValue(false) // make the checkOrCreateServerTestFolder function fire

      testJestBackend()

      expect(helpers.addDevDependenciesToStore).toBeCalledWith('jest supertest')
      expect(helpers.mkdirSync).toBeCalledWith('test/server')
      expect(helpers.writeFile).toBeCalled()
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('test/server/test.spec.js')
      expect(fs.writeFileSync).toBeCalled()      
      expect(fs.writeFileSync.mock.calls[0][1]).toContain('modulePathIgnorePatterns')
      expect(helpers.addScript).toBeCalledWith("jest", "jest")
    })

    it('won\'t add jest config to package.json if the project already uses jest', () => {
      fs.readFileSync.mockReturnValue('{ "jest": {} }')
      fs.existsSync.mockReturnValue(false)  

      testJestBackend()

      expect(fs.writeFileSync.mock.calls[0][1]).not.toContain('modulePathIgnorePatterns')
    })
  })
})
