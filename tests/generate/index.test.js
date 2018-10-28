jest.mock('../../helpers')
jest.mock('fs', () => ({
    existsSync: jest.fn()
}))

jest.mock('child_process', () => ({
    execSync: jest.fn()
}))

let helpers = require('../../helpers')
let chalk = require('chalk')
let fs = require('fs')
let child_process = require('child_process')
const {
    generate,
    noArg,
    scriptNotFound
} = require('../../generate')


describe('generate tests', () => {
    beforeAll(() => {
        process.exit = jest.fn()
        console.log = jest.fn()
    })

    describe('generate function', () => {

    })

    describe('noArg function', () => {

    })

    describe('scriptNotFound function', () => {
        it('console logs that the command attempted doesn\'t exist', () => {
           scriptNotFound() 

           expect(console.log).toBeCalledWith(chalk.red`It seems you're trying to run a command that doesn't exist.`)
           
        })

        it('checks the package json for each possible script and logs it if it exists', () => {
            helpers.checkIfScriptIsTaken
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
            
            scriptNotFound()
            expect(console.log.mock.calls[1][0]).toContain(`Try: ` + chalk.green`blix generate ` + chalk`{cyan component}`)
            expect(console.log.mock.calls[2][0]).toContain(`Try: ` + chalk.green`blix generate ` + chalk`{cyan model}`) 
        })

        it('exits', () => {
            scriptNotFound()

            expect(console.log).toBeCalledWith('Please try again.')
            expect(process.exit).toBeCalled()
        })
    })
})