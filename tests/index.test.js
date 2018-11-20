jest.mock('../helpers')
jest.mock('../new')
jest.mock('../help/help')
jest.mock('../scripts/script')
jest.mock('../add/add')
jest.mock('../generate')

const { createProject } = require('../new')
const help = require('../help/help')
const { scripts } = require('../scripts/script')
const add = require('../add/add')
const { generate } = require('../generate')

const {
    checkCommand,
    checkVersion,
    noCommand
} = require('../')

const indexModule = require('../')

describe('index.js root file tests', () => {

    describe('checkCommand', () => {
        beforeEach(() => {
            process.argv[2] = ''
        })

        it('calls create project if command is "new"', () => {
            process.argv[2] = 'new'
            checkCommand()

            expect(createProject).toBeCalled()
        })

        it('calls help if command is help', () => {
            process.argv[2] = 'help'
            checkCommand()

            expect(help).toBeCalled()
        })

        it('calls scripts if command is scripts', () => {
            process.argv[2] = 'scripts'
            checkCommand()

            expect(scripts).toBeCalled()
        })

        it('calls add if commmand is add', () => {
            process.argv[2] = 'add'
            checkCommand()

            expect(add).toBeCalled()
        })

        it('calls generate if command is generate or g', () => {
            process.argv[2] = 'generate'
            checkCommand()

            expect(generate).toBeCalled()

            process.argv[2] = 'g'
            checkCommand()

            expect(generate).toBeCalledTimes(2)
        })

        it('calls checkVersion if command is version or alias -v', () => {
            process.argv[2] = 'version'
            indexModule.checkVersion = jest.fn()

            checkCommand()

            expect(indexModule.checkVersion).toBeCalled()

            process.argv[2] = '-v'

            checkCommand()

            expect(indexModule.checkVersion).toBeCalledTimes(2)
        })

        it('calls noCommand if no command is given or if no valid command given', () => {
            indexModule.noCommand = jest.fn()

            checkCommand()

            expect(indexModule.noCommand).toBeCalled()
        })
    })

    describe('checkVersion', () => {
        it('checks the current installation of Blix\'s package.json version and console.logs it', () => {
            console.log = jest.fn()

            checkVersion()

            expect(console.log).toBeCalled()
        })
    })

    describe('noCommand', () => {
        it('console.logs a list of the current Blix commands and aliases', () => {
            console.log = jest.fn()

            noCommand()

            expect(console.log).toBeCalledWith('new')
            expect(console.log).toBeCalledWith('add')
            expect(console.log).toBeCalledWith('scripts') 
            expect(console.log).toBeCalledWith('generate | g')
            expect(console.log).toBeCalledWith('version | -v')
            expect(console.log).toBeCalledWith('help')
        })
    })
})