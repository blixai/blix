const {createCommonFilesAndFolders} = require('../../new/utils/createCommonFiles')
const {addLinter} = require('../../new/utils/addLinter')
const {installReactTesting} = require('../../new/utils/addReactTesting')
const {e2eSetup} = require('../../new/utils/addEndToEndTesting')
const {newProjectInstructions} = require('../../new/utils/newProjectInstructions')
const {createBackend} = require('../../new/backend');
const store = require('../../new/store')
const helpers = require('../../helpers')
const reactMod = require('../../new/react')
const {
  react,
} = require('../../new/react')

jest.mock('../../new/utils/createCommonFiles')
jest.mock('../../helpers')
jest.mock('../../new/utils/addEndToEndTesting')
jest.mock('../../new/backend')
jest.mock('../../new/utils/addLinter')
jest.mock('../../new/utils/addEndToEndTesting')
jest.mock('../../new/utils/addReactTesting')
jest.mock('../../new/utils/newProjectInstructions')
jest.mock('../../new/utils/createCommonFiles', () => ({
  createCommonFilesAndFolders: jest.fn()
}))

describe('new/react', () => {

  describe('react', () => {

    it('calls createCommonFilesAndFolders', () => {
      helpers.mkdirSync.mockReturnValue(true)
      helpers.writeFile.mockReturnValue(true)

      react()

      expect(createCommonFilesAndFolders).toBeCalled()
    })

    it('creates react folder structure', () => {
      const mockMkdirSync = helpers.mkdirSync.mockReturnValue(true)

      react()

      expect(mockMkdirSync).toBeCalledTimes(3)
      expect(mockMkdirSync.mock.calls[0][0]).toEqual("dist")
      expect(mockMkdirSync.mock.calls[1][0]).toEqual("src")
      expect(mockMkdirSync.mock.calls[2][0]).toEqual("src/services")
    })

    it('calls createSrcContents', () => {
      const mockCreate = reactMod.createSrcContents = jest.fn()
      mockCreate.mockReturnValue(true)

      react()

      expect(mockCreate).toBeCalled()
    })

    it('creates config files, postcss and .babelrc', () => {
      const mockWrite = helpers.writeFile.mockReturnValue(true)
      const mockCreateWebpack = reactMod.createWebpack = jest.fn()
      const mockScripts = reactMod.scripts = jest.fn()
      mockCreateWebpack.mockReturnValue(true)
      mockScripts.mockReturnValue(true)

      react()

      expect(mockWrite).toBeCalled()
      expect(mockWrite).toBeCalledTimes(2)
      expect(mockWrite.mock.calls[0][0]).toEqual('postcss.config.js')
      expect(mockWrite.mock.calls[1][0]).toEqual('.babelrc')
    })

    it('calls createWebpack', () => {
      const mockCreateWebpack = reactMod.createWebpack = jest.fn()
      mockCreateWebpack.mockReturnValue(true)

      react()

      expect(mockCreateWebpack).toBeCalled()
    })

    it('calls addLinter', () => {
      react()
      expect(addLinter).toBeCalled()
    })

    it('calls cssLibrary', () => {
      const mockCssLibrary = reactMod.cssLibrary = jest.fn()
      mockCssLibrary.mockReturnValue(true)

      react()

      expect(mockCssLibrary).toBeCalled()
    })

    it('calls installReactTesting', () => {
      react()
      expect(installReactTesting).toBeCalled()
    })

    it('calls e2eSetup', () => {
      react()
      expect(e2eSetup).toBeCalled()
    })

    it('calls scripts', () => {
      const mockScripts = reactMod.scripts = jest.fn()
      mockScripts.mockReturnValue(true)

      react()

      expect(mockScripts).toBeCalled()
    })

    it('calls packages', () => {
      const mockPackages = reactMod.packages = jest.fn()
      mockPackages.mockReturnValue(true)

      react()

      expect(mockPackages).toBeCalled()
    })

    it('sets backendType and calls createBackend if backend is added to store', () => {
      store.backend = {backend: true}

      react()

      expect(store.backendType).toEqual('standard')
      expect(createBackend).toBeCalled()
    })

    it('calls installAllPackages and newProjectInstructions if no backend selected', () => {
      store.backend = {backend: false}
      const mockInstallAllPackages = helpers.installAllPackages = jest.fn()
      mockInstallAllPackages.mockReturnValue(true)

      react()

      expect(mockInstallAllPackages).toBeCalled()
      expect(newProjectInstructions).toBeCalled()
    })
  })

  describe.skip('cssLibrary', () => {
    it('adds @material-ui/core to store.devDependencies if material is in the store', () => {

    })

    it('adds react-bootstrap to store.devDependencies if bootstrap is in the store', () => {

    })

    it('adds styled-components to store.devDependencies if styled is in the store', () => {

    })
  })

  describe.skip('createSrcContents', () => {

  })

  describe.skip('reactOnly', () => {

  })

  describe.skip('reactRouter', () => {

  })

  describe.skip('redux', () => {

  })

  describe.skip('reactRouterRedux', () => {

  })

  describe.skip('scripts', () => {

  })

  describe.skip('reactScripts', () => {

  })

  describe.skip('reactRouterScripts', () => {

  })

  describe.skip('reduxScripts', () => {

  })

  describe.skip('reactRouterReduxScripts', () => {

  })

  describe.skip('packages', () => {

  })

  describe.skip('createWebpac', () => {

  })

})

