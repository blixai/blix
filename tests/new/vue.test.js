const { createCommonFilesAndFolders } = require('../../new/utils/createCommonFiles')
const { e2eSetup } = require('../../new/utils/addEndToEndTesting')
const { newProjectInstructions } = require('../../new/utils/newProjectInstructions')
const { createBackend } = require('../../new/backend');
const store = require('../../new/store')
const helpers = require('../../helpers')
const vueModule = require('../../new/vue')
const addAPIScripts = require('../../new/utils/addAPIScript')

const {
    vue,
    createSrcContents,
    vueOnly,
    vueRouter,
    vuex,
    vueRouterVuex,
    scripts,
    vueScripts,
    vueRouterScripts,
    vuexScripts,
    vueRouterVuexScripts,
    packages,
    createWebpack 
} = require('../../new/vue')

jest.mock('../../new/utils/createCommonFiles')
jest.mock('../../helpers')
jest.mock('../../new/utils/addEndToEndTesting')
jest.mock('../../new/backend')
jest.mock('../../new/utils/addEndToEndTesting')
jest.mock('../../new/utils/newProjectInstructions')
jest.mock('../../new/utils/createCommonFiles', () => ({
  createCommonFilesAndFolders: jest.fn()
}))
jest.mock('../../new/utils/addAPIScript')


describe('new/vue', () => {
    describe('vue', () => {

        it('calls createCommonFilesAndFolders', () => {
            vue()

            expect(createCommonFilesAndFolders).toBeCalled()
        })

        it('creates basic folder structure', () => {
            vue()

            expect(helpers.mkdirSync).toBeCalledTimes(3)
            expect(helpers.mkdirSync).toBeCalledWith('dist')
            expect(helpers.mkdirSync).toBeCalledWith('src')
            expect(helpers.mkdirSync).toBeCalledWith('src/api')
        })

        it('calls createSrcContents', () => {
            vueModule.createSrcContents = jest.fn()

            vue()

            expect(vueModule.createSrcContents).toBeCalled()
        })

        it('creates config files postcss and .babelrc', () => {
            vue()

            expect(helpers.writeFile).toBeCalledWith('postcss.config.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('.babelrc', expect.any(String))
        })

        it('calls createWebpack', () => {
            vueModule.createWebpack = jest.fn()            

            vue()

            expect(vueModule.createWebpack).toBeCalled()
        })

        it.skip('calls addLinter', () => {

        })

        it.skip('calls cssLibrary', () => {

        })

        it.skip('installVueTesting', () => {

        })

        it('calls e2eSetup', () => {
            vue()

            expect(e2eSetup).toBeCalled()
        })

        it('calls scripts', () => {
            vueModule.scripts = jest.fn() 

            vue()

            expect(vueModule.scripts).toBeCalled()
        })

        it('calls packages', () => {
            vueModule.packages = jest.fn()

            vue()

            expect(vueModule.packages).toBeCalled()
        })

        it('sets backendType and calls createBackend if backend if selected', () => {
            store.backend = { backend: true }
            store.backendType = ''

            vue()

            expect(store.backendType).toEqual('standard')
            expect(createBackend).toBeCalled() 
        })

        it('calls installAllPackages and newProjectInstructions if no backend selected', () => {
            store.backend = '' 
            store.backendType = ''

            vue()

            expect(helpers.installAllPackages).toBeCalled()
            expect(newProjectInstructions).toBeCalled()
        })
    })
})