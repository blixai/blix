let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const log = console.log;
const boxen = require('boxen')

let spaBuild = require('./createReactSPA/createReactSPA')
let reactRedux = require('./reactRedux/reactRedux')
let noReactApp = require('./createAppWithoutReact/createAppWithoutReact')
let BE = require('./backendOnly/backendOnly')

let name = process.argv[3]

let frontend;

let shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

let install = (packages) => {
  let yarn = shouldUseYarn()
  if (yarn) {
    shell.exec(`yarn add ${packages}`, {silent:true})
  } else {
    shell.exec(`npm install --save ${packages}`, {silent:true})
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

let installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex', {silent:true})
    shell.exec('knex init', {silent:true})
  } else {
    shell.exec('npm install -g knex', {silent:true})
    shell.exec('knex init', {silent:true})
  }
}

let inquirer = require('inquirer')
let prompt = inquirer.prompt


let project = {
  type: 'list', message: 'What type of Project are you looking to build:', name: 'project', choices: [
    { name: 'React SPA' },
    { name: 'React, Redux, React/Router', value: 'redux' },
    { name: 'MVC' },
    { name: 'Backend Only' }
  ]
}

let backend = {
  type: 'confirm',
  message: 'Do you need a backend:',
  name: 'backend'
}

let database = {
  type: 'list',
  message: 'Database:',
  name: 'database',
  choices: [
    { name: 'MongoDB' },
    { name: 'Postgres' },
    { name: 'None' }
  ]
}

let pug = {
  type: 'confirm',
  message: 'Do you want to use the templating engine pug',
  name: 'pug'
}

let promptProject = () => {
  prompt([project])
    .then(answers => {
      let project = answers.project
      switch (project) {
        case 'React SPA':
          spa()
          break;
        case 'redux':
          redux()
          break;
        case 'MVC':
          mvc()
          break 
        default:
          beOnly()
          break;
      }
    });
}


let spa = () => {
  prompt([backend]).then(be => {
    if (be.backend) {
      prompt([database]).then(db => {
        if (db.database === 'Postgres') {
          postgresSPA()
        } else if (db.database === 'MongoDB') {
          mongooseSPA()
        } else {
          noDBSPA()
        }
      })
    } else {
      spaNoBE()
    }
  })
}


let redux = () => {
  prompt([backend]).then(be => {
    if (be.backend) {
      prompt([database]).then(db => {
        if (db.database === 'Postgres') {
          postgresRedux()
        } else if (db.database === 'MongoDB') {
          mongooseRedux()
        } else {
          noDBRedux()
        }
      })
    } else {
      reduxNoBE()
    }
  })
}

let mvc = () => { 
  prompt([database]).then(db => {
    prompt([pug]).then(pug => {
      if (db.database === 'Postgres') {
        pug.pug ? postgresMvcPug() : posgresMvcNoPug()
      } else if (db.database === 'MongoDB') {
        pug.pug ? mongooseMvcPug() : mongooseMvcNoPug()
      } else {
        pug.pug ? noDbMvcPug() : noDbMvcNoPug()
      }
    })
  })
}

let beOnly = () => {
  prompt([database]).then(db => {
    if (db.database === 'Postgres') {
      postgresBE()
    } else if (db.database === 'MongoDB') {
      mongooseBE()
    } else {
      noDbBE()
    }
  })
}


let createProject = () => {
  if (name) {
    // not sure we need this line here // maybe after they've made their selections
    fs.mkdirSync(`./${name}`)
    process.stdout.write('\033c')
    promptProject()
  } else {
    // need to include a message
    log('No name provided. Please run "enzo new <projectName>"')
    process.exit()
  }
}


let postgresSPA = () => {
  spaBuild.writeFilesWithSPAReact()
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon pg knex body-parser compression helmet react react-dom dotenv bookshelf morgan')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  installKnexGlobal()
  modifyKnex()
  try {
    execSync(`createdb ${name}`, { stdio: 'ignore' });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write('\033c')
  log('')
  log('The project was created!')
  log(`cd into ${name}`)
  log('First: npm run build')
  log('Then: npm start')
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example: ` + chalk.bold.cyanBright(`npm run api <name>`) + ` || use:` + chalk.yellowBright(` quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nreact || example:` + chalk.bold.cyanBright(` npm run react <componentName>`) + ` || use: ` + chalk.yellowBright(`quickly create a stateful or stateless React component`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:string`) + ` || use: ` + chalk.yellowBright(`create a Bookshelf model + database migration`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let mongooseSPA = () => {
  spaBuild.writeFilesWithSPAReact()
  addMongooseToEnzo()
  fs.writeFileSync(`./${name}/.env`)
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon compression helmet mongo dotenv body-parser react react-dom dotenv mongoose morgan')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('')
  log('The project was created!')
  log(`cd into ${name}`)
  log('First: npm run build')
  log('Then: npm start')
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example: ` + chalk.bold.cyanBright(`npm run api <name>`) + ` || use: ` + chalk.yellowBright(`quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nreact || example: ` + chalk.bold.cyanBright(`npm run react <componentName>`) + ` || use: ` + chalk.yellowBright(`quickly create a stateful or stateless React component`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:String password:String posts:Number`) + ` || use: ` + chalk.yellowBright(`create a Mongoose model`), { padding: 1, borderColor: 'yellow' }))
  log('')
}
  
         
let noDBSPA = () => {
  spaBuild.writeFilesWithSPAReact()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon compression helmet body-parser react react-dom dotenv morgan')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('')
  log('The project was created!')
  log(`cd into ${name}`)
  log('First: npm run build')
  log('Then: npm start')
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example: ` + chalk.bold.cyanBright(`npm run api <name>`) + ` || use:` + chalk.yellowBright(` quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nreact || example: ` + chalk.bold.cyanBright(`npm run react <componentName>`) + ` || use: ` + chalk.yellowBright(`quickly create a stateful or stateless React component`), { padding: 1, borderColor: 'yellow' }))
  log('')
}
    
let spaNoBE = () => {
  spaBuild.reactSPAWithoutBackend()
  log('Installing dependencies and running setup, this may take a moment')
  shell.cd(`${name}`)
  install('react react-dom')
  installDevDependencies('webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start, then refresh the page after a second`)
  log('Unique package.json Commands')
  log(boxen(`react || example: ` + chalk.bold.cyanBright(`npm run react <componentName>`) + ` || use: ` + chalk.yellowBright(`quickly create a stateful or stateless React component`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let postgresRedux = () => {
  reactRedux.ReactReduxWithBackend()
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('redux react-router-dom react-redux express dotenv nodemon pg knex body-parser compression helmet react react-dom bookshelf morgan')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  installKnexGlobal()
  modifyKnex()
  try {
    execSync(`createdb ${name};`, { stdio: 'ignore' });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name}`)
  log(`First start webpack: npm run build`)
  log(`To start server: npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example: ` + chalk.bold.cyanBright(`npm run api <name>`) + ` || use: ` + chalk.yellowBright(`quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nredux || example: ` + chalk.bold.cyanBright(`npm run redux <componentName>`) + ` || use:` + chalk.bold.yellowBright(`redux container + react component + react-router route`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:string`) + ` || use: ` + chalk.yellowBright(`create a Bookshelf model + knex database migration`) + `\n\naction || example:` + chalk.bold.cyanBright(` npm run action`) + ` || use: ` + chalk.yellowBright(`create/apply action to existing/created reducer and selected containers`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let mongooseRedux = () => {
  reactRedux.ReactReduxWithBackend()
  addMongooseToEnzo()
  shell.cd(`${name}`)
  process.stdout.write('\033c')
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('redux react-router-dom react-redux express nodemon dotenv compression helmet mongo dotenv body-parser react react-dom mongoose morgan')
  installDevDependencies(' webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name}`)
  log(`First start webpack: ` + chalk.cyanBright(`npm run build`))
  log(`To start server: ` + chalk.cyanBright(`npm start`))
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name>`) + ` || use: quickly create` + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nredux || example: ` + chalk.bold.cyanBright(`npm run redux <componentName>`) + ` || use: ` + chalk.yellowBright(`redux container + react component + react-router route`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:String posts:Number password:String`) + ` || use: ` + chalk.yellowBright(`create a Mongoose model`) + `\n\naction || example:` + chalk.bold.cyanBright(` npm run action`) + ` || use: ` + chalk.yellowBright(`create/apply action to existing/created reducer and selected containers`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let noDBRedux= () => {
  reactRedux.ReactReduxWithBackend()
  shell.cd(`${name}`)
  process.stdout.write('\033c')
  log(chalk.cyanBright('Downloading dependencies and setting up the project, this may take a moment'))
  install('redux react-router-dom react-redux express nodemon dotenv body-parser compression helmet react react-dom morgan')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log(chalk.cyanBright('The project was created!'))
  log(chalk.cyanBright(`cd into ${name}`))
  log(chalk.cyanBright(`First start webpack: `) + chalk.yellowBright(`npm run build`))
  log(chalk.cyanBright(`To start server: npm start`))
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example: ` + chalk.bold.cyanBright(`npm run api <name>`) + ` || use: ` + chalk.yellowBright(`quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nredux || example: ` + chalk.bold.cyanBright(`npm run redux <componentName>`) + ` || use: ` + chalk.yellowBright(`redux container, react component, react-router route`) + `\n\naction || example:` + chalk.bold.cyanBright(` npm run action`) + ` || use: ` + chalk.yellowBright(`create/apply action to existing/created reducer and selected containers`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let reduxNoBE = () => {
  reactRedux.reactReduxWithoutBackend()
  shell.cd(`${name}`)
  process.stdout.write('\033c')
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('redux react-router-dom react-redux react react-dom')
  installDevDependencies('webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name}`)
  log(`First start webpack: npm run build`)
  log(`To open project: npm start`)
  log('')
  log('Unique package.json Commands')
  log(boxen(`redux || example: ` + chalk.bold.cyanBright(`npm run redux <componentName>`) + ` || use: ` + chalk.yellowBright(`redux container, react component, react-router route`) + `\n\naction || example:` + chalk.bold.cyanBright(` npm run action`) + ` || use: ` + chalk.yellowBright(`create/apply action to existing/created reducer and selected containers`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let postgresMvcPug = () => {
  noReactApp.pugApp()
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon pg knex body-parser compression helmet dotenv bookshelf pug morgan cookie-parser')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  installKnexGlobal()
  modifyKnex()
  try {
    execSync(`createdb ${name};`, { stdio: 'ignore' });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name>`) + ` || use:` + chalk.yellowBright(` quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete endpoints`) + chalk.yellowBright(` for a resource`) + `\n\nmodel || example: npm run model User email:string posts:integer || use: creates Bookshelf model + migration\n\npage || example: npm run page Landing signup login || creates page routes and pug pages`, { padding: 1, borderColor: 'yellow' }))
  log('')
}

let posgresMvcNoPug = () => {
  noReactApp.railsApp()
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon pg knex body-parser compression helmet dotenv bookshelf morgan cookie-parser')
  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
  installKnexGlobal()
  modifyKnex()
  try {
    execSync(`createdb ${name};`, { stdio: 'ignore' });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name>`) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete `) + chalk.yellowBright(`endpoints for a resource`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:string posts:integer`) + ` || use: ` + chalk.yellowBright(`creates Bookshelf model + migration`) + `\n\npage || example:` + chalk.bold.cyanBright(` npm run page Landing`) + ` || use: ` + chalk.yellowBright(`creates page route and page`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let mongooseMvcPug = () => {
  noReactApp.pugApp()
  addMongooseToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon mongo body-parser compression helmet dotenv mongoose pug morgan cookie-parser')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete `) + chalk.yellowBright(` endpoints for a resource`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email: String posts: Number`) + ` || use: ` + chalk.yellowBright(`creates Mongoose model`) + `\n\npage || example:` + chalk.bold.cyanBright(` npm run page Article new all`) + ` || use:` + chalk.yellowBright(` creates controller and views`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let mongooseMvcNoPug = () => {
  noReactApp.railsApp()
  addMongooseToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon mongo body-parser compression helmet dotenv mongoose morgan cookie-parser')
  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:String posts:Number`) + ` || use: ` + chalk.yellowBright(`creates Mongoose model`) + `\n\npage || example:` + chalk.bold.cyanBright(` npm run page Landing`) + ` || use:` + chalk.yellowBright(` creates page and route`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let noDbMvcPug = () => {
  noReactApp.pugApp()
  process.stdout.write('\033c')
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon body-parser compression helmet dotenv pug morgan cookie-parser')
  installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\npage || example:` + chalk.bold.cyanBright(` npm run page Article new all`) + ` || use:` + chalk.yellowBright(` creates resource controller and views`), { padding: 1, borderColor: 'yellow' }))
  log('')
}


let noDbMvcNoPug = () => {
  noReactApp.railsApp()
  process.stdout.write('\033c')
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon body-parser compression helmet dotenv morgan cookie-parser')
  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\npage || example:` + chalk.cyanBright(`npm run page Landing`) + ` || use:` + chalk.yellowBright(` creates page in src folder + routes.js`), { padding: 1, borderColor: 'yellow' }))
  log('')
}

let postgresBE = () => {
  BE.backendOnly()
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon pg knex body-parser helmet dotenv bookshelf morgan')
  installKnexGlobal()
  modifyKnex()
  try {
    execSync(`createdb ${name};`, { stdio: 'ignore' });
  } catch (e) {
    // need some variable to indicate this failed and the user needs to make a new database
  }

  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nmodel || example:` + chalk.bold.cyanBright(` npm run model User email:string posts:integer`) + ` || use: ` + chalk.yellowBright(`create Bookshelf model + knex migration`), { padding: 1, borderColor: 'yellow' }))
  log('')
}


let mongooseBE = () => {
  BE.backendOnly()
  addMongooseToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon mongo body-parser helmet dotenv mongoose morgan')
  process.stdout.write('\033c')
  log('The project was created!')
  log(`cd into ${name} and run npm start`)
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyan(`example: npm run api <name> `) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`) + `\n\nmodel || example: ` + chalk.bold.cyanBright(`npm run model User email:String posts:Number`) + ` || use: create Mongoose model`, { padding: 1, borderColor: 'yellow' }))
  log('')
}

let noDbBE = () => {
  BE.backendOnly()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  install('express nodemon body-parser helmet dotenv morgan')
  process.stdout.write('\033c')
  log('The project was created!')
  log(chalk.cyanBright(`cd into ${name} and run npm start`))
  log('')
  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
  log('')
  log('Unique package.json Commands')
  log(boxen(`api || example:` + chalk.bold.cyanBright(` npm run api <name>`) + ` || ` + chalk.yellowBright(`use: quickly create`) + chalk.bold.redBright(` api/v1 get/post/put/delete`) + chalk.yellowBright(` endpoints for a resource`), { padding: 1, borderColor: 'yellow' }))
  log('')
}


let addScript = (command, script) => {
  let buffer = fs.readFileSync(`./${name}/package.json`)
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync(`./${name}/package.json`, newPackage)
}


let addBookshelfToEnzo = () => {
  let bookshelf = fs.readFileSync(path.resolve(__dirname, './templates/bookshelf.js'), 'utf8')
  let enzoCreateBookshelfModel = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateBookshelfModel.js'),'utf8')
  let migrationTemplate = fs.readFileSync(path.resolve(__dirname, './templates/migrationTemplate.js'),'utf8')
  let enzoBookshelfModelTemplate = fs.readFileSync(path.resolve(__dirname, './templates/enzoBookshelfModelTemplate.js'),'utf8')
  fs.writeFile(`./${name}/server/models/bookshelf.js`, bookshelf, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/enzoCreateBookshelfModel.js`, enzoCreateBookshelfModel, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/migrationTemplate.js`, migrationTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile(`./${name}/enzo/templates/enzoBookshelfModelTemplate.js`, enzoBookshelfModelTemplate, (err) => {
    if (err) console.error(err)
  })
  addScript('model', 'node enzo/enzoCreateBookshelfModel.js')
  // need to add script for this to package.json
}

let addMongooseToEnzo = () => {
  // first need to import mongoose and mongoose connect to the server/server.js file. 
  let model = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateMongooseModel.js'), 'utf8')
  let schemaTemplate = fs.readFileSync(path.resolve(__dirname, './templates/schemaTemplate.js'), 'utf8')
  fs.writeFile(`./${name}/enzo/model.js`, model, (err) => {
    if (err) throw err 
  })
  fs.writeFile(`./${name}/enzo/templates/schemaTemplate.js`,  schemaTemplate, (err) => {
    if (err) throw err 
  })
  addScript('model', 'node enzo/model.js')
}


let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`

let modifyKnex = () => {
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      fs.mkdirSync(`./db`)
      fs.mkdirSync(`./db/migrations`)
    })
  }
}

module.exports = createProject