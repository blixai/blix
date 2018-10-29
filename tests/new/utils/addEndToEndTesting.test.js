const store = require('../../../new/store')
let helpers = require('../../../helpers')

jest.mock('../../../helpers')
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
}))

let fs = require('fs')

let {
  e2eSetup,
  installCypress,
  installTestCafe,
  addJestToPackageJson
} = require ('../../../new/utils/addEndToEndTesting')

describe('New Utils module: addEndToEndTesting', () => {

  describe('e2eSetup', () => {
    beforeEach(() => {
        store.e2e = ''
    })

    it('calls installTestCafe if test cafe selected in store', () => {
        fs.readFileSync.mockReturnValue(`{"jest": {} }`)
        store.e2e = { e2e: 'cafe' }
        e2eSetup()
        expect(helpers.addDevDependenciesToStore).toBeCalledWith('testcafe')
    })
    it('calls installCypress if cypress selected in store', () => {
        fs.readFileSync.mockReturnValue(`{"jest": {} }`)
        store.e2e = { e2e: 'cypress' }
        e2eSetup()
        expect(helpers.addDevDependenciesToStore).toBeCalledWith('cypress')
    })
  })

  describe('installCypress', () => {
    it('sets up cypress', () => {
        fs.readFileSync.mockReturnValue(`{"jest": {} }`)
        installCypress()
        expect(helpers.addScript).toBeCalledWith("e2e", "cypress open")
        expect(helpers.addDevDependenciesToStore).toBeCalledWith("cypress")
        expect(helpers.mkdirSync).toBeCalledTimes(2)
        expect(helpers.writeFile.mock.calls[0][0]).toEqual('cypress/integration/test.js')
        expect(fs.writeFileSync.mock.calls[0][0]).toEqual('package.json')
    })
  })

  describe('installTestCafe', () => {
    it('sets up cafe', () => {
      fs.readFileSync.mockReturnValue(`{"jest": {} }`)
      installTestCafe()
      expect(helpers.addScript).toBeCalledWith("e2e", "testcafe chrome test/e2e")
      expect(helpers.addDevDependenciesToStore).toBeCalledWith("testcafe")
      expect(helpers.mkdirSync).toBeCalledTimes(1)
      expect(helpers.writeFile.mock.calls[0][0]).toEqual('test/e2e/test.js')
      expect(fs.writeFileSync.mock.calls[0][0]).toEqual('package.json')
    })
  })

  describe('Adds jest to package.json', () => {
    it('Adds Jest to package.json if Jest doesn\'t', () => {
      fs.readFileSync.mockReturnValue(`{"scripts": {}}`)
      installCypress()
      expect(fs.writeFileSync.mock.calls[0][1]).toContain('jest')
    })
    it('Includes modulePathIgnorePatterns if Jest exists', () => {
      fs.readFileSync.mockReturnValue(`{"jest": {} }`)
      installCypress()
      expect(fs.writeFileSync.mock.calls[0][1]).toContain('modulePathIgnorePatterns')
    })
  })
})