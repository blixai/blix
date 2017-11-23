const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen')

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
    shell.exec(`yarn add ${packages} --dev`)
  } else {
    shell.exec(`npm install --save-dev ${packages}`)
  }
}


let webpack = () => {
  installWebpack()
}

let installWebpack = () => {
  // need to ask questions like where is the index.js file
  // probably also need to add babelrc file 
  log('')
  rl.question(chalk.cyanBright('What directory holds the index.js file: '), (ans) => {
    if (fs.existsSync(`./${ans}`)) {
      log('')
      rl.question(chalk.cyanBright('What directory should contain the output bundle: '), (output) => {
        let webpack = fs.readFileSync(path.resolve(__dirname, './files/webpack.config.js'), 'utf8')
        webpack = webpack.replace(/INPUT/g, ans)
        webpack = webpack.replace(/OUTPUT/g, output)
        installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass')
        
        let webpackProd = fs.readFileSync(path.resolve(__dirname, './files/webpack.prod.js'), 'utf8')
        fs.writeFile('./webpack.config.js', webpack, (err) => {
          if (err) throw err 
          log('Created webpack.config.js file')
        })
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
        rl.close()
      })
    } else {
      log(`Couldn't find directory ${ans}. Please try again`)
      installWebpack()
    }
  })
}

let addScript = (command, script) => {
  let buffer = fs.readFileSync(`./package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./package.json`, newPackage)
}

module.exports = webpack