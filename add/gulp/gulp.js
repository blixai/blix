let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;
let glob = require('glob')
let inquirer = require('inquirer')
let prompt = inquirer.prompt

let output = {
  type: 'input',
  message: 'What directory should contain the output files:',
  name: 'output'
}

let input = {
  type: 'list',
  message: 'Select the source directory:',
  name: 'input',
  choices: []
}

let tasks = {
  type: 'checkbox',
  message: 'Choose any files or styles you want Gulp to work with (configured for JS by default):',
  name: 'tasks',
  choices: [
    { name: 'Sass',    value: 'sass' },
    { name: 'PostCSS', value: 'post' },
    { name: 'CSS',     value: 'css'  },
    { name: 'Html',     value: 'html' }
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

let installDevDependencies = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages} --dev`, {silent:false})
  } else {
    shell.exec(`npm install --save-dev ${packages}`, {silent:false})
  }
}


let addGulp = () => {
  checkPackageJSON()
  let files = glob.sync('{,!(node_modules)/**/}')
  input.choices = files 
  prompt([input]).then(input => {
    input = input.input 
    input = './' + input
    prompt([output]).then(output => {
      output = output.output
      prompt([tasks]).then(ans => {
        let tasks = ans.tasks
        createGulp(input, output, tasks)
        // add html first, then css, postcss last, sass order doesnt matter
      })

    })
  })
}

let createGulp = (input, output, tasks) => {
  let gulp = fs.readFileSync(path.resolve(__dirname, './files/gulpFile.js'), 'utf8')
  gulp = detectTasks(gulp, tasks)
  gulp = gulp.replace(/INPUT/g, input)
  gulp = gulp.replace(/OUTPUT/g, output)
  log('Installing dependencies and setting up Gulp. This may take a moment.')
  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
  fs.writeFile('./gulpfile.js', gulp, (err) => {
    if (err) throw err 
    log('gulpfile.js created.')
    
  })
  addScript('gulp', 'gulp')
  addScript('gulp-prod', 'gulp production') 
}

let detectTasks = (gulp, tasks) => {
  if (tasks.includes('html')) {
    gulp = addHtml(gulp)
  }
  if (tasks.includes('post')) {
    gulp = addPostCSS(gulp)
  } else if (tasks.includes('css')) {
    gulp = addCSS(gulp)
  }
  if (tasks.includes('sass')) {
    gulp = addSass(gulp)
  }
  return gulp
}

let addTask = (line, task, gulp) => {
  let body = gulp.split('\n')
  body.splice(line, 0, task)
  gulp = body.join('\n')
  return gulp
}

let addTaskToTaskArray = (gulp, task) => {
  let body = gulp
  let search = `['js'`
  let position = body.indexOf(search)
  body = [body.slice(0, position + 5), task, body.slice(position + 5)].join('')
  position = body.lastIndexOf(search)
  gulp = [body.slice(0, position + 5), task, body.slice(position + 5)].join('')
  return gulp
}

let addTaskToProductionArray = (gulp, task) => {
  let body = gulp
  let position = body.indexOf(`['min-js'`)
  gulp = [body.slice(0, position + 9), task, body.slice(position + 9)].join('')
  return gulp 
}

let addCSS = (gulp) => {
  let requireCSS = `let cleanCSS = require('gulp-clean-css')`
  let cssTask = fs.readFileSync(path.resolve(__dirname, './files/css.js'), 'utf8')
  gulp = addTask(12, requireCSS, gulp)
  gulp = addTask(15, cssTask, gulp)
  gulp = addTaskToTaskArray(gulp, `, 'css'`)
  gulp = addTaskToProductionArray(gulp, `, 'minify-css'`)
  return gulp 
}

let addPostCSS = (gulp) => {
  let requireCSS = `let cleanCSS = require('gulp-clean-css')`
  let postcss = `let postcss = require('gulp-postcss')`
  let cssNext = `let cssnext = require('postcss-cssnext')`
  let postcssTask = fs.readFileSync(path.resolve(__dirname, './files/postcss.js'), 'utf8')
  gulp = addTask(12, requireCSS, gulp)
  gulp = addTask(12, postcss, gulp)
  gulp = addTask(12, cssNext, gulp)
  gulp = addTask(16, postcssTask, gulp)
  gulp = addTaskToTaskArray(gulp, `, 'css'`)
  gulp = addTaskToProductionArray(gulp, `, 'minify-css'`)
  installDevDependencies('gulp-postcss postcss-cssnext gulp-clean-css')
  let postcssConfig = fs.readFileSync(path.resolve(__dirname, './files/postcss.config.js'), 'utf8')
  fs.writeFile('./postcss.config.js', postcssConfig, (err) => {
    if (err) throw err 
    log('Created postcss.config.js file')
  })
  // need to add css to the tasks 
  return gulp 
}

let addSass = (gulp) => {
  let sass = `var sass = require('gulp-sass')`
  let sassTask = fs.readFileSync(path.resolve(__dirname, './files/scss.js'), 'utf8')

  gulp = addTask(15, sass, gulp)
  gulp = addTask(17, sassTask, gulp)
  gulp = addTaskToTaskArray(gulp, `, 'scss'`)
  installDevDependencies('gulp-sass')
  return gulp 
}

let addHtml = (gulp) => {
  let htmlmin = `var htmlmin = require('gulp-htmlmin')`
  let htmlTask = fs.readFileSync(path.resolve(__dirname, './files/html.js'), 'utf8')

  gulp = addTask(12, htmlmin, gulp)
  gulp = addTask(14, htmlTask, gulp)
  gulp = addTaskToTaskArray(gulp, `, 'html'`)
  gulp = addTaskToProductionArray(gulp, `, 'minify-html'`)
  installDevDependencies('gulp-htmlmin')
  return gulp 
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