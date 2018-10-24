const {createCommonFilesAndFolders} = require('../../new/utils/createCommonFiles')
const {addLinter} = require('../../new/utils/addLinter')
const {installReactTesting} = require('../../new/utils/addReactTesting')
const {e2eSetup} = require('../../new/utils/addEndToEndTesting')
const {newProjectInstructions} = require('../../new/utils/newProjectInstructions')
const {createBackend} = require('../../new/backend');
const store = require('../../new/store')
const helpers = require('../../helpers')
const fs = require('fs')

const {
  react,
  cssLibrary,
  createSrcContents,
  reactOnly,
  reactRouter,
  redux,
  reactRouterRedux,
  scripts,
  reactScripts,
  reactRouterScripts,
  reduxScripts,
  reactRouterReduxScripts,
  packages,
  createWebpack
} = require('../../new/react')

jest.mock('../../new/utils/createCommonFiles')
jest.mock('../../helpers')
jest.mock('../../new/react')
jest.mock('../../new/utils/addEndToEndTesting')
jest.mock('../../new/utils/newProjectInstructions')
jest.mock('../../new/backend')
jest.mock('../../new/utils/addLinter')
jest.mock('fs', () => ({
  readFileSync: jest.fn()
}))

describe('new/react', () => {

  describe('react', () => {

    it('calls createCommonFilesAndFolders', () => {

    })

    it('creates react folder structure', () => {

    })

    it('calls createSrcContents', () => {

    })

    it('creates a postcss file', () => {

    })

    it('creates a .babelrc file')

    it('calls createWebpack', () => {

    })

    it('calls addLinter', () => {

    })

    it('calls cssLibrary', () => {

    })

    it('calls installReactTesting', () => {

    })

    it('calls e2eSetup', () => {

    })

    it('calls scripts', () => {

    })

    it('calls packages', () => {

    })

    it('sets backendType and calls createBackend if backend is added to store', () => {

    })

    it('calls installAllPackages and newProjectInstructions if no backend selected', () => {

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

