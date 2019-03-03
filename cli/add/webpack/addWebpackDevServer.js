const helpers = require('../../../dist/src')
let inquirer  = require('inquirer')
let prompt    = inquirer.prompt
let glob       = require('glob')

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
  await helpers.yarn()
  helpers.installDependencies('webpack-dev-server', 'dev')
  if (helpers.checkIfScriptIsTaken('server')) {
    if (helpers.checkIfScriptIsTaken('dev')) {
      helpers.addScriptToPackageJSON('dev:server', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`)
    } else {
      helpers.addScriptToPackageJSON('dev', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`) 
    }
  } else {
    helpers.addScriptToPackageJSON('server', `webpack-dev-server --output-public-path=/${answer.output}/ --inline --hot --open --port 3000 --mode='development'`)
  }
}

module.exports = addWebpackDevServer

