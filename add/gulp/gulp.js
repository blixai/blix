let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;

let inquirer = require('inquirer')
let prompt = inquirer.prompt

let output = {
  type: 'input',
  message: 'What directory should contain the output files:',
  name: 'output'
}

let input = {
  type: 'input',
  message: 'What directory contains the source files:',
  name: 'input'
}


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


let addGulp = () => {
  checkPackageJSON()
  prompt([input]).then(input => {
    input = input.input 
    prompt([output]).then(output => {
      output = output.output
      let gulp = fs.readFileSync(path.resolve(__dirname, './files/gulpFile.js'), 'utf8')
      gulp = gulp.replace(/INPUT/g, input)
      gulp = gulp.replace(/OUTPUT/g, output)
      installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
      fs.writeFile('./gulpfile.js', gulp, (err) => {
        if (err) throw err 
        log('gulpfile.js created.')
        
      })
      addScript('gulp', 'gulp')
      addScript('gulp-prod', 'gulp production') 
    })
  })
}

let addScript = (command, script) => {
  let buffer = fs.readFileSync(`./package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./package.json`, newPackage)
}

let checkPackageJSON = () => {
  if (!fs.existsSync('./package.json')) {
    log(`Can't find the package.json to install gulp dependencies. Make sure you're in the right directory.`)
    return
  } 
}

module.exports = addGulp