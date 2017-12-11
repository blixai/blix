let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen')

let inquirer = require('inquirer')
let prompt = inquirer.prompt

let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`, {silent:true})
  } else {
    shell.exec(`npm install --save-dev ${packages}`, {silent:true})
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages}`, {silent:true})
  } else {
    shell.exec(`npm install ${packages}`, {silent:true})
  }
}


let webpack = () => {
  installWebpack()
}

let webpackEntry = {
  type: 'input',
  name: 'src',
  message: 'What directory holds the index.js file:'
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

let installWebpack = () => {
  // need to ask questions like where is the index.js file
  // probably also need to add babelrc file 
  prompt([webpackEntry]).then(ans => {
    ans = ans.src 
    if (fs.existsSync(`./${ans}`)) {
      log('')
      prompt([webpackOutput]).then(output => {
        output = output.output
        reactQuestion(ans, output)
      })
    } else {
      log(`Couldn't find directory ${ans}. Please try again`)
      installWebpack()
    }
  })
}

let reactQuestion = (ans, output) => {
  prompt([addReact]).then(react => {
    react = react.react
    createConfig(ans, output, react)
  })
}

let createConfig = (input, output, react) => {
  let webpack;
  let babel
  if (react) {
    babel = fs.readFileSync(path.resolve(__dirname, './files/react-babel.js'), 'utf8') 
    install('react react-dom')   
    installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
    webpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
  } else {
    babel = fs.readFileSync(path.resolve(__dirname, './files/.babelrc'), 'utf8')
    webpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
    installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  }
  webpack = webpack.replace(/INPUT/g, input)
  webpack = webpack.replace(/OUTPUT/g, output)

  fs.writeFile('./webpack.config.js', webpack, (err) => {
    if (err) throw err
    log('Created webpack.config.js file')
  })

  fs.writeFile('./.babelrc', babel, (err) => {
    if (err) throw err 
    log('Created babelrc file')
  })

  let webpackProd = fs.readFileSync(path.resolve(__dirname, './files/webpack.prod.js'), 'utf8')
  let postcss = fs.readFileSync(path.resolve(__dirname, './files/postcss.config.js'), 'utf8')
  fs.writeFile('./webpack.prod.js', webpackProd, (err) => {
    if (err) throw err
    log('Created webpack.prod.js file')
  })
  fs.writeFile('./postcss.config.js', postcss, (err) => {
    if (err) throw err 
    log('Created postcss.config.js')
  })
  try {
    addScript('webpack', 'webpack --watch')
    addScript('webpack-prod', 'webpack --config webpack.prod.js')
  } catch (e) {
    log(`Couldn't add the webpack and webpack-prod scripts to package json. `)
  }
}

let addScript = (command, script) => {
  let buffer = fs.readFileSync(`./package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./package.json`, newPackage)
}

module.exports = webpack