jest.mock('../../helpers')

const {
    selected,
    getOptions,
    readMeFormatter,
    consoleFormatter,
    addProjectInstructions
} = require('../../add/addProjectInstructions')

const addProjectInstructionsModule = require('../../add/addProjectInstructions')

const store = require('../new/store')
const { options } = require('../new/utils/newProjectInstructions')
const helpers = require('../../helpers')
const chalk = require('chalk')

describe('addProjectInstructions', () => {
    beforeEach(() => {
        selected.length = 0
    })

    describe('getOptions', () => {
        it('pushes into the selected array react-router options', () => {
           store.reactType = 'react-router'
           getOptions()

           expect(selected).toContain(options.reactRouterComponent)
           expect(selected).toContain(options.view)
        })

        it('pushes into the selected array redux options', () => {
           store.reactType = 'redux' 

            getOptions()

            expect(selected).toContain(options.reduxComponent)
            expect(selected).toContain(options.action)
        })

        it('pushes into the selected array options for reactRouter-redux', () => {
            store.reactType = 'reactRouter-redux'

            getOptions()

            expect(selected).toContain(options.reactRouterReduxComponent)
            expect(selected).toContain(options.view)
            expect(selected).toContain(options.action)
        })

        it('pushes a controller option into selected array if ANY backend is selected', () => {
            store.backendType = true

            getOptions()

            expect(selected).toContain(options.controller)
        })

        it('pushes database options into selected array for mongo if mongo is selected', () => {
            store.database = { database: 'mongo' }

            getOptions()

            expect(selected).toContain(options.mongooseModel)
        })

        it('pushes into the selected array if postgres is selected', () => {
            store.database = { database: 'pg' }

            getOptions()

            expect(selected).toContain(options.postgresModel)
        })
    })

    describe('readMeFormatter', () => {
        it('inserts the output string into the README', () => {
            jest.spyOn(helpers, 'insert');
            store.reactType = ''
            store.backendType = true
            store.database = ''
            getOptions() // must call this to have selected to iterate over

            readMeFormatter()

            expect(helpers.insert).toBeCalledWith('README.md', expect.any(String), '## Project Scripts')
        })

        it('formats options', () => {
            store.backend = true
            getOptions() // must call this to have selected to iterate over

            readMeFormatter()

            expect(helpers.insert.mock.calls[0][1]).toEqual('controller || example: blix generate controller <name> || use: Quickly create api/v1 get|post|put|delete endpoints for a resource\n')
        })
    })

    describe('console formatter', () => {
        console.log = jest.fn()
        store.backendType = true
        getOptions()

        consoleFormatter()

        expect(console.log).toBeCalledWith('\n  ' + chalk`{cyan  ${options.controller.example} }` + `\n\t${options.controller.use}`)
    })

    describe('addProjectInstructions', () => {

        it('clears the console', () => {
            console.clear = jest.fn()

            addProjectInstructions()

            expect(console.clear).toBeCalled()
        })

        it('calls getOptions, readMeFormatter, and consoleFormatter', () => {
            addProjectInstructionsModule.getOptions = jest.fn()
            addProjectInstructionsModule.readMeFormatter = jest.fn()
            addProjectInstructionsModule.consoleFormatter = jest.fn()

            addProjectInstructions()

            expect(addProjectInstructionsModule.getOptions).toBeCalled()
            expect(addProjectInstructionsModule.readMeFormatter).toBeCalled()
            expect(addProjectInstructionsModule.consoleFormatter).toBeCalled()
        })
    })
})