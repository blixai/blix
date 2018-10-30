jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))
jest.mock('../../../helpers')
jest.mock('../../../add/addProjectInstructions')

const store = require('../../../new/store')
let fs = require('fs')
let inquirer = require('inquirer')
let helpers = require('../../../helpers')

const {
    redux,
    createIndex,
    createContainer,
    createScripts,
    createReactApp,
    basicReactCreatedByBlix,
    reactRouterCreatedByBlix,
    createdByBlix,
    createFilesWithRouter,
    dontAddReactRouter,
    addRedux
} = require('../../../add/redux/addRedux')
const addReduxModule = require('../../../add/redux/addRedux')


describe('addRedux', () => {

    describe('redux', () => {

        it('makes basic redux files and folders', () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
            
            
            redux()

            expect(helpers.mkdirSync).toBeCalledWith('src/actions')
            expect(helpers.writeFile).toBeCalledWith('src/actions/index.js', '')
            expect(helpers.mkdirSync).toBeCalledWith('src/reducers')
            expect(helpers.writeFile).toBeCalledWith('src/reducers/rootReducer.js', expect.stringContaining('rootReducer'))
            expect(helpers.writeFile).toBeCalledWith('src/configStore.js', expect.stringContaining('createStore'))
        })

        it('exits if src doesn\'t exist', () => {
            console.log = jest.fn()
            process.exit = jest.fn()

            redux()

            expect(console.log).toBeCalledWith('No src folder found or src/actions folder already exists.')
            expect(process.exit).toBeCalled()
        })

        it('exits if src exists and already has an actions folder', () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            console.log = jest.fn()
            process.exit = jest.fn()

            redux()

            expect(console.log).toBeCalledWith('No src folder found or src/actions folder already exists.')
            expect(process.exit).toBeCalled()
        })

    })

    describe('createIndex', () => {
        it('overwrites the src/index.js file', () => {
            createIndex()

            expect(helpers.writeFile).toBeCalledWith('src/index.js', expect.stringContaining('Router'))
        })

    })
    describe('createContainer', () => {
        it('returns a generic container', () => {
            let container = createContainer('')
            expect(container).toContain('export default connect(mapStateToProps, null)()')
        })

        it('replaces the basic container template with compnent name of Name to the name passed to it', () => {
            let container = createContainer('Navbar')
            expect(container).toContain('export default connect(mapStateToProps, null)(Navbar)')
        })
    })

    describe('createScripts', () => {
        it('calls helper checkScriptsFolderExist', () => {
            createScripts()

            expect(helpers.checkScriptsFolderExist).toBeCalled()
        })

        it('adds component, action, and view commands to package.json', () => {
            createScripts()
            
            expect(helpers.addScriptToPackageJSON).toBeCalledWith('component', 'node scripts/component.js')
            expect(helpers.addScriptToPackageJSON).toBeCalledWith('action', 'node scripts/action.js')
            expect(helpers.addScriptToPackageJSON).toBeCalledWith('view', 'node scripts/view.js')
        })

        it('writes templates to scripts/templates', () => {
            createScripts()

            expect(helpers.writeFile).toBeCalledWith('scripts/component.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/action.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/view.js', expect.any(String))
        })

        it('writes scripts to scripts', () => {
            createScripts()

            expect(helpers.writeFile).toBeCalledWith('scripts/templates/statelessComponent.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/container.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/statefulComponent.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/reducer.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/action.js', expect.any(String))
        })
    })

    describe('createReactApp', () => {
        it('calls createIndex', () => {
            addReduxModule.createIndex = jest.fn() 

            createReactApp()
    
            expect(addReduxModule.createIndex).toBeCalled()

        })

        it('makes a src/components folder, src/components/App folder, and src/views folder', () => {
            
        })
 

    })

    describe('basicReactCreatedByBlix', () => {
        
    })

    describe('reactRouterCreatedByBlix', () => {
        
    })

    describe('createdByBlix', () => {

    })

    describe('createFilesWithRouter', () => {

    })

    describe('dontAddReactRouter', () => {

    })

    describe('addRedux', () => {

    })
})