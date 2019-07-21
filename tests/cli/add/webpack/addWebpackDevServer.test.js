jest.mock('../../../helpers')
jest.mock('glob', () => ({
    sync: jest.fn()
}))
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}))

const helpers = require('../../../helpers')
const inquirer = require('inquirer')
const glob = require('glob')

const addWebpackDevServer = require('../../../add/webpack/addWebpackDevServer')

describe('addWebpackDevServer', () => {
    it('reads the project folders', async () => {
        glob.sync.mockReturnValueOnce([])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 

        await addWebpackDevServer()

        expect(glob.sync).toBeCalled()
    })

    it('prompts the user with a list of project folders to output the dist to', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 

        await addWebpackDevServer()

        expect(inquirer.prompt).toBeCalledWith([{"choices": ["dist", "bundle"], "message": "What directory should contains the output bundle:", "name": "output", "type": "list"}])
    })

    it('calls yarn helper', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 

        await addWebpackDevServer()  

        expect(helpers.yarn).toBeCalled()
    })

    it('installs webpack-dev-server', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 

        await addWebpackDevServer()  

        expect(helpers.installDependencies).toBeCalledWith('webpack-dev-server', 'dev')
    })

    it('adds a start script of "dev" if server script is already taken', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 
        helpers.checkIfScriptIsTaken.mockReturnValueOnce(true)

        await addWebpackDevServer()  

        expect(helpers.addScriptToPackageJSON).toBeCalledWith('dev', "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'")
    })

    it('adds a start script of "dev:server" if server and dev scripts are already taken', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 
        helpers.checkIfScriptIsTaken.mockReturnValueOnce(true).mockResolvedValueOnce(true)

        await addWebpackDevServer()  

        expect(helpers.addScriptToPackageJSON).toBeCalledWith('dev:server',  "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'")
    })

    it('adds a start script of "server" if the server command isn\'t already taken', async () => {
        glob.sync.mockReturnValueOnce(['dist', 'bundle'])
        inquirer.prompt.mockResolvedValueOnce({ output: 'dist' }) 
        helpers.checkIfScriptIsTaken.mockReturnValueOnce(false)

        await addWebpackDevServer()  

        expect(helpers.addScriptToPackageJSON).toBeCalledWith('server',  "webpack-dev-server --output-public-path=/dist/ --inline --hot --open --port 3000 --mode='development'")
    })
})