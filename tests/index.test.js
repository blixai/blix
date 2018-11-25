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
// const indexModule = require('../')

describe.skip('index.js root file tests', () => {

    beforeEach(() => {
        process.argv[2] = ''
    })

    it('calls create project if command is "new"', () => {
        process.argv[2] = 'new'

        require('../')

        expect(createProject).toBeCalled()
    })

    it('calls help if command is help', () => {
        process.argv[2] = 'help'
        require('../')

        expect(help).toBeCalled()
    })

    it('calls scripts if command is scripts', () => {
        process.argv[2] = 'scripts'
        require('../')

        expect(scripts).toBeCalled()
    })

    it('calls add if commmand is add', () => {
        process.argv[2] = 'add'
        require('../')

        expect(add).toBeCalled()
    })

    it('calls generate if command is generate or g', () => {
        process.argv[2] = 'generate'
        require('../')

        expect(generate).toBeCalled()

        process.argv[2] = 'g'
        require('../')

        expect(generate).toBeCalledTimes(2)
    })

    it.skip('calls checkVersion if command is version or alias -v', () => {
        process.argv[2] = 'version'

        expect(indexModule.checkVersion).toBeCalled()

        process.argv[2] = '-v'

        require('../')

        expect(indexModule.checkVersion).toBeCalledTimes(2)
    })

    it.skip('calls noCommand if no command is given or if no valid command given', () => {
        require('../')

        expect(indexModule.noCommand).toBeCalled()
    })
})
