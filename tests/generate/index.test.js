jest.mock('../../helpers')
jest.mock('fs', () => ({
    existsSync: jest.fn()
}))

jest.mock('child_process')

let helpers = require('../../helpers')
let chalk = require('chalk')
let fs = require('fs')
let child_process = require('child_process')
const {
    generate,
    scriptNotFound
} = require('../../generate')

const generateModule = require('../../generate')


describe('generate tests', () => {
    beforeAll(() => {
        process.exit = jest.fn()
    })

    describe('generate function', () => {
        it('exits if no package.json exists', () => {
            console.error = jest.fn()
            console.log = jest.fn()
            fs.existsSync.mockReturnValueOnce(false)

            generate()

            expect(console.error).toBeCalledWith(chalk.red`Unable to find package.json. Are you in a project`)
            expect(process.exit).toBeCalledWith(1)
        })

        it('calls scriptNotFound with true if there is no additional argv', () => {
            process.argv = []
            generateModule.scriptNotFound = jest.fn()
            fs.existsSync.mockReturnValueOnce(true)
            console.log = jest.fn()

            generate()

            expect(process.argv[3]).toEqual(undefined)
            expect(generateModule.scriptNotFound).toBeCalledWith(true)
        })

        it('executes with yarn if yarn.lock exists and script is in package.json', () => {
            console.log = jest.fn()
            child_process.execSync.mockImplementation(() => true)
            fs.existsSync.mockReturnValue(true)
            helpers.checkIfScriptIsTaken.mockReturnValue(true)

            generate('component')

            expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn component ')
        })

        it('executes with npm if no yarn.lock exists and script is in package.json', () => {
            console.log = jest.fn()
            child_process.execSync.mockImplementation(() => true)
            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
            helpers.checkIfScriptIsTaken.mockReturnValue(true)

            generate('component')

            expect(child_process.execSync.mock.calls[0][0]).toEqual('npm run component ')
        })

        it('executes with additional process args the user passed', () => {
            console.log = jest.fn()
            child_process.execSync.mockImplementation(() => true)
            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            helpers.checkIfScriptIsTaken.mockReturnValue(true)

            generate('model', ['User', 'email:String', 'age:Number'])

            expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn model User email:String age:Number') 
        })

        it('logs an error if something goes wrong', () => {
            console.log = jest.fn()
            console.error = jest.fn()
            child_process.execSync.mockImplementation(() => { throw 'Error' })
            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            helpers.checkIfScriptIsTaken.mockReturnValue(true)

            generate('view')

            expect(console.error).toBeCalledTimes(2)
            expect(console.error).toBeCalledWith('Error')
        })

        it('calls scriptNotFound if script isn\'t inside the possibleScripts', () => {
            console.log = jest.fn()
            process.argv = ['node', 'blix', 'g', 'node']
            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)

            generate()

            expect(generateModule.scriptNotFound).toBeCalled()
        })

        it('calls scriptNotFound if the script doesn\'t exist in the package.json', () => {
            console.log = jest.fn()
            process.argv = ['node', 'blix', 'g', 'view']
            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
            helpers.checkIfScriptIsTaken.mockReturnValue(false)

            generate()

            expect(generateModule.scriptNotFound).toBeCalled()
        })
    })

    describe('scriptNotFound function', () => {
        it('console logs that no command was entered if the user didn\'t put another process.argv after blix g or blix generate', () => {
            console.log = jest.fn()

            scriptNotFound(true)

            expect(console.log).toBeCalledWith(chalk.red`No command type entered.`)
        })

        it('console logs that the command attempted doesn\'t exist', () => {
            console.log = jest.fn()

            scriptNotFound() 

            expect(console.log).toBeCalledWith(chalk.red`It seems you're trying to run a command that doesn't exist.`)
           
        })

        it('checks the package json for each possible script and logs it if it exists', () => {
            console.log = jest.fn()
            helpers.checkIfScriptIsTaken
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
            
            scriptNotFound()
            expect(console.log.mock.calls[1][0]).toContain(`Try: ` + chalk.green`blix generate ` + chalk`{cyan component}`)
            expect(console.log.mock.calls[2][0]).toContain(`Try: ` + chalk.green`blix generate ` + chalk`{cyan model}`) 
        })

        it('exits', () => {
            console.log = jest.fn()
            scriptNotFound()

            expect(console.log).toBeCalledWith('Please try again.')
            expect(process.exit).toBeCalled()
        })
    })
})