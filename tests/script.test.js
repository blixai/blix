jest.mock('../helpers')
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))


const {
    scripts,
    addAction,
    addModel,
    addReact,
    addRedux,
    addClientView,
    checkReactTemplatesExist,
    addController,
    createNewScript
} = require('../scripts/script')

const scriptsModule = require('../scripts/script')
let inquirer = require('inquirer')
const helpers = require('../helpers')

describe('scripts', () => {
    beforeAll(() => {
        console.log = jest.fn()
        console.clear = jest.fn()
    })

    describe('scripts', () => {
        it('clears the console', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'react' })
            console.clear = jest.fn()

            await scripts()

            expect(console.clear).toBeCalled()
        })

        it('calls addReact when react is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'react' })
            scriptsModule.addReact = jest.fn()

            await scripts()

            expect(scriptsModule.addReact).toBeCalled()
        })

        it('calls addRedux when redux is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'redux' })
            scriptsModule.addRedux = jest.fn()

            await scripts()

            expect(scriptsModule.addRedux).toBeCalled() 
        })

        it('calls addController when controller is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'controller' })
            scriptsModule.addController = jest.fn()

            await scripts()

            expect(scriptsModule.addController).toBeCalled()  
        })

        it('calls addModel when model is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'model' })
            scriptsModule.addModel = jest.fn()

            await scripts()

            expect(scriptsModule.addModel).toBeCalled()  
        })

        it('calls addAction when action is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'action' })
            scriptsModule.addAction = jest.fn()

            await scripts()

            expect(scriptsModule.addAction).toBeCalled()  
        })

        it('calls addClientView when view is selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ commands: 'view' })
            scriptsModule.addClientView= jest.fn()

            await scripts()

            expect(scriptsModule.addClientView).toBeCalled()
        })

        it('calls createNewScript when custom is selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ commands: 'custom' })
                .mockResolvedValueOnce({ custom: 'someScript' })
            scriptsModule.createNewScript = jest.fn()

            await scripts()

            expect(inquirer.prompt).toBeCalledTimes(2)
            expect(scriptsModule.createNewScript).toBeCalledWith('someScript') 
        })

    })

    describe('addAction', () => {
        it('adds script to package json and calls helper to ensure the scripts folder exists', () => {
            addAction()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('action', 'node scripts/action.js')
            expect(helpers.checkScriptsFolderExist).toBeCalled()
        })

        it('writes a script and two template files', () => {
            addAction()

            expect(helpers.writeFile).toBeCalledWith('scripts/action.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/action.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/reducer.js', expect.any(String))
        })

        it('console logs how to use the script and what to expect', () => {
            addAction()

            expect(console.log).toBeCalledTimes(7)
            expect(console.log).toBeCalledWith('Added script to project, to run: npm run action')
        })

    })

    describe('addModel', () => {
        it('adds script to package.json, calls helper to ensure scripts folder exists, and prompts for type of model to add', async () => {
            inquirer.prompt.mockResolvedValueOnce({ model: '' })
            await addModel()

            expect(inquirer.prompt).toBeCalled()
            expect(helpers.addScriptToPackageJSON).toBeCalled()
            expect(helpers.checkScriptsFolderExist).toBeCalled()
        })

        it('if mongoose selected: writes a mongoose model and template file', async () => {
            inquirer.prompt.mockResolvedValueOnce({ model: 'm' })
            await addModel()

            expect(helpers.writeFile).toBeCalledWith('scripts/model.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/schemaTemplate.js', expect.any(String))
        })

        it('if mongoose selected: console logs script instructions if selected', async () => {
            inquirer.prompt.mockResolvedValueOnce({ model: 'm' })
            await addModel()

            expect(console.log).toBeCalledTimes(5)
        })

        it('if bookshelf selected: creates a model script, bookshelf model template, knex migration template and adds bookshelf config to the project', async () => {
            inquirer.prompt.mockResolvedValueOnce({ model: 'b' })
            await addModel()

            expect(helpers.writeFile).toBeCalledWith('scripts/model.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/bookshelf.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/migration.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('server/models/bookshelf.js', expect.any(String))
        })

        it('if bookshelf selected: console logs script instructions', async () => {
            inquirer.prompt.mockResolvedValueOnce({ model: 'b' })
            await addModel()

            expect(console.log).toBeCalledTimes(5) 
        })
    })

    describe('addReact', () => {
        it('adds script to package json and checks that the scripts folder exists', () => {
            addReact()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('component', 'node scripts/component.js')
            expect(helpers.checkScriptsFolderExist).toBeCalled()
        })

        it('scripts a react script and calls checkReactTemplatesExist', () => {
            scriptsModule.checkReactTemplatesExist = jest.fn()

            addReact()

            expect(helpers.writeFile).toBeCalledWith('scripts/component.js', expect.any(String))
            expect(scriptsModule.checkReactTemplatesExist).toBeCalled()
        })

        it('logs how to run the react script', () => {
            addReact()

            expect(console.log).toBeCalledTimes(3)
        })
    })

    describe('addRedux', () => {
        it('adds script to package json and checks that the scripts folder exists', () => {
            addRedux()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('component', 'node scripts/component.js')
            expect(helpers.checkScriptsFolderExist).toBeCalled()
        })

        it('scripts a redux component script and calls checkReactTemplatesExist', () => {
            scriptsModule.checkReactTemplatesExist = jest.fn()

            addRedux()

            expect(helpers.writeFile).toBeCalledWith('scripts/component.js', expect.any(String))
            expect(helpers.writeFile).toBeCalledWith('scripts/templates/container.js', expect.any(String))
            expect(scriptsModule.checkReactTemplatesExist).toBeCalled()
        })

        it('logs how to run the react script', () => {
            addRedux()

            expect(console.log).toBeCalledTimes(3)
        })
    })

    describe('addClientView', () => {

        it('adds script to package json, checks scripts folder exists, and calls checkReactTemplatesExist', () => {
            scriptsModule.checkReactTemplatesExist = jest.fn()

            addClientView()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('view', 'node scripts/view.js')  
            expect(helpers.checkScriptsFolderExist).toBeCalled()
            expect(scriptsModule.checkReactTemplatesExist).toBeCalled()
        })

        it('if src/store exists assume user is using redux and use redux + react-router view script', () => {

        })

        it('if src/store doesn\'t exist use react-router view script', () => {

        })
    })

    describe('checkReactTemplatesExist', () => {

    })

    describe('createNewScript', () => {

    })
})