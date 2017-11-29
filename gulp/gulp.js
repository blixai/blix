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


let addGulp = () => {
  checkPackageJSON()

  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
  let gulp = fs.readFileSync(path.resolve(__dirname, './files/gulpFile.js'), 'utf8')
  fs.writeFile('./gulpfile.js', gulp, (err) => {
    if (err) throw err 
    log('gulpfile.js created.')
    
  })
  addScript('gulp', 'gulp')
  addScript('gulp-prod', 'gulp production') 
  rl.close()
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
    rl.close()
    return
  } 
}

module.exports = addGulp