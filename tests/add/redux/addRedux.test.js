jest.mock('fs')
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

            expect(helpers.writeFile).toBeCalled()

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
        

    })
    describe('createContainer', () => {

    })

    describe('createScripts', () => {

    })

    describe('createReactApp', () => {
        
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