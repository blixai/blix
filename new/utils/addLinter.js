const fs = require('fs')
const path = require('path')
const helpers = require('../../helpers')
const store = require('../store')

const loadFile = filePath => {
  let root = '../files/'
  return fs.readFileSync(path.resolve(__dirname, root + filePath), "utf8");
};

let prettierConfig = loadFile('common/linter/prettier.js')
let eslintBasicConfig = loadFile('common/linter/eslintBasic.js')
let eslintPrettier = loadFile('common/linter/eslintPrettier.js')

const eslintPackageJsonScripts = () => {
  if (store.backend.backend && store.reactType) {
    helpers.addScriptToPackageJSON('lint', `eslint 'src/**/*.js' 'server/**/*.js'`)
  } else if (store.backend.backend) {
    helpers.addScriptToPackageJSON('lint', `eslint 'server/**/*.js'`)
  } else if (store.reactType) {
    helpers.addScriptToPackageJSON('lint', `eslint 'src/**/*.js'`)
  }
}

const addLinter = () => {
  if (store.linter === 'prettier') {
    helpers.addDependenciesToStore('prettier', 'dev')
    helpers.writeFile(`prettier.config.js`, prettierConfig)
    helpers.addScriptToPackageJSON('lint', `prettier --config prettier.config.js --write '**/*.js'`)
  } else if (store.linter === 'eslint') {
    helpers.addDependenciesToStore('eslint eslint-plugin-react', 'dev')
    helpers.writeFile(`.eslintrc.js`, eslintBasicConfig)
    eslintPackageJsonScripts()
  } else if (store.linter === 'eslint_prettier') {
    helpers.addDependenciesToStore('eslint eslint-plugin-react eslint-config-prettier eslint-plugin-prettier prettier', 'dev')
    helpers.writeFile(`.eslintrc.js`, eslintPrettier)
    eslintPackageJsonScripts()
  }
}

module.exports = {addLinter, eslintPackageJsonScripts}