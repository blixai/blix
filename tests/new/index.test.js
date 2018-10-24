jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}))

jest.mock('inquirer', () => ({
    prompt: jest.fn()
  }))

jest.mock('../../new/backend.js')
jest.mock('../../new/react.js')
jest.mock('../../new/backend.js')

jest.mock('../../helpers')

let {
    promptPreset,
    promptFrontend,
    reactProject,
    vueProject,
    vanillaJSProject,
    backendOnly,
    promptForName,
    createProject
} = require('../../new')

let fs = require('fs')

let helpers = require('../../helpers')

let inquirer = require('inquirer')

const store = require('../../new/store')

let resetStore = () => {
    store.name = ''
    store.frontend = ''
    store.backend = ''
    store.backendType = ''
    store.database = ''
    store.serverTesting = ''
    store.e2e = ''
    store.reactTesting = ''
    store.vueTesting = ''
    store.reactType = ''
    store.dependencies = ''
    store.devDependencies = ''
    store.useYarn = ''
    store.reactCSS = ''
    store.linter = '' 
}

describe('new/index.js', () => {
    beforeEach(() => {
        resetStore()
    })


    describe('promptPreset', () => {
        beforeEach(() => {
            resetStore()
        })

        it('prompts for a preset', async () => {
            inquirer.prompt.mockResolvedValue({preset: ''})

            await promptPreset()

            expect(inquirer.prompt).toBeCalled()
        })

        it('if preset is react-default set store values to react, redux, react router, with express and mongoose/mongo project', async () => {
            inquirer.prompt.mockResolvedValue({preset: 'react-default'})      

            await promptPreset()

            expect(inquirer.prompt).toBeCalled()
            expect(store.reactType).toEqual('reactRouter-redux')
            expect(store.reactTesting).toEqual({ enzyme: true})
            expect(store.e2e).toEqual('None')
            expect(store.backend).toEqual({ backend: true })
            expect(store.serverTesting).toEqual('jest')
            expect(store.database).toEqual('mongo')
        })

        it('prompts for yarn if yarn available', async () => {
            helpers.yarn = jest.fn()
            helpers.canUseYarn.mockResolvedValue(true)
            inquirer.prompt.mockResolvedValue({preset: 'react-default'})

            await promptPreset()

            expect(helpers.yarn).toBeCalled()
        })

        it('if manual config option selected prompt for frontend option', async () => {
            inquirer.prompt.mockResolvedValue({ preset: 'manual' })         
            let { frontendOptions } = require('../../new/prompts')
            await promptPreset()

            expect(inquirer.prompt.mock.calls[1][0]).toContain(frontendOptions)
        })
    })

    describe.skip('promptFrontend', () => {
        
    })

    describe.skip('reactProject', () => {
        
    })

    describe.skip('vueProject', () => {
        
    })

    describe.skip('vanillaJSProject', () => {
        
    })

    describe.skip('backendOnly', () => {
        
    })

    describe.skip('promptForName', () => {
        
    })

    describe.skip('createProject', () => {
        
    })
})
