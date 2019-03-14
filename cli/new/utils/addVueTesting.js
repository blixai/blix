const {
    loadFile,
    store,
    addDependenciesToStore,
    addScriptToPackageJSON,
    loadUserJSONFile,
    writeJSONFile,
    writeFile,
    appendFile,
    mkdirSync
} = require('../../../blix')

const addVueTesting = () => {
    addDependenciesToStore('@vue/test-utils vue-template-compiler', 'dev')

    let selectedTestLib = store.vueTesting.vueTesting
    if (selectedTestLib === 'mocha') {
        mocha()
    } else if (selectedTestLib === 'jest') {
        jest()
    }
}

const webpackMocha = `
// test specific setups
if (process.env.NODE_ENV === 'test') {
  module.exports.externals = [require('webpack-node-externals')()]
  module.exports.devtool = 'eval'
}`

const mochaSetupFile = `require('jsdom-global')()

global.expect = require('expect')
`

const mocha = () => {
    mkdirSync('test/unit')
    appendFile('webpack.config.js', webpackMocha)
    writeFile('test/unit/setup.js', mochaSetupFile)
    addDependenciesToStore('mocha mocha-webpack jsdom jsdom-global expect', 'dev')
    addScriptToPackageJSON('test:unit', 'mocha-webpack --webpack-config webpack.config.js --require test/unit/setup.js test/unit/**/*.spec.js')
}

const jestObj = {
    moduleFileExtensions: [
        "js",
        "json",
        "vue"
    ],
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
}

const jest = () => {
    mkdirSync('test/unit')
    let name = store.name
    let json = loadUserJSONFile(`${name}/package.json`)
    json['jest'] = jestObj
    writeJSONFile('package.json', json)
    addDependenciesToStore('jest vue-jest babel-jest', 'dev')
    addScriptToPackageJSON('test:unit', 'jest')

}

module.exports = { addVueTesting }