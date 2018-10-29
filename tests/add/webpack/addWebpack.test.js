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

const addWebpackModule = require('../../../add/webpack/addWebpack')

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

    describe('function webpack', () => {
        it('awaits fileChecks function', async () => {
            addWebpackModule.fileChecks = jest.fn().mockResolvedValueOnce()
            addWebpackModule.reactQuestion = jest.fn()

            await webpack()

            expect(addWebpackModule.fileChecks).toBeCalled()
        })

        it('reads all js files from the project', async () => {
            addWebpackModule.fileChecks = jest.fn().mockResolvedValueOnce()
            addWebpackModule.reactQuestion = jest.fn()

            await webpack()

            expect(glob.sync).toBeCalled()
        })

        it('prompts the user to select an entry point ', async () => {
            addWebpackModule.fileChecks = jest.fn().mockResolvedValueOnce()
            addWebpackModule.reactQuestion = jest.fn()
            glob.sync = jest.fn().mockReturnValueOnce(['src/index.js', 'src/App.js'])

            await webpack()

            expect(inquirer.prompt).toBeCalledWith([{"choices": ["src/index.js", "src/App.js"], "message": "Select the source file:", "name": "src", "type": "list"}])
        })

        it('prompts the user for a place to put the bundled files', async () => {
            addWebpackModule.fileChecks = jest.fn().mockResolvedValueOnce()
            addWebpackModule.reactQuestion = jest.fn()
            glob.sync = jest.fn().mockReturnValueOnce(['src/index.js', 'src/App.js'])

            await webpack()

            expect(inquirer.prompt).toBeCalledWith([{"choices": ["src/index.js", "src/App.js"], "message": "Select the source file:", "name": "src", "type": "list"}])    
            expect(inquirer.prompt).toBeCalledWith([{"message": "What directory should contain the output bundle:", "name": "output", "type": "input"}])

        })

        it('calls reactQuestion with the entry point and output file answers', async () => {
            addWebpackModule.fileChecks = jest.fn().mockResolvedValueOnce()
            addWebpackModule.reactQuestion = jest.fn()
            glob.sync = jest.fn().mockReturnValueOnce(['src/index.js', 'src/App.js'])
            inquirer.prompt
                .mockResolvedValueOnce({ src: 'src/index.js' })
                .mockResolvedValueOnce({ output: 'dist' })

            await webpack()

            expect(addWebpackModule.reactQuestion).toBeCalledWith('./src/index.js', 'dist') 
        })
    })

    describe('function reactQuestion', () => {
        it('prompts if the user intends to use react', async () => {
            addWebpackModule.createConfig = jest.fn()

            await reactQuestion()

            expect(inquirer.prompt).toBeCalled()
        })

        it('calls helpers yarn', async () => {
            addWebpackModule.createConfig = jest.fn()
            helpers.yarn = jest.fn()

            await reactQuestion()

            expect(helpers.yarn).toBeCalled()
        })

        it('calls createConfig with the entry point, output, and react boolean', async () => {
            addWebpackModule.createConfig = jest.fn()
            inquirer.prompt.mockResolvedValueOnce({ react: true })

            await reactQuestion('src/index.js', 'dist') 

            expect(addWebpackModule.createConfig).toBeCalledWith('src/index.js', 'dist', true)
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