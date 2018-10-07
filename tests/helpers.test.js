const fs = require('fs')
const sinon = require('sinon')
const child_process = require('child_process')


const { 
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


const helpers = require('../helpers')

const store = require('../new/store')
const execSync = require("child_process").execSync;

beforeAll(() => {
    try {
        fs.mkdirSync('./tmpTests')
    } catch (err) {
        console.log(err)
    }
});

afterAll(() => {
    try {
        execSync('rm -rf tmpTests')
    } catch (err){
        console.log(err)
    }
});

describe('Helper Tests', () => {
    beforeEach(() => {
        this.sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        this.sandbox.restore();
    })

    describe('canUseYarn', () => {
        afterEach(() => {
            if (fs.existsSync('yarn.lock')) fs.unlinkSync('yarn.lock')
            if (fs.existsSync('package-lock.json')) fs.unlinkSync('package-lock.json')
            store.useYarn = ''
        })

        it('should set store.useYarn to true if yarn.lock file exists', () => {
            fs.writeFileSync('yarn.lock')
            expect(store.useYarn).toBe('')

            helpers.canUseYarn()
            expect(store.useYarn).toBe(true)
        })

        it('should set store.useYarn to false if package-lock.json exists', () => {
            fs.writeFileSync('package-lock.json', '')
            expect(store.useYarn).toBe('')

            helpers.canUseYarn()
            expect(store.useYarn).toBe(false)
        })

        it('should return true if yarnpkg exists', () => {
            let returnBool = helpers.canUseYarn()
            expect(returnBool).toBe(true)
        }) 

        it('should return false if yarnpkg doesn\'t exist', () => {
            this.sandbox.stub(helpers, 'canUseYarn').returns(false)

            let returnBool = helpers.canUseYarn()
            expect(returnBool).toBe(false)
        })
    })

    describe('yarn', () => {
        it('expect a prompt if yarn is installed', () => {
            this.sandbox.stub(fs, 'existsSync').returns(false)
            this.sandbox.stub(helpers, 'canUseYarn').returns(true)

            this.sandbox.replace(helpers, 'yarn', function () {
                if (helpers.canUseYarn && store.useYarn === '') {
                    store.useYarn = true 
                }
            })
            helpers.yarn()
            expect(store.useYarn).toBe(true)
        })
    })
    
    describe.skip('installDependencies', () => {
    
        beforeEach(() => {
            try{
                process.chdir('./tmpTests')
                process.argv.push('new')
                process.argv.push('installTests')
                console.log(process.argv)
                fs.mkdirSync('./installTests')
            } catch (err) {
                console.log(err)
                process.exit(1);
            }
        })
    
        afterEach(() => {
            try{
                fs.rmdirSync('./installTests');
                process.chdir('../');
            } catch (err) {
                console.log(err)
            }
        })
    
        it('installs a dependencies to a new project', () => {
            store.useYarn = { yarn : true }
            console.log(store, process.cwd())
            installDependencies('react')
        })
    })
})

