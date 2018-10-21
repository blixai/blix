jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    existsSync: jest.fn(),
    writeFileSync: jest.fn()
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
    installAllPackagesToExistingProject
} = require('../helpers')


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
})

