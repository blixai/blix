const fs = require('fs')
const sinon = require('sinon')


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
        process.chdir('./tests')
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

