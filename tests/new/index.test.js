jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}))

jest.mock('inquirer', () => ({
    prompt: jest.fn()
  }))

jest.mock('../../new/backend.js', () => ({
    createBackend: jest.fn()
}))


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

const { 
    namePrompt,
    defaultOrCustom,
    frontendOptions,
    backend,
    database,
    serverTesting,
    e2e,
    reactTesting,
    vueTesting,
    reactCSS,
    linterPrompt
} = require('../../new/prompts')

let backendModule = require('../../new/backend')

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

    describe('promptPreset', () => {
        beforeEach(() => {
            // resetStore()
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
            inquirer.prompt.mockResolvedValue({preset: 'react-default'})    
            helpers.yarn = jest.fn()
            helpers.canUseYarn.mockResolvedValue(true)
            inquirer.prompt.mockResolvedValueOnce({preset: 'react-default'})

            await promptPreset()

            expect(helpers.yarn).toBeCalled()
        })

        it('if manual config option selected prompt for frontend option', async () => {
            inquirer.prompt.mockResolvedValue({ preset: 'manual' })   

            await promptPreset()

            expect(inquirer.prompt.mock.calls[1][0]).toContain(frontendOptions)
        })
    })

    describe('promptFrontend', () => {

        it('prompts for a frontend type', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: '' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
        })
        
        it('calls reactProject if react frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'react' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('react')
        })
        

        it('calls reactProject if react-router frontend selected', async () => {
            inquirer.prompt
            .mockResolvedValueOnce({ frontend: 'react-router' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('react-router') 
            })
        

        it('calls reactProject if redux frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'redux' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('redux')
        })

        it('calls reactProject if reactRouter-redux frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'reactRouter-redux' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('reactRouter-redux')
        })

        it('calls backendOnly if no frontend is selected', async () => {
            helpers.yarn.mockResolvedValueOnce({ yarn: true })
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'none' })
                .mockResolvedValueOnce({ linter: 'eslint' })
                .mockResolvedValueOnce({ server: 'mocha' })
                .mockResolvedValueOnce({ database: 'mongo' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.backendType).toEqual('api')
        })
        
    })

    describe('reactProject', () => {
       it('', async () => {

       }) 


       it('', async () => {
           
        }) 

        it('', async () => {
            
        }) 

        it('', async () => {
            
        }) 
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