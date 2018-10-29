jest.mock('fs')
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))
jest.mock('glob')
jest.mock('../../../helpers')


let fs = require('fs')
let glob = require('glob')
let inquirer = require('inquirer')
let helpers = require('../../../helpers')

const {
    fileChecks,
    webpack,
    reactQuestion,
    createConfig
} = require('../../../add/webpack/addWebpack')

describe('addWebpack', () => {
    describe('function fileChecks', () => {
        it('exits if a webpack config file already exists', async () => {
            fs.existsSync = jest.fn().mockReturnValueOnce(true)
            console.error = jest.fn()
            process.exit = jest.fn()

            await fileChecks()

            expect(console.error).toBeCalledWith('Webpack config file already exists')
            expect(process.exit).toBeCalledWith(1)
        })

        it('prompts if no package.json file found', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
            inquirer.prompt.mockResolvedValue(true)

            await fileChecks()

            expect(inquirer.prompt).toBeCalled()
        })

        it('exits if no package.json file found and user selects to exit', async () => {
            fs.existsSync = jest.fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
            inquirer.prompt.mockResolvedValue(false)
            process.exit = jest.fn()

            await fileChecks()

            expect(inquirer.prompt).toBeCalled()
            expect(process.exit).toBeCalled()
        })
    })

    describe.skip('function webpack', () => {
        it('', () => {

        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })
    })

    describe.skip('function reactQuestion', () => {
        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })
    })

    describe.skip('function createConfig', () => {
        it('', () => {
            
        })
        
        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })

        it('', () => {
            
        })
    })
})