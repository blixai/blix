const fs = require('fs')
const path = require('path')
const helpers = require('../../helpers')
const store = require('../store')
const name = process.argv[3];

const loadFile = filePath => {
    let root = '../files/'
    return fs.readFileSync(path.resolve(__dirname, root + filePath), "utf8");
};

let prettierConfig = loadFile('common/linter/prettier.js')
let eslintBasicConfig = loadFile('common/linter/eslintBasic.js')
let eslintPrettier = loadFile('common/linter/eslintPrettier.js')

const addLinter = () => {
    if (store.linter === 'prettier') {
        helpers.addDevDependenciesToStore('prettier')
        helpers.writeFile(`./${name}/prettier.config.js`, prettierConfig)
        helpers.addScriptToNewPackageJSON('lint', `prettier --config prettier.config.js --write '**/*.js'`)
    } else if (store.linter === 'eslint') {
        helpers.addDevDependenciesToStore('eslint eslint-plugin-react')
        helpers.writeFile(`./${name}/.eslintrc.js`, eslintBasicConfig)
        helpers.addScriptToNewPackageJSON('lint', 'eslint src/**.js')
    } else if (store.linter === 'eslint_prettier') {
        helpers.addDevDependenciesToStore('eslint eslint-plugin-react eslint-config-prettier')
        helpers.writeFile(`./${name}/.eslintrc.js`, eslintPrettier)
        helpers.addScriptToNewPackageJSON('lint', 'eslint src/**.js')
    }
}

module.exports = { addLinter }