const { createCommonFilesAndFolders } = require('../../new/utils/createCommonFiles')
const { addLinter } = require('../../new/utils/addLinter')
const { installReactTesting } = require('../../new/utils/addReactTesting')
const { e2eSetup } = require('../../new/utils/addEndToEndTesting')
const { newProjectInstructions } = require('../../new/utils/newProjectInstructions')
const {createBackend} = require("../../new/backend");
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

describe("new/react", () => {

  describe("react", () => {

  })

  describe.skip('cssLibrary', () => {

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

