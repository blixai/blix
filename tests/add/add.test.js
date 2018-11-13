jest.mock('../../helpers')
jest.mock('fs')
jest.mock('../../add/webpack/addWebpack')
jest.mock('../../add/webpack/addWebpackDevServer')
jest.mock('../../add/backend/addBackend')
jest.mock('../../add/database/addDataBase')
jest.mock('../../add/react-router/addReactRouter')
jest.mock('../../add/redux/addRedux')
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))

const inquirer = require('inquirer')
const fs = require('fs')

const { webpack } = require('../../add/webpack/addWebpack')
const addWebpackDevServer = require('../../add/webpack/addWebpackDevServer')
const { addBackend } = require('../../add/backend/addBackend')
const addDatabase = require('../../add/database/addDataBase')
const { addReactRouter } = require('../../add/react-router/addReactRouter')
const { addRedux } = require('../../add/redux/addRedux')
const chalk = require('chalk')
const add = require('../../add/add')


describe('add.js', () => {
    it('checks if package.json exists and exits with an error if it doesn\'t', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: '' })
        console.error = jest.fn()
        process.exit = jest.fn()
        fs.existsSync = jest.fn().mockReturnValueOnce(false)

        await add()

        expect(process.exit).toBeCalledWith(1)
        expect(console.error).toBeCalledWith(chalk.red`Not inside a project. If you're starting a new project use the blix new command.`)
    })

    it('clears the console if package.json found', async () => {
        console.clear = jest.fn()
        inquirer.prompt.mockResolvedValueOnce({ command: '' })

        await add()

        expect(console.clear).toBeCalled()
    })

    it('calls webpack if ', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'webpack' })

        await add()

        expect(webpack).toBeCalled()
    })

    it('calls addWebpackDevServer if webpack-dev-server is selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'webpack-dev-server' })

        await add()

        expect(addWebpackDevServer).toBeCalled()
    })

    it('calls addReactRouter if selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'react-router' })

        await add()

        expect(addReactRouter).toBeCalled() 
    })

    it('calls addRedux if selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'redux' })

        await add()

        expect(addRedux).toBeCalled() 
    })

    it('calls addDatabase if selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'database' })

        await add()

        expect(addDatabase).toBeCalled() 
    })

    it('calls addBackend if selected', async () => {
        inquirer.prompt.mockResolvedValueOnce({ command: 'backend' })

        await add()

        expect(addBackend).toBeCalled() 
    })
})
