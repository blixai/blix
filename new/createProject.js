let fs         = require('fs')
let path       = require('path')
let shell      = require('shelljs')
let execSync   = require('child_process').execSync;
let chalk      = require('chalk');
let log        = console.log;
let boxen      = require('boxen')
let inquirer   = require('inquirer')
let prompt     = inquirer.prompt

// each project type and helpers
let spaBuild   = require('./createReactSPA/createReactSPA')
let reactRedux = require('./reactRedux/reactRedux')
let noReactApp = require('./createAppWithoutReact/createAppWithoutReact')
let BE         = require('./backendOnly/backendOnly')
let helpers    = require('../helpers')

// variables
let name       = process.argv[3]
let frontend;

// helper function to load files 
let loadFile = filePath => {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8')
}

//prompts
let project = {
  type    : 'list', message: 'What type of Project are you looking to build:',
  name    : 'project', 
  choices : [
    { name: 'React SPA'                                  },
    { name: 'React, Redux, React/Router', value: 'redux' },
    { name: 'MVC'                                        },
    { name: 'Backend Only'                               }
  ]
}

let backend = {
  type    : 'confirm',
  message : 'Do you need a backend:',
  name    : 'backend'
}

let database = {
  type    : 'list',
  message : 'Database:',
  name    : 'database' ,
  choices : [
    { name: 'MongoDB'  },
    { name: 'Postgres' },
    { name: 'None'     }
  ]
}

let pug = {
  type    : 'confirm',
  message : 'Do you want to use the templating engine pug',
  name    : 'pug'
}

let BEtest = {
  type    : 'list',
  message : 'Testing Tools:',
  name    : 'test',
  choices : [
    { name: 'Mocha & Chai', value: 'mocha' },
    { name: 'Jest',         value: 'jest'  }
  ]
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

let beOnly = async () => {
  let test = await prompt([BEtest])
  let db   = await prompt([database])
  if (db.database === 'Postgres') {
    postgresBE(test.test)
  } else if (db.database === 'MongoDB') {
    mongooseBE(test.test)
  } else {
    noDbBE(test.test)
  }
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
  helpers.install('express nodemon pg knex body-parser compression helmet react react-dom dotenv bookshelf morgan')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  helpers.installKnexGlobal()
  helpers.modifyKnex(name)
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
  helpers.install('express nodemon compression helmet mongo dotenv body-parser react react-dom dotenv mongoose morgan')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('express nodemon compression helmet body-parser react react-dom dotenv morgan')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('react react-dom')
  helpers.installDevDependencies('webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('redux react-router-dom react-redux express dotenv nodemon pg knex body-parser compression helmet react react-dom bookshelf morgan')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  helpers.installKnexGlobal()
  modifyKnex(name)
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
  helpers.install('redux react-router-dom react-redux express nodemon dotenv compression helmet mongo dotenv body-parser react react-dom mongoose morgan')
  helpers.installDevDependencies(' webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('redux react-router-dom react-redux express nodemon dotenv body-parser compression helmet react react-dom morgan')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('redux react-router-dom react-redux react react-dom')
  helpers.installDevDependencies('webpack webpack-dev-server babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('express nodemon pg knex body-parser compression helmet dotenv bookshelf pug morgan cookie-parser')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
  helpers.installKnexGlobal()
  helpers.modifyKnex(name)
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
  helpers.install('express nodemon pg knex body-parser compression helmet dotenv bookshelf morgan cookie-parser')
  helpers.installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
  helpers.installKnexGlobal()
  helpers.modifyKnex()
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
  helpers.install('express nodemon mongo body-parser compression helmet dotenv mongoose pug morgan cookie-parser')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('express nodemon mongo body-parser compression helmet dotenv mongoose morgan cookie-parser')
  helpers.installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
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
  helpers.install('express nodemon body-parser compression helmet dotenv pug morgan cookie-parser')
  helpers.installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env style-loader webpack-merge uglifyjs-webpack-plugin sass-loader node-sass extract-text-webpack-plugin cssnano postcss postcss-cssnext postcss-import postcss-loader')
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
  helpers.install('express nodemon body-parser compression helmet dotenv morgan cookie-parser')
  helpers.installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber gulp-sass gulp-postcss postcss-cssnext')
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

let postgresBE = (test) => {
  BE.backendOnly(test)
  addBookshelfToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  helpers.install('express nodemon pg knex body-parser helmet dotenv bookshelf morgan')
  beOnlyInstallTesting(test)
  helpers.installKnexGlobal()
  helpers.modifyKnex(name)
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


let mongooseBE = (test) => {
  BE.backendOnly(test)
  addMongooseToEnzo()
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  helpers.install('express nodemon mongo body-parser helmet dotenv mongoose morgan')
  beOnlyInstallTesting(test)
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

let noDbBE = (test) => {
  BE.backendOnly(test)
  shell.cd(`${name}`)
  log('Downloading dependencies and setting up the project, this may take a moment')
  helpers.install('express nodemon body-parser helmet dotenv morgan')
  beOnlyInstallTesting(test)
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

let beOnlyInstallTesting = (test) => {
  if (test === 'mocha') helpers.installDevDependencies('mocha chai chai-http')
  if (test === 'jest') helpers.installDevDependencies('jest supertest')
}


let addBookshelfToEnzo = () => {
  let bookshelf                  = loadFile('./templates/bookshelf.js')
  let enzoCreateBookshelfModel   = loadFile('./templates/enzoCreateBookshelfModel.js')
  let migrationTemplate          = loadFile('./templates/migrationTemplate.js')
  let enzoBookshelfModelTemplate = loadFile('./templates/enzoBookshelfModelTemplate.js')

  helpers.writeFile(`./${name}/server/models/bookshelf.js`,                   bookshelf                 )
  helpers.writeFile(`./${name}/enzo/enzoCreateBookshelfModel.js`,             enzoCreateBookshelfModel  )
  helpers.writeFile(`./${name}/enzo/templates/migrationTemplate.js`,          migrationTemplate         )
  helpers.writeFile(`./${name}/enzo/templates/enzoBookshelfModelTemplate.js`, enzoBookshelfModelTemplate)

  helpers.addScriptToNewPackageJSON('model', 'node enzo/enzoCreateBookshelfModel.js', name)
  // need to add script for this to package.json
}

let addMongooseToEnzo = () => {
  let model           = loadFile('./templates/enzoCreateMongooseModel.js')
  let schemaTemplate  = loadFile('./templates/schemaTemplate.js'         )

  helpers.writeFile(`./${name}/enzo/model.js`,                     model         )
  helpers.writeFile(`./${name}/enzo/templates/schemaTemplate.js`,  schemaTemplate)

  helpers.addScriptToNewPackageJSON('model', 'node enzo/model.js', name)
  addMongoDBToProject()
}

let addMongoDBToProject = () => {
  let server = fs.readFileSync(`./${name}/server/server.js`, 'utf8').toString().split('\n')
  server.splice(0, 0, `\nlet mongoose = require('mongoose')\nmongoose.connect(process.env.MONGO)\n`)
  let mongoAddedServer = server.join('\n')

  helpers.writeFile(`./${name}/server/server.js`, mongoAddedServer)
  helpers.writeFile(`./${name}/.env`, `MONGO="${`mongodb://localhost/${name}`}"`)
}


module.exports = createProject