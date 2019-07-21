const { createCommonFilesAndFolders } = require('../../new/utils/createCommonFiles')
const { e2eSetup } = require('../../new/utils/addEndToEndTesting')
const { newProjectInstructions } = require('../../new/utils/newProjectInstructions')
const { createBackend } = require('../../new/backend');
const store = require('../../new/store')
const helpers = require('../../helpers')
const vueModule = require('../../new/vue')
const addAPIScript = require('../../new/utils/addAPIScript')

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

    describe('createSrcContents', () => {
        beforeEach(() => {
            store.vueType = ''
        })

        it('calls vueOnly if basic vue selected', () => {
            vueModule.vueOnly = jest.fn()
            store.vueType = 'vue'

            createSrcContents()

            expect(vueModule.vueOnly).toBeCalled()
        })

        it('calls vueRouter is vue + router selected', () => {
            vueModule.vueRouter = jest.fn()
            store.vueType = 'vue-router'

            createSrcContents()

            expect(vueModule.vueRouter).toBeCalled() 
        })

        it ('calls vuex if vuex selected', () => {
            vueModule.vuex = jest.fn()
            store.vueType = 'vuex'

            createSrcContents()

            expect(vueModule.vuex).toBeCalled()
        })

        it('calls vueRouterVuex if vue router + vuex selected', () => {
            vueModule.vueRouterVuex = jest.fn()
            store.vueType = 'vueRouter-vuex'

            createSrcContents()

            expect(vueModule.vueRouterVuex).toBeCalled()
        })
    })

    describe('vueOnly', () => {
        it('creates several files and creates a components folder', () => {
            vueOnly()

            expect(helpers.writeFile).toBeCalledWith('src/main.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/App.vue', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/components')
        })
    })

    describe('vueRouter', () => {
        it('creates several files and folders', () => {
            vueRouter() 

            expect(helpers.writeFile).toBeCalledWith('src/main.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/App.vue', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/router.js', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/components')
            expect(helpers.writeFile).toBeCalledWith('src/components/Navbar.vue', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/views')
            expect(helpers.writeFile).toBeCalledWith('src/views/Home.vue', expect.any(String))
        })

        it('adds vue-router as a devDependency to the store', () => {
            vueRouter()

            expect(helpers.addDependenciesToStore).toBeCalledWith('vue-router', 'dev')
        })
    })

    describe('vuex', () => {
        it('creates several files and folders', () => {
            vuex()

            expect(helpers.writeFile).toBeCalledWith('src/main.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/App.vue', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/components')
            expect(helpers.mkdirSync).toBeCalledWith('src/store')
            expect(helpers.writeFile).toBeCalledWith('src/store/index.js', expect.any(String))
        })
        it('adds vue-router as a devDependency to the store', () => {
            vuex()

            expect(helpers.addDependenciesToStore).toBeCalledWith('vuex', 'dev')
        })
    })

    describe('vueRouterVuex', () => {
        it('creates several files and folders', () => {
            vueRouterVuex()

            expect(helpers.writeFile).toBeCalledWith('src/main.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/App.vue', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/router.js', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/components')
            expect(helpers.writeFile).toBeCalledWith('src/components/Navbar.vue', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/views')
            expect(helpers.writeFile).toBeCalledWith('src/views/Home.vue', expect.any(String))
            expect(helpers.mkdirSync).toBeCalledWith('src/store')
            expect(helpers.writeFile).toBeCalledWith('src/store/index.js', expect.any(String))
        })

        it('adds vue-router as a devDependency to the store', () => {
            vueRouterVuex()


            expect(helpers.addDependenciesToStore).toBeCalledWith('vue-router vuex', 'dev')
        })
    })

    describe('scripts', () => {
        it('if no backend create a index.html file and adds a start script to the package json', () => {
            store.backend = ''

            scripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('start', "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'")
            expect(helpers.writeFile).toBeCalledWith('index.html', expect.any(String))
        })

        it('adds a dev script for webpack to the package.json', () => {
            scripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('dev', `webpack --watch --mode='development'`)
        })

        it('calls addAPIScript', () => {
            scripts()

            expect(addAPIScript).toBeCalled()
        })
    })

    describe.skip('vueScripts', () => {

    })

    describe.skip('vueRouterScripts', () => {

    })

    describe.skip('vuexScripts', () => {

    })

    describe.skip('vueRouterVuexScripts', () => {

    })

    describe('packages', () => {
        it('adds webpack-dev-server as a dev dependency if backend isn\'t selected', () => {
            store.backend = ''

            packages()

            expect(helpers.addDependenciesToStore).toBeCalledWith('webpack-dev-server', 'dev')
        })

        it('adds vue dependencies', () => {
            store.backend = ''

            packages()

            expect(helpers.addDependenciesToStore).toBeCalledWith("vue vue-loader vue-style-loader vue-template-compiler webpack webpack-cli babel-loader css-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/runtime style-loader cssnano postcss postcss-preset-env postcss-import postcss-loader blix@next", 'dev')
        })
    })

    describe('createWebpack', () => {
        it('writes a webpack hot reload config if backend is selected and appends main.js with the hot reload code', () => {
            store.backend = { backend: true }

            createWebpack()

            expect(helpers.writeFile).toBeCalledWith('webpack.config.js', expect.any(String))
            expect(helpers.appendFile).toBeCalledWith('src/main.js', expect.any(String))
        })

        it('writes a a normal vue webpack config if no backend selected', () => {
            store.backend = ''

            createWebpack()

            helpers.writeFile('webpack.config.js', expect.any(String))
        })
    })
})