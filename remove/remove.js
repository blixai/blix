let fs       = require('fs')
let path     = require('path')
let execSync = require('child_process').execSync;
let chalk    = require('chalk');
let log      = console.log;
let boxen    = require('boxen')
let shell    = require('shelljs')
let inquirer = require('inquirer')
let prompt   = inquirer.prompt


let choices = {
  type    : 'list', 
  message : `Select what you want to remove:`, 
  name    : 'remove', 
  choices : [
    { name: 'webpack' },
    { name: 'gulp'    }
  ]
}


let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let removeDependencies = (packages) => {
  let arr = packages.split(' ')
  let yarn = shouldUseYarn()
  if (yarn) {
    arr.forEach(package => {
      try {
        shell.exec(`yarn remove ${package}`)
      } catch (e) {
  
      }
    })
  } else {
    arr.forEach(package => {
      try {
        shell.exec(`npm uninstall ${package}`)
      } catch (e) {
        
      }
    })
  }
}

let removeGulp = () => {
  removeDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
  removeScript('gulp')
  removeScript('gulp-prod')
  fs.unlink('./gulpfile.js', (err) => {
    if (err) throw err;
    log('successfully deleted gulpfile');
  });
}

let removeWebpack = () => {
  removeDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin postcss-loader postcss-import postcss-cssnext postcss cssnano')
  removeScript('webpack')
  removeScript('webpack-prod')
  try {
    fs.unlinkSync('./webpack.config.js')
    fs.unlinkSync('./webpack.prod.js')
  } catch (err) {
    
  }
}


let remove = () => {
  process.stdout.write('\033c')
  prompt([choices]).then(ans => {
    command = ans.remove 
    switch (command) {
      case 'webpack':
        removeWebpack()
        break;
      case 'gulp':
        removeGulp()
        break
      default:
        break;
    }
  })
}

let removeScript = (command) => {
  let buffer = fs.readFileSync(`./package.json`)
  let json = JSON.parse(buffer)
  delete json.scripts[command]
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./package.json`, newPackage)
}

module.exports = remove 