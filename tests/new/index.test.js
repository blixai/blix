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


jest.mock('../../new/react.js', () => ({
    react: jest.fn()
}))

const { react } = require('../../new/react')

jest.mock('../../new/backend.js')

jest.mock('../../helpers')

const {
    promptPreset,
    promptFrontend,
    reactProject,
    backendOnly,
    promptForName,
    createProject
} = require('../../new')

let newModule = require('../../new')

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

        it('prompts for a preset', async () => {
            jest.spyOn(newModule, 'promptFrontend')
            inquirer.prompt.mockResolvedValue({preset: ''}).mockResolvedValueOnce({ frontend: '' })

            await promptPreset()

            expect(inquirer.prompt).toBeCalled()
            expect(newModule.promptFrontend).toBeCalled()
        })

        it('if preset is react-default set store values to react, redux, react router, with express and mongoose/mongo project', async () => {
            inquirer.prompt.mockResolvedValueOnce({preset: 'react-default'})      
            helpers.yarn = jest.fn()

            await promptPreset()

            expect(inquirer.prompt).toBeCalled()
            expect(store.reactType).toEqual('reactRouter-redux')
            expect(store.reactTesting).toEqual({ enzyme: true })
            expect(store.e2e).toEqual('None')
            expect(store.backend).toEqual({ backend: true })
            expect(store.serverTesting).toEqual('jest')
            expect(store.database).toEqual('mongo')
            expect(react).toBeCalled()
        })

        it('prompts for yarn if yarn available', async () => {
            inquirer.prompt.mockResolvedValueOnce({preset: 'react-default'})    
            helpers.yarn = jest.fn()
            helpers.canUseYarn.mockResolvedValueOnce(true)

            await promptPreset()

            expect(helpers.yarn).toBeCalled()
            expect(inquirer.prompt).toBeCalled()
        })

        it('if manual config option selected prompt for frontend option', async () => {
            inquirer.prompt.mockResolvedValue({ preset: 'manual' })
            const mock = newModule.promptFrontend = jest.fn()

            await promptPreset()

            expect(mock).toBeCalled()
        })
    })

    describe('promptFrontend', () => {

        it('prompts for a frontend type', async () => {

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
        })
        
        it('calls reactProject if react frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'react' })
            jest.spyOn(newModule, 'reactProject')

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('react')
            expect(newModule.reactProject).toBeCalledTimes(1)
        })
        

        it('calls reactProject if react-router frontend selected', async () => {
            inquirer.prompt
            .mockResolvedValueOnce({ frontend: 'react-router' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('react-router') 
            expect(newModule.reactProject).toBeCalledTimes(1)
        })
        

        it('calls reactProject if redux frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'redux' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('redux')
            expect(newModule.reactProject).toBeCalledTimes(1)
        })

        it('calls reactProject if reactRouter-redux frontend selected', async () => {
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'reactRouter-redux' })

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.reactType).toEqual('reactRouter-redux')
            expect(newModule.reactProject).toBeCalledTimes(1)
        })

        it('calls backendOnly if no frontend is selected', async () => {
            helpers.yarn.mockResolvedValueOnce({ yarn: true })
            inquirer.prompt
                .mockResolvedValueOnce({ frontend: 'none' })
            jest.spyOn(newModule, 'backendOnly')
            

            await promptFrontend()

            expect(inquirer.prompt).toBeCalled()
            expect(inquirer.prompt).toBeCalledWith([frontendOptions])
            expect(store.backendType).toEqual('api')
            expect(newModule.backendOnly).toBeCalledTimes(1)
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