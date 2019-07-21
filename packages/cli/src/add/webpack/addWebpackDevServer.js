let inquirer  = require('inquirer')
let prompt    = inquirer.prompt
let glob       = require('glob')
const {
  yarn,
  installDependencies,
  checkIfScriptIsTaken,
  addScriptToPackageJSON
} = require('@blixi/core')

let webpackOutput = {
  type: 'list',
  name: 'output',
  message: 'What directory should contains the output bundle:',
  choices: []
}

let addWebpackDevServer = async () => {
  let files = glob.sync('{,!(node_modules|*.*)}')
  webpackOutput.choices = files
  let answer = await prompt([webpackOutput])
  await yarn()
  installDependencies('webpack-dev-server', 'dev')
  if (checkIfScriptIsTaken('server')) {
    if (checkIfScriptIsTaken('dev')) {
      addScriptToPackageJSON('dev:server', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`)
    } else {
      addScriptToPackageJSON('dev', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`) 
    }
  } else {
    addScriptToPackageJSON('server', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`)
  }
}

module.exports = addWebpackDevServer

