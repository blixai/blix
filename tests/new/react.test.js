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
  cssLibrary,
  createSrcContents,
  reactOnly,
  reactRouter,

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

  describe('cssLibrary', () => {
    it('adds @material-ui/core to store.devDependencies if material is in the store', () => {
      const mockAddDevDependencies = helpers.addDevDependenciesToStore.mockReturnValue(true)
      store.reactCSS = 'material'

      cssLibrary()

      expect(mockAddDevDependencies).toBeCalled()
      expect(mockAddDevDependencies.mock.calls[0][0]).toEqual('@material-ui/core')
    })

    it('adds react-bootstrap to store.devDependencies if bootstrap is in the store', () => {
      const mockAddDevDependencies = helpers.addDevDependenciesToStore.mockReturnValue(true)
      store.reactCSS = 'bootstrap'

      cssLibrary()
      
      expect(mockAddDevDependencies).toBeCalled()
      expect(mockAddDevDependencies.mock.calls[0][0]).toEqual('react-bootstrap')
    })

    it('adds styled-components to store.devDependencies if styled is in the store', () => {
      const mockAddDevDependencies = helpers.addDevDependenciesToStore.mockReturnValue(true)
      store.reactCSS = 'styled'

      cssLibrary()
      
      expect(mockAddDevDependencies).toBeCalled()
      expect(mockAddDevDependencies.mock.calls[0][0]).toEqual('styled-components')
    })
  })

  describe('createSrcContents', () => {
    afterEach(() => {
      store.reactType = ''
    })

    it('calls reactOnly if react is selected', () => {
      const mockReactOnly = reactMod.reactOnly = jest.fn().mockReturnValue(true)
      store.reactType = 'react'

      createSrcContents()

      expect(mockReactOnly).toBeCalled()
    })

    it('calls reactRouter if react-router is selected', () => {
      const mockreactRouter = reactMod.reactRouter = jest.fn().mockReturnValue(true)
      store.reactType = 'react-router'

      createSrcContents()

      expect(mockreactRouter).toBeCalled()
    })

    it('calls redux if redux is selected', () => {
      const mockredux = reactMod.redux = jest.fn()
      mockredux.mockReturnValue(true)
      store.reactType = 'redux'

      createSrcContents()

      expect(mockredux).toBeCalled()
    })

    it('calls reactRouterRedux if reactRouter-redux is selected', () => {
      const mockReactRouterRedux = reactMod.reactRouterRedux = jest.fn().mockReturnValue(true)
      store.reactType = 'reactRouter-redux'

      createSrcContents()

      expect(mockReactRouterRedux).toBeCalled()
    })
  })

  describe('reactOnly', () => {

    it('creates a src/App directory', () => {
      const mockMkdirSync = helpers.mkdirSync = jest.fn()
      helpers.writeFile = jest.fn().mockReturnValue(true)

      reactOnly()

      expect(mockMkdirSync).toBeCalled()
      expect(mockMkdirSync.mock.calls[0][0]).toEqual('src/App')
    })

    it('creates index.js, App.js and App.css', () => {
      const mockWriteFile = helpers.writeFile = jest.fn()
      helpers.mkdirSync = jest.fn().mockReturnValue(true)

      reactOnly()

      expect(mockWriteFile).toBeCalled()
      expect(mockWriteFile).toBeCalledTimes(3)
      expect(mockWriteFile.mock.calls[0][0]).toEqual('src/index.js')
      expect(mockWriteFile.mock.calls[1][0]).toEqual('src/App/App.js')
      expect(mockWriteFile.mock.calls[2][0]).toEqual('src/App/App.css')
    })
  })

  describe('reactRouter', () => {
    it('creates components, Navbar, views, and styles directories', () => {
      const mockMkdirSync = helpers.mkdirSync = jest.fn()
      helpers.writeFile = jest.fn().mockReturnValue(true)
      helpers.addDevDependenciesToStore = jest.fn().mockReturnValue(true)

      reactRouter()

      expect(mockMkdirSync).toBeCalled()
      expect(mockMkdirSync).toBeCalledTimes(4)
      expect(mockMkdirSync.mock.calls[0][0]).toEqual('src/components')
      expect(mockMkdirSync.mock.calls[1][0]).toEqual('src/components/Navbar')
      expect(mockMkdirSync.mock.calls[2][0]).toEqual('src/views')
      expect(mockMkdirSync.mock.calls[3][0]).toEqual('src/styles')
    })

    it('creates reactRouter files', () => {
      const mockWriteFile = helpers.writeFile = jest.fn()
      helpers.mkdirSync = jest.fn().mockReturnValue(true)
      helpers.addDevDependenciesToStore = jest.fn().mockReturnValue(true)

      reactRouter()

      expect(mockWriteFile).toBeCalled()
      expect(mockWriteFile).toBeCalledTimes(6)
      expect(mockWriteFile.mock.calls[0][0]).toEqual('src/index.js')
      expect(mockWriteFile.mock.calls[1][0]).toEqual('src/Router.js')
      expect(mockWriteFile.mock.calls[2][0]).toEqual('src/components/Navbar/Navbar.js')
      expect(mockWriteFile.mock.calls[3][0]).toEqual('src/components/Navbar/Navbar.css')
      expect(mockWriteFile.mock.calls[4][0]).toEqual('src/views/Home.js')
      expect(mockWriteFile.mock.calls[5][0]).toEqual('src/styles/global.css')
    })

    it('adds devDependencies to the store', () => {
      helpers.writeFile = jest.fn().mockReturnValue(true)
      helpers.mkdirSync = jest.fn().mockReturnValue(true)
      const mockAddDev = helpers.addDevDependenciesToStore = jest.fn()

      reactRouter()

      expect(mockAddDev).toBeCalled()
      expect(mockAddDev.mock.calls[0][0]).toEqual('react-router-dom')
    })
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

