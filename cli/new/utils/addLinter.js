const { 
  loadFile, 
  store,
  addScriptToPackageJSON,
  addDependenciesToStore,
  writeFile
} = require('../../../index')

let prettierConfig = loadFile('common/linter/prettier.js')
let eslintBasicConfig = loadFile('common/linter/eslintBasic.js')
let eslintPrettier = loadFile('common/linter/eslintPrettier.js')

const eslintPackageJsonScripts = () => {
  if (store.backend.backend && store.reactType) {
    addScriptToPackageJSON('lint', `eslint 'src/**/*.js' 'server/**/*.js'`)
  } else if (store.backend.backend) {
    addScriptToPackageJSON('lint', `eslint 'server/**/*.js'`)
  } else if (store.reactType) {
    addScriptToPackageJSON('lint', `eslint 'src/**/*.js'`)
  }
}

const addLinter = () => {
  if (store.linter === 'prettier') {
    addDependenciesToStore('prettier', 'dev')
    writeFile(`prettier.config.js`, prettierConfig)
    addScriptToPackageJSON('lint', `prettier --config prettier.config.js --write '**/*.js'`)
  } else if (store.linter === 'eslint') {
    addDependenciesToStore('eslint eslint-plugin-react', 'dev')
    writeFile(`.eslintrc.js`, eslintBasicConfig)
    eslintPackageJsonScripts()
  } else if (store.linter === 'eslint_prettier') {
    addDependenciesToStore('eslint eslint-plugin-react eslint-config-prettier eslint-plugin-prettier prettier', 'dev')
    writeFile(`.eslintrc.js`, eslintPrettier)
    eslintPackageJsonScripts()
  }
}

module.exports = {addLinter, eslintPackageJsonScripts}