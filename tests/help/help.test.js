jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))

let inquirer = require('inquirer')

let help = require('../../help/help')

const { helpCommands } = require('../../new/prompts')

describe(('help.js'), () => {

    it('clears the console', () => {
        inquirer.prompt.mockResolvedValueOnce({ help: '' })
        console.clear = jest.fn()

        help()

        expect(console.clear).toBeCalled()
    })

    it('prompts with a list of possible commands', () => {
        inquirer.prompt.mockResolvedValueOnce({ help: '' })
        help()

        expect(inquirer.prompt).toBeCalledWith([helpCommands])
    })

    it('logs instructions if new selected', async () => {
        const mock = console.log = jest.fn()
        inquirer.prompt.mockResolvedValue({ help: 'new' })

        await help()
        expect(mock).toBeCalledTimes(2)
        expect(mock).toBeCalledWith('Try it: blix new <name>')
    })

    it('logs instructions if add selected', async () => {
        const mock = console.log = jest.fn()
        inquirer.prompt.mockResolvedValue({ help: 'add' })

        await help()
        expect(mock).toBeCalledTimes(2)
        expect(mock).toBeCalledWith('Try it: blix add')
    })

    it('logs instructions if scripts selected', async () => {
        const mock = console.log = jest.fn()
        inquirer.prompt.mockResolvedValue({ help: 'scripts' })

        await help()
        expect(mock).toBeCalledTimes(2)
        expect(mock).toBeCalledWith('Try it: blix scripts')
    })

    it('logs instructions if generate selected', async () => {
        const mock = console.log = jest.fn()
        inquirer.prompt.mockResolvedValue({ help: 'generate' })

        await help()
        expect(mock).toBeCalledTimes(2)
        expect(mock).toBeCalledWith('Try it: blix g <command>')

    })
})