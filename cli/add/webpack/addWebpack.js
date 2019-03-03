let fs         = require('fs')
let path       = require('path')
let glob       = require('glob')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let helpers    = require('../../../dist/src')
const { loadFile } = helpers


let webpackEntry = {
  type: 'list',
  name: 'src',
  message: 'Select the source file:',
  choices: []
}

let webpackOutput = {
  type: 'input',
  name: 'output',
  message: 'What directory should contain the output bundle:'
}

let addReact = {
  type: 'confirm',
  name: 'react',
  message: 'Do you want webpack configured for React: '
}

let noPackageJSON = {
  type: 'confirm',
  name: 'answer',
  message: `No package.json file found. You're in the ${helpers.getCWDName()} directory. Do you wish continue: `
}

const fileChecks = async () => {
  if (fs.existsSync('./webpack.config.js')) {
    console.error('Webpack config file already exists')
    process.exit(1)
  } else if (!fs.existsSync('./package.json')) {
    let continuePrompt = await prompt([noPackageJSON])
    if (!continuePrompt.answer) {
      process.exit()
    }
  }
}

exports.fileChecks = fileChecks

const webpack = async () => {
  await this.fileChecks()
  let files = glob.sync('{,!(node_modules)/**/}*.js')
  webpackEntry.choices = files
  let ans = await prompt([webpackEntry])
  ans = ans.src 
  ans = './' + ans
  let output = await prompt([webpackOutput])
  output = output.output
  this.reactQuestion(ans, output)
}

exports.webpack = webpack

const reactQuestion = async (ans, output) => {
  let react = await prompt([addReact])
  react = react.react
  await helpers.yarn()
  this.createConfig(ans, output, react)
}

exports.reactQuestion = reactQuestion


const createConfig = async (input, output, react) => {
  let webpack = loadFile('./webpack.config.js')
  let babel
  if (react) {
    babel = loadFile('../../new/files/frontend/babel/reactBabel')
    helpers.addDependenciesToStore('react react-dom')
    helpers.addDependenciesToStore('webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli @babel/preset-react', 'dev')
  } else {
    babel = loadFile('../../new/files/frontend/babel/.babelrc')
    helpers.addDependenciesToStore('webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli', 'dev')
  }

  webpack = webpack.replace(/INPUT/g, input)
  webpack = webpack.replace(/OUTPUT/g, output)

  let postcss = loadFile('../../new/files/frontend/postcss.config.js')
  helpers.writeFile('postcss.config.js', postcss)

  helpers.writeFile('webpack.config.js', webpack)
  if (!fs.existsSync('./.babelrc')) {
    helpers.writeFile('.babelrc', babel)
  }

  this.addScripts() 

  await helpers.installAllPackages()
}

exports.createConfig = createConfig

const addScripts = () => {
  try {
    if (helpers.checkIfScriptIsTaken('build')) {
      helpers.addScriptToPackageJSON('build:prod', "webpack --mode='production'")
    } else {
      helpers.addScriptToPackageJSON('build', "webpack --mode='production'")
    }

    if (helpers.checkIfScriptIsTaken('dev')) {
      helpers.addScriptToPackageJSON('build:dev', "webpack --watch --mode='development'") 
    } else {
      helpers.addScriptToPackageJSON('dev', "webpack --watch --mode='development'")
    }
  } catch (e) {
    console.error(`Couldn't add webpack development and production scripts to package json.`)
  }
}

exports.addScripts = addScripts
