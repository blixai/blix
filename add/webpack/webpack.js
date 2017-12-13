let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen')
let glob = require('glob')
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
    shell.exec(`yarn add ${packages} --dev`, {silent:false})
  } else {
    shell.exec(`npm install --save-dev ${packages}`, {silent:false})
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages}`, {silent:false})
  } else {
    shell.exec(`npm install ${packages}`, {silent:false})
  }
}


let webpack = () => {
  installWebpack()
}

let webpackEntry = {
  type: 'list',
  name: 'src',
  message: 'What directory holds the index.js file:',
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

let style = {
  type: 'checkbox',
  name: 'style',
  message: 'Select additional webpack loaders:',
  choices: [
    { name: 'PostCSS', value: 'post' },
    { name: 'Sass',    value: 'sass' }
  ]
}

let installWebpack = () => {
let files = glob.sync('{,!(node_modules)/**/}*.js')
  webpackEntry.choices = files 

  prompt([webpackEntry]).then(ans => {
    ans = ans.src 
    ans = './' + ans
    prompt([webpackOutput]).then(output => {
      output = output.output
      reactQuestion(ans, output)
    })
  })
}

let reactQuestion = (ans, output) => {
  prompt([addReact]).then(react => {
    react = react.react
    // createConfig(ans, output, react)
    styleQuestion(ans, output, react)
  })
}

let styleQuestion = (entry, output, react) => {
  prompt([style]).then(ans => {
    let selectedStyles = ans.style
    createConfig(entry, output, react, selectedStyles)
  })
}

let createConfig = (input, output, react, styles) => {
  log('Downloading dependencies, this may take a moment.')
  let webpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
  let babel
  if (react) {
    babel = fs.readFileSync(path.resolve(__dirname, './files/react-babel.js'), 'utf8') 
    install('react react-dom')   
    installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin extract-text-webpack-plugin ')
  } else {
    babel = fs.readFileSync(path.resolve(__dirname, './files/.babelrc'), 'utf8')
    installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin extract-text-webpack-plugin')
  }

  webpack = webpack.replace(/INPUT/g, input)
  webpack = webpack.replace(/OUTPUT/g, output)
  webpack = addLoader(styles, webpack)


  fs.writeFile('./webpack.config.js', webpack, (err) => {
    if (err) throw err
    log('Created webpack.config.js file')
  })

  fs.writeFile('./.babelrc', babel, (err) => {
    if (err) throw err 
    log('Created babelrc file')
  })

  let webpackProd = fs.readFileSync(path.resolve(__dirname, './files/webpack.prod.js'), 'utf8')
  fs.writeFile('./webpack.prod.js', webpackProd, (err) => {
    if (err) throw err
    log('Created webpack.prod.js file')
  })

  try {
    addScript('webpack', 'webpack --watch')
    addScript('webpack-prod', 'webpack --config webpack.prod.js')
  } catch (e) {
    log(`Couldn't add the webpack and webpack-prod scripts to package json. `)
  }
}

let addLoader = (styles, webpack) => {
  if (styles.includes('sass')) {
    let subwebpack = addSass(webpack)
    if (styles.includes('post')) {
      webpack = addPostCSS(subwebpack)
    } else {
      webpack = subwebpack
    }

  } else if (styles.includes('post')) {
    webpack = addPostCSS(webpack)
  }
  return webpack 
}

let addSass = (webpack) => {
  let extractSass = `const extractSass = new ExtractTextPlugin('main.css')`
  let body = webpack.split('\n')
  body.splice(2, 0, extractSass)
  body = body.join('\n')
  let search = 'loaders: ['
  let position = body.indexOf(search)
  let sassLoader = `\n\t\t\t{\n\t\t\t\ttest: /\\.scss$/,\n\t\t\t\tuse: extractSass.extract({\n\t\t\t\t\tfallback: "style-loader",\n\t\t\t\t\tuse: "css-loader!sass-loader"\n\t\t\t\t})\n\t\t\t},`
  let sassPlugin = '\n\t\textractSass,'
  webpack = [body.slice(0, position + 10), sassLoader, body.slice(position + 10)].join('')
  let newBody = webpack
  let index = newBody.indexOf('plugins: [')
  webpack = [newBody.slice(0, index + 10), sassPlugin, newBody.slice(index + 10)].join('')
  installDevDependencies('sass-loader node-sass')
  // add plugin
  return webpack 
}

// must go last as if scss support is there itll need to be added to that loader 
let addPostCSS = (webpack) => {
  // detect css-loader and add to it
  let body = webpack
  let position = body.lastIndexOf("css-loader")
  webpack = [body.slice(0, position + 10), '!postcss-loader', body.slice(position + 10)].join('')
  // detect scss loader and add to it
  let newBody = webpack
  let index = body.indexOf("sass-loader")
  if (index !== -1) {
    newBody = [newBody.slice(0, index + 11), '!postcss-loader', newBody.slice(index + 11)].join('')
  }
  webpack = newBody
  let postcss = fs.readFileSync(path.resolve(__dirname, './files/postcss.config.js'), 'utf8')  
  fs.writeFile('./postcss.config.js', postcss, (err) => {
    if (err) throw err 
    log('Created postcss.config.js')
  })
  installDevDependencies('cssnano postcss postcss-cssnext postcss-import postcss-loader')
  return webpack
}


let addScript = (command, script) => {
  let buffer = fs.readFileSync(`./package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./package.json`, newPackage)
}

module.exports = webpack