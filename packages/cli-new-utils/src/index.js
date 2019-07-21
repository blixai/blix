const { addAPIScript } = require('./addAPIScript')
const {     
    mochaTestBackend,
    testJestBackend,
    testBackend
} = require('./addBackendTests')
const { addBookshelfToScripts } = require('./addBookshelf')
const {
    e2eSetup,
    installCypress,
    installTestCafe,
    addJestToPackageJson
} = require('./addEndToEndTesting')
const { addLinter, eslintPackageJsonScripts } = require('./addLinter')
const { addMongoDBToProject, addMongooseToScripts } = require('./addMongoDB')
const { installReactTesting } = require('./addReactTesting')
const { addVueTesting } = require('./addVueTesting')
const { createCommonFilesAndFolders } = require('./createCommonFiles')
const {
    options,
    logCustomScriptInstructions,
    readmeFormatter,
    consoleFormatter,
    newProjectInstructions
} = require('./newProjectInstructions')

module.exports = {
    addBookshelfToScripts,
    addJestToPackageJson,
    addMongooseToScripts,
    addMongoDBToProject,
    addAPIScript,
    addLinter,
    addVueTesting,
    consoleFormatter,
    createCommonFilesAndFolders,
    e2eSetup,
    eslintPackageJsonScripts,
    installReactTesting,
    installCypress,
    installTestCafe,
    newProjectInstructions,
    logCustomScriptInstructions,
    mochaTestBackend,
    testJestBackend,
    testBackend,
    options,
    readmeFormatter
}