let fs         = require('fs')
let path       = require('path')
let chalk      = require('chalk');
let glob       = require('glob')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt
let helpers    = require('../../helpers')

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

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
  await fileChecks()
  let files = glob.sync('{,!(node_modules)/**/}*.js')
  webpackEntry.choices = files
  let ans = await prompt([webpackEntry])
  ans = ans.src 
  ans = './' + ans
  let output = await prompt([webpackOutput])
  output = output.output
  reactQuestion(ans, output)
}

exports.webpack = webpack

const reactQuestion = async (ans, output) => {
  let react = await prompt([addReact])
  react = react.react
  await helpers.yarn()
  createConfig(ans, output, react)
}

exports.reactQuestion = reactQuestion


const createConfig = async (input, output, react) => {
  let webpack = loadFile('./webpack.config.js')
  let babel
  if (react) {
    babel = loadFile('../../new/files/frontend/babel/reactBabel')
    helpers.addDependenciesToStore('react react-dom')
    helpers.addDependenciesToStore('webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli @babel/preset-react')
  } else {
    babel = loadFile('../../new/files/frontend/babel/.babelrc')
    helpers.addDevDependenciesToStore('webpack babel-loader css-loader @babel/core @babel/preset-env style-loader sass-loader node-sass cssnano postcss postcss-preset-env postcss-import postcss-loader webpack-cli')
  }

  webpack = webpack.replace(/INPUT/g, input)
  webpack = webpack.replace(/OUTPUT/g, output)

  let postcss = loadFile('../../new/files/frontend/postcss.config.js')
  helpers.writeFile('postcss.config.js', postcss, 'Created postcss.config.js')

  helpers.writeFile('webpack.config.js', webpack, 'Created webpack.config.js')
  if (!fs.existsSync('./.babelrc')) {
    helpers.writeFile('.babelrc', babel, 'Created .babelrc')
  }


  try {
    if (helpers.checkIfScriptIsTaken('build')) {
      helpers.addScript('build:prod', "webpack --mode='production'")
    } else {
      helpers.addScript('build', "webpack --mode='production'")
    }

    if (helpers.checkIfScriptIsTaken('dev')) {
      helpers.addScript('build:dev', "webpack --watch --mode='development'") 
    } else {
      helpers.addScript('dev', "webpack --watch --mode='development'")
    }
  } catch (e) {
    console.error(`Couldn't add webpack development and production scripts to package json.`)
  }
  await helpers.installAllPackagesToExistingProject()
}

exports.createConfig = createConfig
