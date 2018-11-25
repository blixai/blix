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
    createConfig,
    addScripts
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

    describe('function createConfig', () => {
        it('if react was selected create a reactBabel file and add webpack react loaders', async () => {
            fs.readFileSync = jest.fn()
                .mockReturnValueOnce('webpack')

            await createConfig('', '', true)

            expect(fs.readFileSync.mock.calls[1][0]).toContain('reactBabel')
            expect(helpers.addDependenciesToStore).toBeCalledWith('react react-dom')
            expect(helpers.addDependenciesToStore).toBeCalledWith( "webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli @babel/preset-react", 'dev')
        })
        
        it('if react wasn\'t selected create a normal babel file and webpack loaders', async () => {
            fs.readFileSync = jest.fn() 
                .mockReturnValueOnce('webpack')

            await createConfig('', '', false)

            expect(fs.readFileSync.mock.calls[1][0]).toContain('.babelrc')
            expect(helpers.addDependenciesToStore).toBeCalledWith('webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli', 'dev')
        })

        it('replaces the webpack config with the input and output selected and creates webpack config file', async () => {
            fs.readFileSync = jest.fn() 
                .mockReturnValueOnce('INPUT OUTPUT')

            await createConfig('src/index.js', 'dist', false)

            expect(helpers.writeFile.mock.calls[1][1]).toContain('src/index.js dist')
        })

        it('creates a postcss config', async () => {
            fs.readFileSync = jest.fn().mockReturnValueOnce('')            

            await createConfig('', '', false)

            expect(helpers.writeFile.mock.calls[0][0]).toEqual('postcss.config.js')
        })

        it('creates a babelrc file', async () => {
            fs.readFileSync
                .mockReturnValueOnce('')
            
            await createConfig('', '', false)

            expect(helpers.writeFile.mock.calls[2][0]).toEqual('.babelrc')   
        })

        it('doesn\'t create a babelrc file if one already exists', async () => {
            fs.readFileSync
                .mockReturnValueOnce('')
            fs.existsSync.mockReturnValue(true)
            
            await createConfig('', '', false)

            expect(helpers.writeFile).toBeCalledTimes(2)
        })

        it('calls local addScripts function', async () => {
            addWebpackModule.addScripts = jest.fn()
            fs.readFileSync
                .mockReturnValueOnce('')
            
            await createConfig('', '', false)

            expect(addWebpackModule.addScripts).toBeCalled()            
        })

        it('calls helpers installAllPackages', async () => {
            fs.readFileSync
                .mockReturnValueOnce('')
        
            await createConfig('', '', false) 

            expect(helpers.installAllPackages).toBeCalled()
        })
    })

    describe('function addScripts', () => {
        it('adds script "build" if none exists', () => {
            
            addScripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('build', "webpack --mode='production'")
        })

        it('adds script "build:prod" if "build" is taken', () => {
            helpers.checkIfScriptIsTaken.mockReturnValueOnce(true)
            addScripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('build:prod', "webpack --mode='production'") 
        })

        it('adds watch script "dev" if it\'s not taken', () => {
            addScripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('dev', "webpack --watch --mode='development'")
        })

        it('adds watch script "build:dev" if "dev" is taken', () => {
            helpers.checkIfScriptIsTaken
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                
            addScripts()

            expect(helpers.addScriptToPackageJSON).toBeCalledWith('build:dev', "webpack --watch --mode='development'")
        })

        it('logs an error if something goes wrong', () => {
            helpers.addScriptToPackageJSON.mockImplementation(() => { throw 'Error' })
            console.error = jest.fn()

            addScripts()

            expect(console.error).toBeCalledWith(`Couldn't add webpack development and production scripts to package json.`)
        })
    })
})