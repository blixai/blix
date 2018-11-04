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
            addReduxModule.createContainer = jest.fn()

            createReactApp()            

            expect(helpers.mkdirSync).toBeCalledWith('src/components')
            expect(helpers.mkdirSync).toBeCalledWith('src/components/App')
            expect(helpers.mkdirSync).toBeCalledWith('src/views')
        })
        
        it('creates a router file', () => {
            createReactApp()

            expect(helpers.writeFile).toBeCalledWith('src/Router.js', expect.any(String))
        })
 
        it('moves files if they exist', () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            addReduxModule.createContainer = jest.fn().mockReturnValueOnce('')
            addReduxModule.createScripts = jest.fn()

            createReactApp()

            expect(helpers.writeFile).toBeCalledWith('src/Router.js', expect.any(String))


            expect(helpers.rename).toBeCalledWith('./src/App.js', './src/components/App/App.js')

            expect(helpers.rename).toBeCalledWith('./src/App.css', './src/components/App/App.css')
            expect(helpers.rename).toBeCalledWith('./src/logo.svg', './src/components/App/logo.svg')         
            expect(helpers.rename).toBeCalledWith('./src/App.test.js', './src/components/App/App.test.js')
        })

        it('creates a redux container named "App"', () => {
            addReduxModule.createContainer = jest.fn().mockReturnValueOnce('')

            createReactApp()

            expect(addReduxModule.createContainer).toBeCalledWith('App')
            expect(helpers.writeFile).toBeCalledWith('src/components/App/AppContainer.js', expect.any(String))

        })

        it('creates a view "Home" in the src/views folder', () => {
            createReactApp()

            expect(helpers.writeFile).toBeCalledWith('src/views/Home.js', expect.any(String))
        })

        it('calls createScripts', () => {
            addReduxModule.createScripts = jest.fn()

            createReactApp()

            expect(addReduxModule.createScripts).toBeCalled()
        })
    })

    describe('basicReactCreatedByBlix', () => {
        beforeEach(() => {
            fs.rmdirSync = jest.fn()
        })

        it('creates a Router.js file', () => {
            basicReactCreatedByBlix()

            expect(helpers.writeFile).toBeCalledWith('src/Router.js', expect.any(String))
        })

        it('creates and moves files into src/components/App', () => {
            addReduxModule.createContainer = jest.fn().mockReturnValueOnce('')

            basicReactCreatedByBlix()

            expect(helpers.rename).toBeCalledWith('./src/App/App.js', './src/components/App/App.js')
            expect(addReduxModule.createContainer).toBeCalledWith('App')
            expect(helpers.writeFile).toBeCalledWith('src/components/App/AppContainer.js', expect.any(String))
            expect(helpers.rename).toBeCalledWith('./src/App/App.css', './src/components/App/App.css')
        })

        it('creates a view "Home" in src/views', () => {
            basicReactCreatedByBlix()

            expect(helpers.writeFile).toBeCalledWith('src/views/Home.js', expect.any(String))
        })

        it('try\'s to delete the src/App folder', () => {
            basicReactCreatedByBlix()

            expect(fs.rmdirSync).toBeCalledWith('./src/App')

        })

        it('logs an error if it can\'t remove the src/App folder', () => {
            fs.rmdirSync.mockImplementation(() => {throw 'Error'})
            console.error = jest.fn()

            basicReactCreatedByBlix()

            expect(fs.rmdirSync).toBeCalledWith('./src/App')
            expect(console.error).toBeCalledWith('Error')
        })
    })

    describe.skip('reactRouterCreatedByBlix', () => {
       it('reads all files and folders in the src/components directory', () => {
            fs.readdirSync = jest.fn().mockReturnValueOnce(['Navbar', 'App'])
            fs.lstatSync
            fs.stat.isDirectory = jest.fn()
            // process.stdout(fs.lstatSync('').isDirectory())
            // fs.lstatSync = jest.fn()
            // let stat = fs.lstatSync
            // stat.isDirectory = jest.fn()
            // fs.lstatSync.isDirectory = jest.fn()
                // .mockReturnValueOnce(true)

            reactRouterCreatedByBlix()             

            // expect(fs.readdirSync).toBeCalledWith('./src/components')
       }) 

       it('for each directory in src/components a redux container file is created and written into that directory', () => {

       })

       it('calls createIndex', () => {

       })
    })

    describe('createdByBlix', () => {
        it('is a react-router type if src/views and src/components exist and calls reactRouterCreatedByBlix', () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            addReduxModule.reactRouterCreatedByBlix = jest.fn()

            createdByBlix()
            
            expect(addReduxModule.reactRouterCreatedByBlix).toBeCalled()
        })

        it('is a basic react type if and calls basicReactCreatedByBlix after creating folders', () => {
            addReduxModule.basicReactCreatedByBlix = jest.fn()

            createdByBlix()

            expect(helpers.mkdirSync).toBeCalledWith('src/components')
            expect(helpers.mkdirSync).toBeCalledWith('src/components/App')
            expect(helpers.mkdirSync).toBeCalledWith('src/views')
            expect(addReduxModule.basicReactCreatedByBlix).toBeCalled()
        })

        it('calls createIndex and createScripts', () => {
            addReduxModule.createIndex = jest.fn()
            addReduxModule.createScripts = jest.fn()

            createdByBlix()

            expect(addReduxModule.createIndex).toBeCalled()
            expect(addReduxModule.createScripts).toBeCalled()
        })
    })

    describe('createFilesWithRouter', () => {
        it('calls helpers.yarn', () => {
            helpers.yarn.mockResolvedValue(true)

            createFilesWithRouter()

            expect(helpers.yarn).toBeCalled()
        })

        it('calls redux', async () => {
            helpers.yarn.mockResolvedValueOnce(true)
            addReduxModule.redux = jest.fn()

            await createFilesWithRouter()

            expect(addReduxModule.redux).toBeCalled()
        })

        it('calls createReactApp if src/App.js exists and there is no src/components folder', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
            addReduxModule.createReactApp = jest.fn()

            await createFilesWithRouter()

            expect(addReduxModule.createReactApp).toBeCalled()
        })

        it('calls createdByBlix if src/App/App.js exists', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                
            addReduxModule.createdByBlix = jest.fn()

            await createFilesWithRouter()

            expect(addReduxModule.createdByBlix).toBeCalled()
        })

        it('calls createdByBlix if src/App/App.js doesn\'t exist but src/components and src/views do exist', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true) 
                
            addReduxModule.createdByBlix = jest.fn()

            await createFilesWithRouter()

            expect(addReduxModule.createdByBlix).toBeCalled()
        })

        it('logs information if it cant determine what type of project it is', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
            console.log = jest.fn()                

            await createFilesWithRouter()

            expect(console.log).toBeCalledWith("This doesn't seem to have been created by create-react-app or blix. We're not sure how to handle this so to be safe we won't modify anything.")
        })

        it('installsDependencies', async () => {
            await createFilesWithRouter()

            expect(helpers.installDependenciesToExistingProject).toBeCalledWith('redux react-redux react-router-dom')
        })
    })

    describe('dontAddReactRouter', () => {
        it('calls helpers.yarn', async () => {
            helpers.yarn.mockResolvedValueOnce(true)

            dontAddReactRouter()

            expect(helpers.yarn).toBeCalled()
        })

        it('calls redux', async () => {
            addReduxModule.redux = jest.fn()
            
            await dontAddReactRouter()

            expect(addReduxModule.redux).toBeCalled()
        })

        it('calls reactRouterCreatedByBlix and createScripts if src/compoents and src/views exist', async () => {
            addReduxModule.reactRouterCreatedByBlix = jest.fn() 
            addReduxModule.createScripts = jest.fn()

            fs.existsSync = jest.fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            
            await dontAddReactRouter()

            expect(addReduxModule.reactRouterCreatedByBlix).toBeCalled()
            expect(addReduxModule.createScripts).toBeCalled()
        })

        it('creates an App container and overwrites src/index.js if src/App/App.js exists', async () => {
            addReduxModule.createContainer = jest.fn().mockReturnValueOnce('')
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
        
            await dontAddReactRouter() 

            expect(addReduxModule.createContainer).toBeCalledWith('App')
            expect(helpers.writeFile).toBeCalledWith('src/App/AppContainer.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/index.js', expect.any(String))
        })

        it('creates an App container and overwrites src/index.js if src/App.js exists', async () => {
            addReduxModule.createContainer = jest.fn().mockReturnValueOnce('')
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
        
            await dontAddReactRouter()

            expect(addReduxModule.createContainer).toBeCalledWith('App')
            expect(helpers.writeFile).toBeCalledWith('src/AppContainer.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('src/index.js', expect.any(String))
        })

        it('installs dependencies', async () => {
            await dontAddReactRouter()

            expect(helpers.installDependenciesToExistingProject).toBeCalledWith('react-redux redux')
        })
    })

    describe('addRedux', () => {

    })
})