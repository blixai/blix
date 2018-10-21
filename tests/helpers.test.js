jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    existsSync: jest.fn(),
    writeFileSync: jest.fn()
}))

jest.mock('child_process', () => ({
    execSync: jest.fn()
}))
jest.mock('inquirer')

const fs = require('fs')
const child_process = require('child_process')
const inquirer = require('inquirer')
const store = require('../new/store')

const {
    canUseYarn,
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

    describe.skip('yarn', () => {
        beforeEach(() => {
            store.useYarn = ''
        })

        afterEach(() => {
            this.sandbox.restore()
        })

        it('will prompt if canUseYarn is true and no selection has been made previously', () => {
            this.sandbox.stub(fs, 'existsSync').returns(false)
            this.sandbox.stub(helpers, 'canUseYarn').returns(true)
            this.sandbox.stub(inquirer, 'prompt').resolves({ yarn: true })

            helpers.yarn().then(() => {
                expect(store.useYarn).toBe(true)
                expect(this.sandbox.assert.calledOnce(inquirer.prompt)).toBe(true)
            })
        })

        it('will not prompt if canUseYarn returns false', () => {
            this.sandbox.stub(helpers, 'canUseYarn').returns(false)
            // it didn't prompt and we can tell because we dont need to handle the normal promise (no .then)
            helpers.yarn()
            expect(store.useYarn).toBe('')
        })

        it('will not prompt if user has already selected npm', () => {
            this.sandbox.stub(inquirer, 'prompt').resolves({ yarn: false })
            this.sandbox.stub(helpers, 'canUseYarn').returns(true) 
            helpers.yarn().then(() => {
                expect(store.useYarn).toBe(false)
                expect(this.sandbox.assert.notCalled(inquirer.prompt)).toBe(true)
            })
        })

        it('will not prompt if user has already selected yarn', () => {
            this.sandbox.stub(inquirer, 'prompt').resolves({ yarn: true })
            this.sandbox.stub(helpers, 'canUseYarn').returns(true) 
            helpers.yarn().then(() => {
                expect(store.useYarn).toBe(true)
                expect(this.sandbox.assert.notCalled(inquirer.prompt)).toBe(true)
            }) 
        })
    })
    
    describe.skip('installDependencies', () => {
        it('installs a dependencies to a new project', () => {
            store.useYarn = { yarn : true }
            console.log(store, process.cwd())
            installDependencies('react')
        })
    })
})

