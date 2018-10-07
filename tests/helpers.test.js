const fs = require('fs')

const { 
    checkIfNeedYarnAnswer,
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
        fs.rmdirSync('./tmpTests');
    } catch (err){
        console.log(err)
    }
});

describe.skip('helper test: checkIfNeedYarnAnswer', () => {
    it.skip('expect a prompt if yarn is installed', (done) => {
        expect.assertions(1)
        checkIfNeedYarnAnswer()
        setTimeout(() => {
            execSync('y')
            expect(store.useYarn.yarn).toBe(true)
            done()
        }, 300)
    })
})

describe.skip('helper test: installDependencies', () => {

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
