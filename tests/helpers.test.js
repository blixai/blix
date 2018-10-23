jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    existsSync: jest.fn(),
    writeFileSync: jest.fn(),
    truncateSync: jest.fn(),
    appendFileSync: jest.fn(),
    mkdirSync: jest.fn(),
    readdirSync: jest.fn(),
    rmdirSync: jest.fn()
}))

jest.mock('child_process', () => ({
    execSync: jest.fn()
}))
jest.mock('inquirer', () => ({
  prompt: jest.fn()
}))

const fs = require('fs')
const child_process = require('child_process')
const inquirer = require('inquirer')
const chalk = require('chalk')
const store = require('../new/store')

const {
    canUseYarn,
    yarn,
    installDependencies,
    installDevDependencies,
    installKnexGlobal,
    addScript,
    modifyKnex,
    addScriptToNewPackageJSON,
    writeFile,
    mkdirSync,
    rename,
    addKeytoPackageJSON,
    installDependenciesToExistingProject,
    installDevDependenciesToExistingProject,
    checkScriptsFolderExist,
    getCWDName,
    modifyKnexExistingProject,
    appendFile,
    checkIfScriptIsTaken,
    moveAllFilesInDir,
    addDependenciesToStore,
    addDevDependenciesToStore,
    installAllPackages,
    installAllPackagesToExistingProject,
    insert
} = require('../helpers')

const helpers = require('../helpers')


describe('Helper Tests', () => {
    describe('canUseYarn', () => {

        it('should set store.useYarn to true if yarn.lock file exists', () => {
            fs.existsSync.mockReturnValue(true)
            canUseYarn()
            expect(store.useYarn).toBe(true)
        })

        it('should set store.useYarn to false if package-lock.json exists', () => {
            fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true)
            canUseYarn()
            expect(store.useYarn).toBe(false)
        })

        it('should return true if yarn is installed', () => {
            fs.existsSync.mockReturnValue(false)
            child_process.execSync.mockImplementation(() => true)
            expect(canUseYarn()).toBe(true)
        })

        it('should return false if yarn is not installed', () => {
            fs.existsSync.mockReturnValue(false)
            child_process.execSync.mockImplementation(() => {throw 'Error'})
            expect(canUseYarn()).toBe(false)
        }) 
    })

    describe('yarn', () => {
        beforeEach(() => {
          store.useYarn = ''
        })

        it('will prompt if canUseYarn is true and no selection has been made previously', async () => {
          fs.existsSync.mockReturnValue(true)
          inquirer.prompt.mockReturnValue(() => {
              return new Promise((resolve) => {resolve({ yarn: true })})
          })
          await yarn()
          expect(store.useYarn).toBe(true)
        })

        it('will not prompt if canUseYarn returns false', () => {
          fs.existsSync.mockReturnValue(false)
          yarn()
          expect(store.useYarn).toBe('')
        })

        it('will not prompt if user has already selected npm', async () => {
          fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true)
          await yarn()
          expect(store.useYarn).toBe(false)
        })

        it('will not prompt if user has already selected yarn', async () => {
          store.useYarn = true
          await yarn()
          expect(inquirer.prompt).not.toBeCalled()
        })
    })
    
    describe('installDependencies', () => {
        it('uses yarn installs dependencies to a new project if yarn selected', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = true
            installDependencies('react')
            expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn add react')
        })
        it('uses npm to installs dependencies to a new project if npm selected', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = false
            installDependencies('react')
            expect(child_process.execSync.mock.calls[0][0]).toEqual('npm install --save react')
        })
    })

    describe('installDevDependencies', () => {
        it('uses yarn installs dev dependencies to a new project if yarn selected', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = true
            installDevDependencies('react')
            expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn add react --dev')
        })
        it('uses npm to installs dev dependencies to a new project if npm selected', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = false
            installDevDependencies('react')
            expect(child_process.execSync.mock.calls[0][0]).toEqual('npm install --save-dev react')
        })
    })

    describe('installKnexGlobal', () => { 
        beforeEach(() => {
            let name = 'tests'            
        })           
        afterEach(() => {
            store.name = ''                                                                                                                                                                                                                                                                                                                                    
        })
        it('attempts to install a postgres db', () => {
            child_process.execSync.mockReturnValue(true)
            store.env = 'development'          
            installKnexGlobal()
            expect(child_process.execSync.mock.calls[0][0]).toContain('')                                                            
            expect(child_process.execSync).toBeCalledTimes(2)                        
        })

        it('if yarn selected and installed uses yarn to install knex globally', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = true
            installKnexGlobal()
            expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn add knex global')
        })
        it('if npm selected and installed uses npm to install knex globally', () => {
            child_process.execSync.mockReturnValue(true)
            store.useYarn = false
            installKnexGlobal()
            expect(child_process.execSync.mock.calls[0][0]).toEqual('npm install -g knex')                
        })
    })

    describe('addScript', () => {
        it('should add script to package.json if package.json exits', () => {
            fs.readFileSync.mockReturnValue(`{"scripts": {} }`)
            console.error = jest.fn()
            console.log = jest.fn()
            addScript('test', 'node')
            expect(console.error).not.toBeCalled()
            expect(console.log.mock.calls[0][0]).toContain('test script into package.json')
        })
        it('throws an error if no package.json', () => {
            fs.readFileSync.mockReturnValue(null)

            addScript('test', 'node')
            expect(console.error).toBeCalled()
        })
    })

    describe('modifyKnex', () => {
        beforeEach(() => {
            store.name = 'tests'
        })

        it('truncates knexfile if it already exists', () => {
            fs.existsSync.mockReturnValue(true)

            modifyKnex()

            expect(fs.existsSync).toBeCalledWith(`./tests/knexfile.js`)
            expect(fs.truncateSync).toBeCalledWith('./tests/knexfile.js', 0)
            expect(fs.appendFileSync).toBeCalled()
            expect(fs.mkdirSync.mock.calls[0][0]).toEqual('./tests/db')
            expect(fs.mkdirSync.mock.calls[1][0]).toEqual('./tests/db/migrations')
        })

        it('creates a knexfile if none exists', () => {
            fs.existsSync.mockReturnValue(false)

            modifyKnex()

            expect(fs.existsSync).toBeCalledWith(`./tests/knexfile.js`)
            expect(fs.writeFileSync.mock.calls[0][0]).toEqual('./tests/knexfile.js')
            expect(fs.mkdirSync.mock.calls[0][0]).toEqual('./tests/db')
            expect(fs.mkdirSync.mock.calls[1][0]).toEqual('./tests/db/migrations') 
        })
    })

    describe('addScriptToNewPackageJSON', () => {
      let command = 'test'
      let script = 'node'
      it('should add script to new package.json if package.json exits', () => {
        fs.readFileSync.mockReturnValue(`{"scripts": {} }`)
        console.error = jest.fn()
        addScriptToNewPackageJSON(command, script)
        expect(console.error).not.toBeCalled()
        expect(fs.writeFileSync.mock.calls[0][1]).toContain(command, script)
      })
      it('throws an error if no package.json', () => {
          fs.readFileSync.mockReturnValue(null)
          addScriptToNewPackageJSON(command, script)
          expect(console.error).toBeCalled()
      })
    })

    describe('writeFile', () => {

        beforeEach(() => {
            store.name = ''
        })
        it('logs an error if no filePath is specified', () => {
            console.error = jest.fn() 
            writeFile()

            expect(console.error.mock.calls[0][0]).toEqual(chalk`{red No filePath specified.}`)
            expect(fs.writeFileSync).not.toBeCalled()
        })

        it('writes an empty file if filePath is defined but no file arg passed', () => {
            writeFile('tests/test.js')
            expect(fs.writeFileSync).toBeCalledWith('./tests/test.js', '')
        })

        it('writes a file if store.name selected', () => {
            let fileData = 'import { Component } from "react"'
            writeFile('test.js', fileData)

            expect(fs.writeFileSync).toBeCalledWith('./test.js', fileData)
        })

        it('writes a file to new directory if store.name selected', () => {
            store.name = 'someName'
            let fileData = 'import { Component } from "react"'
            writeFile('test.js', fileData)

            expect(fs.writeFileSync).toBeCalledWith('./someName/test.js', fileData)
        })

        it('writes a file to the current directory if no store.name provided', () => {
            writeFile('test.js')

            expect(fs.writeFileSync).toBeCalledWith('./test.js', '')
        })

        it('logs the filePath if successful', () => {
            console.log = jest.fn()
            writeFile('test.js')

            expect(console.log.mock.calls[0][0]).toEqual(chalk`{green create} test.js`)
        })

        it('will log a mutation to the console if the file already existed', () => {
            fs.existsSync.mockReturnValue(true)
            console.log = jest.fn()
            writeFile('test.js')

            expect(console.log.mock.calls[0][0]).toEqual(chalk`{yellow mutate} test.js`)
        })

        it('will log a custom message if message arg is passed', () => {
            console.log = jest.fn()
            writeFile('test.js', '', 'hey there')

            expect(console.log).toBeCalledWith('hey there')
        })

        it('will log an error if something goes wrong', () => {
            store.env = ''
            fs.writeFileSync.mockImplementation(() => {throw 'Error' })
            console.error = jest.fn()
            writeFile('test.js')

            expect(console.error).toBeCalledWith(chalk`{red Couldn't create file ./test.js}`)
        })

        it('will log a full error if something goes wrong and mode is development', () => {
            store.env = 'development'
            fs.writeFileSync.mockImplementation(() => {throw 'Error'})
            console.error = jest.fn()
            writeFile('test.js')

            expect(console.error).toBeCalledWith(chalk`{red Couldn't create file ./test.js. ERROR: Error }`)
        })
    })

    describe('mkdirSync', () => {

        beforeEach(() => {
            store.name = ''
            store.env = ''
        })

        it('creates a folder in current directory if no store.name', () => {
            mkdirSync('test')

            expect(fs.mkdirSync).toBeCalledWith('./test')
        })

        it('creates a folder in directory if store.name', () => {
            store.name = 'someName'   
            mkdirSync('test')

            expect(fs.mkdirSync).toBeCalledWith('./someName/test')
        })

        it('it logs an error and returns if no store.name and no folderPath are provided', () => {
            console.error = jest.fn()
            mkdirSync() 

            expect(console.error).toBeCalledWith(chalk`{red Unable to create folder}`)
            expect(fs.mkdirSync).not.toBeCalled()
        })

        it('creates a new folder if store.name exists but no folderPath is provided', () => {
            store.name = 'someName'
            mkdirSync()

            expect(fs.mkdirSync).toBeCalledWith('./someName/')
        })

        it('logs a clean folder path if successful', () => {
            console.log = jest.fn()
            mkdirSync('test')

            expect(console.log).toBeCalledWith(chalk`{green create} ${'test'}`)
        })

        it('throws a basic error if something goes wrong', () => {
            console.error = jest.fn()
            fs.mkdirSync.mockImplementation(() => { throw 'Error' }) 
            mkdirSync('test')

            expect(console.error).toBeCalledWith(chalk`\t{red Error making directory ${'./test'} }`)
        })

        it('throws a verbose error if something goes wrong and env is development', () => {
            store.env = 'development'
            console.error = jest.fn()
            fs.mkdirSync.mockImplementation(() => { throw 'Error' }) 
            mkdirSync('test')

            expect(console.error).toBeCalledWith(chalk`{red Error making directory ${'./test'}. ERROR: Error }`)
        })
    })

    describe.skip('rename', () => {

    })
    describe.skip('addKeytoPackageJSON', () => {

    })
    describe('installDependenciesToExistingProject', () => {
      afterEach(() => {
        store.env = ''
      })

      it('Calls checkIfPackageJSONExists', () =>{
        fs.existsSync.mockReturnValue(true)
        installDependenciesToExistingProject()
        expect(fs.existsSync).toBeCalledWith('package.json')
      })
      it('if yarn selected and installed uses yarn to install packages', () => {
        child_process.execSync.mockReturnValue(true)
        store.useYarn = true
        installDependenciesToExistingProject('react')
        expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn add react')
      })
      it('if npm selected and installed uses npm to install packages', () => {
          child_process.execSync.mockReturnValue(true)
          store.useYarn = false
          installDependenciesToExistingProject('react')
          expect(child_process.execSync.mock.calls[0][0]).toEqual('npm install --save react')                
      })
      it('Throws an error if there is an error installing packages while in development', () => {
        child_process.execSync.mockImplementation(() => {throw 'Error' })
        fs.existsSync.mockReturnValue(true)
        let packages = 'react'
        store.env = 'development'
        console.error = jest.fn()
        installDependenciesToExistingProject(packages)
        expect(console.error).toBeCalled()
        expect(console.error.mock.calls[0][0]).not.toContain(packages)
      })
      it('Throws an error to the console containing the packages if there is an error installing', () => {
        child_process.execSync.mockImplementation(() => {throw 'Error' })
        fs.existsSync.mockReturnValue(true)
        let packages = 'react'
        store.env = 'prod'
        console.error = jest.fn()
        installDependenciesToExistingProject(packages)
        expect(console.error).toBeCalled()
        expect(console.error.mock.calls[0][0]).toContain(packages)
      })
    })

    describe('installDevDependenciesToExistingProject', () => {
      afterEach(() => {
        store.env = ''
      })

      it('Calls checkIfPackageJSONExists', () =>{
        fs.existsSync.mockReturnValue(true)
        installDevDependenciesToExistingProject()
        expect(fs.existsSync).toBeCalledWith('package.json')
      })
      it('if yarn selected and installed uses yarn to install packages', () => {
        child_process.execSync.mockReturnValue(true)
        store.useYarn = true
        installDevDependenciesToExistingProject('react')
        expect(child_process.execSync.mock.calls[0][0]).toEqual('yarn add react --dev')
      })
      it('if npm selected and installed uses npm to install packages', () => {
          child_process.execSync.mockReturnValue(true)
          store.useYarn = false
          installDevDependenciesToExistingProject('react')
          expect(child_process.execSync.mock.calls[0][0]).toEqual('npm install --save-dev react')                
      })
      it('Throws an error if there is an error installing packages while in development', () => {
        child_process.execSync.mockImplementation(() => {throw 'Error' })
        fs.existsSync.mockReturnValue(true)
        let packages = 'react'
        store.env = 'development'
        console.error = jest.fn()
        installDevDependenciesToExistingProject(packages)
        expect(console.error).toBeCalled()
        expect(console.error.mock.calls[0][0]).not.toContain(packages)
      })
      it('Throws an error to the console containing the packages if there is an error installing', () => {
        child_process.execSync.mockImplementation(() => {throw 'Error' })
        fs.existsSync.mockReturnValue(true)
        let packages = 'react'
        store.env = 'prod'
        console.error = jest.fn()
        installDevDependenciesToExistingProject(packages)
        expect(console.error).toBeCalled()
        expect(console.error.mock.calls[0][0]).toContain(packages)
      })
    })

    describe('checkScriptsFolderExist', () => {
      it("Creates scripts and scripts/templates dir if scripts dir doesn't exist", () => { 
        fs.existsSync.mockReturnValueOnce(false)
        helpers.mkdirSync = jest.fn()
        checkScriptsFolderExist()
        expect(helpers.mkdirSync).toBeCalledTimes(2)
        expect(helpers.mkdirSync.mock.calls[0][0]).toEqual('scripts')
        expect(helpers.mkdirSync.mock.calls[1][0]).toEqual('scripts/templates')
      })

      it("Creates scripts/templates dir if scripts/templates does not exist", () => {
        fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false)
        helpers.mkdirSync = jest.fn()
        checkScriptsFolderExist()
        expect(helpers.mkdirSync).toBeCalledTimes(1)
        expect(helpers.mkdirSync.mock.calls[0][0]).toEqual('scripts/templates')
      })

    })

    describe('getCWDName', () => {
      it("gets the current working directory", () => {
        const spy = jest.spyOn(process, 'cwd').mockImplementation(() => {
          return 'usr/local/testApp'
        })
        getCWDName()
        expect(spy).toBeCalled()
        expect(getCWDName()).toEqual('testApp')
      })
    })

    describe.skip('modifyKnexExistingProject', () => {
    })

    describe('appendFile', () => {
        beforeEach(() => {
            store.name = ''
            store.env = ''
        })

        it('appends string to a file', () => {
            appendFile('test', 'hello there')

            expect(fs.appendFileSync).toBeCalledWith('./test', 'hello there')
        })

        it('logs a warning and returns if file isn\'t specified', () => {
          console.error = jest.fn()
          appendFile()  

          expect(console.error).toBeCalledWith(chalk`{red File not provided.}`)
          expect(fs.appendFileSync).not.toBeCalled()
        })

        it('logs a warning and returns if stringToAppend isn\'t specified', () => {
               console.error = jest.fn()
               appendFile('test.js')

               expect(console.error).toBeCalledWith(chalk`{red No string to append provided.}`)
               expect(fs.appendFileSync).not.toBeCalled()
        })

        it('logs a basic error if something went wrong', () => {
            console.error = jest.fn()
            fs.appendFileSync.mockImplementation(() => {throw 'Error'})
            appendFile('test.js', 'hello there')

            expect(console.error).toBeCalledWith(chalk.red`Failed to append ${'./test.js'}`)
        })

        it('logs a verbose error if something went wrong and store.env is development', () => {
            store.env = 'development'
            console.error = jest.fn()
            fs.appendFileSync.mockImplementation(() => {throw 'Error'})
            appendFile('test.js', 'hello there')

            expect(console.error).toBeCalledWith(chalk.red`Failed to append ./test.js. ERROR: Error`)
        })
    })

    describe.skip('checkIfScriptIsTaken', () => {
    })

    describe('moveAllFilesInDir', () => {

        beforeEach(() => {
            store.env = ''
        })

        it('moves all files in a specified directory into another specified directory', () => {
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')

            expect(mock).toBeCalledTimes(3)
            expect(mock.mock.calls[0][0]).toEqual('test/test.js')
            expect(mock.mock.calls[0][1]).toEqual('testing/test.js')
        })

        it('returns with an error if the directory to search for files isn\'t specified', () => {
            console.error = jest.fn()

            moveAllFilesInDir()

            expect(console.error).toBeCalledWith(chalk`{red No directory to search specified.}`)
        })

        it('returns with an error if the directory to move to isn\'t specified', () => {
            console.error = jest.fn()

            moveAllFilesInDir('test')

            expect(console.error).toBeCalledWith(chalk`{red No directory to move files to specified.}`)
        })

        it('doesn\'t move directories named actions, components, store, or services', () => {
            fs.readdirSync.mockReturnValue(['actions', 'components', 'store', 'services'])
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')

            expect(mock).not.toBeCalled()
        })

        it('logs a simple error if something goes wrong reading the directory', () => {
          console.error = jest.fn()
          fs.readdirSync.mockImplementation(() => {throw 'Error' })  

          moveAllFilesInDir('test', 'testing')

          expect(console.error).toBeCalledWith(chalk`{red Failed to read directory.}`)
        })
        
        it('logs a verbose error if something goes wrong when reading the directory', () => {
            store.env = 'development'
            console.error = jest.fn()
            fs.readdirSync.mockImplementation(() => {throw 'Error' })  
  
            moveAllFilesInDir('test', 'testing')
  
            expect(console.error).toBeCalledWith(chalk`{red Failed to read directory. ERROR: Error}`) 
        })

        it('deletes the old directory', () => {
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            fs.rmdirSync.mockReturnValue(true)
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')
            
            expect(fs.rmdirSync).toBeCalled()
        })

        it('doesn\'t delete the old directory if its not empty', () => {
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            fs.rmdirSync.mockImplementation(() => {throw 'Error'})
            console.error = jest.fn()
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')

            expect(fs.rmdirSync).toBeCalled() 
            expect(console.error).toBeCalled()
        })

        it('logs if successful', () => {
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            fs.rmdirSync.mockReturnValue(true)
            console.log = jest.fn()
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('./test', 'testing')

            expect(fs.rmdirSync).toBeCalled() 
            expect(console.log).toBeCalledWith(chalk`{red delete} test`)
        })

        it('logs a simple error if something goes wrong when deleteing the old directory', () => {
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            fs.rmdirSync.mockImplementation(() => {throw 'Error'})
            console.error = jest.fn()
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')

            expect(fs.rmdirSync).toBeCalled() 
            expect(console.error).toBeCalledWith(chalk`{red Failed to delete test}`) 
        })

        it('logs a verbose error if something goes wrong when deleting the old directory and store.env is development', () => {
            store.env = 'development'
            fs.readdirSync.mockReturnValue(['test.js', 'test1.js', 'test2.css'])
            fs.rmdirSync.mockImplementation(() => {throw 'Error'})
            console.error = jest.fn()
            
            let mock = helpers.rename = jest.fn() 

            moveAllFilesInDir('test', 'testing')

            expect(fs.rmdirSync).toBeCalled() 
            expect(console.error).toBeCalledWith(chalk`{red Failed to delete test. ERROR: Error}`)   
        })
    })
    describe('addDependenciesToStore', () => {

        beforeEach(() => {
            store.dependencies = ''
        })

        it('sets store.dependencies equal to argument if store.dependencies is empty string', () => {
                         
            addDependenciesToStore('react express')

            expect(store.dependencies).toEqual('react express') 
        })

        it('adds a space before combining it\'s arguments with store.dependencies if store.dependencies is not an empty string', () => {
            store.dependencies = 'react express'

            addDependenciesToStore('vue')

            expect(store.dependencies).toEqual('react express vue')
        })
    })
    describe('addDevDependenciesToStore', () => {
        beforeEach(() => {
            store.devDependencies = ''
        })

        it('sets store.devDependencies equal to argument if store.devDependencies is empty string', () => {
            addDevDependenciesToStore('webpack')

            expect(store.devDependencies).toEqual('webpack')
        })

        it('adds a space before combining it\'s argument with store.devDependencies if store.devDependencies is not an empty string', () => {
            store.devDependencies = 'webpack'
            addDevDependenciesToStore('webpack-dev-server')

            expect(store.devDependencies).toEqual('webpack webpack-dev-server')
        })
    })
    describe('installAllPackages', () => {
      beforeEach(() => {
        store.dependencies = ''
        store.devDependencies = ''
      })
      it("Calls installDependencies if store contains dependencies", () => {
        helpers.installDependencies = jest.fn()
        store.dependencies = 'react'
        installAllPackages()
        expect(helpers.installDependencies).toBeCalled()
        expect(helpers.installDependencies).toHaveBeenCalledWith('react')
        expect(helpers.installDependencies.mock.calls[0][0]).not.toEqual('')
      })
      it("Calls installDevDependencies if store contains dev dependencies", () => {
        helpers.installDevDependencies = jest.fn()
        store.devDependencies = 'react'
        installAllPackages()
        expect(helpers.installDevDependencies).toBeCalled()
        expect(helpers.installDevDependencies).toHaveBeenCalledWith('react')
        expect(helpers.installDevDependencies.mock.calls[0][0]).not.toEqual('')
      })
    })
    describe.skip('installAllPackagesToExistingProject', () =>  {

    })

    describe('insert', () => {

        beforeEach(() => {
            store.name = ''
            store.env = ''
        })

        it('inserts a string into a file at specified line number', () => {
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine") 
            insert('test.js', 'hello there', 2)

            expect(fs.writeFileSync).toBeCalledWith("test.js", "firstLine\nnextLine\nhello there\nfinalLine")
        })

        it('inserts a string into a file after specified string to insert after', () => {
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine") 
            insert('test.js', 'hello there', 'nextLine')

            expect(fs.writeFileSync).toBeCalledWith("test.js", "firstLine\nnextLine\nhello there\nfinalLine") 
        })

        it('appends a string into a file after specified string to insert after is not found and file has a newline at the end it creates a newline before and after itself', () => {
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine\n") 
            insert('test.js', 'hello there', 'someLine')

            expect(fs.writeFileSync).toBeCalledWith("test.js", "firstLine\nnextLine\nfinalLine\n\nhello there")  
        })

        it('appends a string into a file after specified string to insert after is not found and file doesn\'t have new line at the end of it', () => {
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine") 
            insert('test.js', 'hello there', 'someLine')

            expect(fs.writeFileSync).toBeCalledWith("test.js", "firstLine\nnextLine\nfinalLine\nhello there")  
        })

        it('if successful logs to console', () => {
            fs.writeFileSync.mockReturnValue(true)
            console.log = jest.fn()
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine") 
           
            insert('test.js', 'hello there', 'nextLine')

            expect(console.log).toBeCalledWith(chalk`{cyan insert} test.js`) 
        })

        it('prompts for a place to insert after if no lineToInsertAt is used', async () => {
            fs.writeFileSync.mockReturnValue(true)
            fs.readFileSync.mockReturnValue("firstLine\nnextLine\nfinalLine") 
           
            inquirer.prompt.mockResolvedValue("nextLine")

            await insert('test.js', 'hello there')

            expect(inquirer.prompt).toBeCalled()
            expect(fs.writeFileSync).toBeCalledWith('test.js', "firstLine\nnextLine\nhello there\nfinalLine")
        })

        it('returns with a warning if no file specified', () => {
            console.error = jest.fn()
            insert()

            expect(console.error).toBeCalledWith(chalk`{red No file specified.}`)
            expect(fs.readFileSync).not.toBeCalled()
        })

        it('returns with a warning if no string to insert is passed', () => {
            console.error = jest.fn()
            insert('test')

            expect(console.error).toBeCalledWith(chalk`{red No string to insert specified.}`)
            expect(fs.readFileSync).not.toBeCalled()
        })

        it('logs a basic error if something goes wrong', () => {
            console.error = jest.fn()
            fs.readFileSync.mockImplementation(() => { throw 'Error' })
            insert('test', 'test')

            expect(console.error).toBeCalledWith(chalk`{red Failed to insert into test}`)
        })

        it('logs a verbose error if something goes wrong and store.env is development', () => {
            store.env = 'development'
            console.error = jest.fn()
            fs.readFileSync.mockImplementation(() => { throw 'Error' })
            insert('test', 'test')

            expect(console.error).toBeCalledWith(chalk`{red Failed to insert into test. ERROR: Error}`)       
        })
      })
})

