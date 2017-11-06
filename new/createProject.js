const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    shell.exec(`yarn add ${packages}`)
  } else {
    shell.exec(`npm install --save ${packages}`)
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

let installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex')
    shell.exec('knex init')
  } else {
    shell.exec('npm install -g knex')
    shell.exec('knex init')
  }
}

let createProject = () => {
  if (name) {
    fs.mkdirSync(`./${name}`)
    process.stdout.write('\033c')
    rl.question('Do you need a Frontend? (Y/N) ', (answer) => {
      answer = answer.toLowerCase()
      if (answer === 'y') {
        rl.question('Will you be using React? (Y/N) ', (react) => {
          react = react.toLowerCase()
          if (react === 'y') {
            rl.question('Do you need Redux and React Router? (Y/N) ', (spa) => {
              spa = spa.toLowerCase()
              if (spa === 'y') {
                createReactRedux()
              } else {
                createReactSPA()
              }
            })
          } else {
            createAppWithoutReact()
          }
        })
      } else {
        frontend = false
        createBackend()
      }
    })
  } else {
    // need to include a message
    rl.close()
  }
}


let createReactSPA = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Will you use a Postgres or MongoDB database? (Y/N) ', (database) => {
        database = database.toLowerCase()
        if (database === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (type) => {
            type = type.toLowerCase()
            if (type === 'p') {
              rl.close();
              spaBuild.writeFilesWithSPAReact()
              addBookshelfToEnzo()
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon pg knex body-parser compression helmet react react-dom dotenv bookshelf')
              installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
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
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nreact || example: npm run react <componentName> || use: quickly create a stateful or stateless React component\n\nmodel || example: npm run model User email:string || use: create a Bookshelf model + database migration`, { padding: 1, borderColor: 'yellow' }))
              log('')
            } else {
              spaBuild.writeFilesWithSPAReact()
              addMongooseToEnzo()
              rl.close();
              fs.writeFileSync(`./${name}/.env`)
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon compression helmet mongo dotenv body-parser react react-dom dotenv mongoose')
              installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
              process.stdout.write('\033c')
              log('')
              log('The project was created!')
              log(`cd into ${name}`)
              log('First: npm run build')
              log('Then: npm start')
              log('')
              log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
              log('')
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nreact || example: npm run react <componentName> || use: quickly create a stateful or stateless React component\n\nmodel || example: npm run model User email:String password:String posts:Number || use: create a Mongoose model`, { padding: 1, borderColor: 'yellow' }))
              log('')
            }
          })
        } else {
          rl.close();
          spaBuild.writeFilesWithSPAReact()
          shell.cd(`${name}`)
          log('Downloading dependencies and setting up the project, this may take a moment')
          install('express nodemon compression helmet body-parser react react-dom dotenv')
          installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
          process.stdout.write('\033c')
          log('')
          log('The project was created!')
          log(`cd into ${name}`)
          log('First: npm run build')
          log('Then: npm start')
          log('')
          log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
          log('')
          log('Enzo Project Commands')
          log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nreact || example: npm run react <componentName> || use: quickly create a stateful or stateless React component`, { padding: 1, borderColor: 'yellow' }))
          log('')
        }
      })
    } else {
      spaBuild.reactSPAWithoutBackend()
      log('Installing dependencies and running setup, this may take a moment')
      rl.close()
      shell.cd(`${name}`)
      install('react react-dom')
      installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
      process.stdout.write('\033c')
      log('The project was created!')
      log(`cd into ${name} and run npm start, then refresh the page after a second`)
      log('Enzo Project Commands')
      log(boxen(`react || example: npm run react <componentName> || use: quickly create a stateful or stateless React component`, { padding: 1, borderColor: 'yellow' }))
      log('')
    }
  })
}



let createReactRedux = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Do you need a Postgres or MongoDB database? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (database) => {
            database = database.toLowerCase()
            if (database === 'p') {
              reactRedux.ReactReduxWithBackend()
              addBookshelfToEnzo()
              rl.close();
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('redux react-router-dom react-redux express dotenv nodemon pg knex body-parser compression helmet react react-dom bookshelf')
              installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
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
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nredux || example: npm run redux <componentName> || use: redux container + react component + react-router route\n\nmodel || example: npm run model User email:string || use: create a Bookshelf model + knex database migration`, { padding: 1, borderColor: 'yellow' }))
              log('')
            } else {
              // build a react/redux with mongo backend
              rl.close();
              reactRedux.ReactReduxWithBackend()
              addMongooseToEnzo()
              shell.cd(`${name}`)
              process.stdout.write('\033c')
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('redux react-router-dom react-redux express nodemon dotenv compression helmet mongo dotenv body-parser react react-dom mongoose')
              installDevDependencies(' webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
              process.stdout.write('\033c')
              log('The project was created!')
              log(`cd into ${name}`)
              log(`First start webpack: ` + chalk.cyanBright(`npm run build`))
              log(`To start server: ` + chalk.cyanBright(`npm start`))
              log('')
              log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
              log('')
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nredux || example: npm run redux <componentName> || use: redux container + react component + react-router route\n\nmodel || example: npm run model User email:String posts:Number password:String || use: create a Mongoose model`, { padding: 1, borderColor: 'yellow' }))
              log('')
            }
          })
        } else {
          // build a react/redux without a db
          rl.close();
          reactRedux.ReactReduxWithBackend()
          shell.cd(`${name}`)
          process.stdout.write('\033c')
          log(chalk.cyanBright('Downloading dependencies and setting up the project, this may take a moment'))
          install('redux react-router-dom react-redux express nodemon dotenv body-parser compression helmet react react-dom')
          installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
          process.stdout.write('\033c')
          log(chalk.cyanBright('The project was created!'))
          log(chalk.cyanBright(`cd into ${name}`))
          log(chalk.cyanBright(`First start webpack: `) + chalk.yellowBright(`npm run build`))
          log(chalk.cyanBright(`To start server: npm start`))
          log('')
          log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
          log('')
          log('Enzo Project Commands')
          log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nredux || example: npm run redux <componentName> || use: redux container, react component, react-router route`, { padding: 1, borderColor: 'yellow' }))
          log('')
        }
      })
    } else {
      // create react redux without a backend
      //  This part could probably use webpack-dev-server similar to create-react-app
      rl.close();
      reactRedux.reactReduxWithoutBackend()
      shell.cd(`${name}`)
      process.stdout.write('\033c')
      log('Downloading dependencies and setting up the project, this may take a moment')
      install('redux react-router-dom react-redux react react-dom')
      installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
      process.stdout.write('\033c')
      log('The project was created!')
      log(`cd into ${name}`)
      log(`First start webpack: npm run build`)
      log(`To open project: npm start`)
      log('')
      log('Enzo Project Commands')
      log(boxen(`redux || example: npm run redux <componentName> || use: redux container, react component, react-router route`, { padding: 1, borderColor: 'yellow' }))
      log('')
    }
  })
}



let createAppWithoutReact = () => {
  rl.question('Do you need a backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Do you want to use a Postgres or MongoDB database? (Y/N) ', (answer) => {
        answer = answer.toLowerCase()
        if (answer === 'y') {
          rl.question('Postgres or MongoDB? (P/M) ', (database) => {
            database = database.toLowerCase()
            if (database === 'p') {
              // create project with postgres
              rl.question('Do you want to use the templating engine Pug? (Y/N) ', (answer) => {
                answer = answer.toLowerCase()
                if (answer === 'y') {
                  // create pug postgres rails app 
                  rl.close();
                  noReactApp.pugApp()
                  addBookshelfToEnzo()
                  shell.cd(`${name}`)
                  log('Downloading dependencies and setting up the project, this may take a moment')
                  install('express nodemon pg knex body-parser compression helmet dotenv bookshelf pug')
                  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
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
                  log('Enzo Project Commands')
                  log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:string posts:integer || use: creates Bookshelf model + migration\n\npage || example: npm run page Landing signup login || creates page routes and pug pages`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                } else {
                  rl.close();
                  noReactApp.railsApp()
                  addBookshelfToEnzo()
                  shell.cd(`${name}`)
                  log('Downloading dependencies and setting up the project, this may take a moment')
                  install('express nodemon pg knex body-parser compression helmet dotenv bookshelf')
                  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
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
                  log('Enzo Project Commands')
                  log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:string posts:integer || use: creates Bookshelf model + migration\n\npage || example: npm run page Landing || use: creates page route and page`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                }
              })
            } else {
              // create project with mongoDB
              rl.question('Do you want to use the templating engine Pug? (Y/N) ', (answer) => {
                answer = answer.toLowerCase()
                if (answer === 'y') {
                  noReactApp.pugApp()
                  rl.close();
                  addMongooseToEnzo()
                  shell.cd(`${name}`)
                  log('Downloading dependencies and setting up the project, this may take a moment')
                  install('express nodemon mongo body-parser compression helmet dotenv mongoose pug')
                  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
                  process.stdout.write('\033c')
                  log('The project was created!')
                  log(`cd into ${name} and run npm start`)
                  log('')
                  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                  log('Enzo Project Commands')
                  log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:String posts:Number || use: creates Mongoose model\n\npage || example: npm run page Landing signup || use: creates resource page + sub pages`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                } else {
                  rl.close();
                  noReactApp.railsApp()
                  addMongooseToEnzo()
                  shell.cd(`${name}`)
                  log('Downloading dependencies and setting up the project, this may take a moment')
                  install('express nodemon mongo body-parser compression helmet dotenv mongoose')
                  installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
                  process.stdout.write('\033c')
                  log('The project was created!')
                  log(`cd into ${name} and run npm start`)
                  log('')
                  log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                  log('Enzo Project Commands')
                  log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:String posts:Number || use: creates Mongoose model\n\npage || example: npm run page Landing || use: creates page and route`, { padding: 1, borderColor: 'yellow' }))
                  log('')
                }
              })
            }
          })
        } else {
          // create project without db
          rl.question('Do you want to use the templating engine Pug? (Y/N) ', (answer) => {
            answer = answer.toLowerCase()
            if (answer === 'y') {
              rl.close();
              noReactApp.pugApp()
              process.stdout.write('\033c')
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon body-parser compression helmet dotenv pug')
              installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
              process.stdout.write('\033c')
              log('The project was created!')
              log(`cd into ${name} and run npm start`)
              log('')
              log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
              log('')
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\npage || example: npm run page Landing login || use: creates resource page + sub pages`, { padding: 1, borderColor: 'yellow' }))
              log('')
            } else {
              rl.close();
              noReactApp.railsApp()
              process.stdout.write('\033c')
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon body-parser compression helmet dotenv')
              installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser gulp-plumber')
              process.stdout.write('\033c')
              log('The project was created!')
              log(`cd into ${name} and run npm start`)
              log('')
              log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
              log('')
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\npage || example: npm run page Landing login || use: creates resource page + sub pages`, { padding: 1, borderColor: 'yellow' }))
              log('')
            }
          })
        }
      })
    } else {
      // create project without react or backend
      // readme, gitignore, index.html, index.js, main.css
      noReactApp.createBasicApp()
      rl.close()
      log(`Project created! cd into ${name} and open index.html`)
    }
  })
}



// create a backend only project
let createBackend = () => {
  rl.question('Do you need a Backend? (Y/N) ', (backend) => {
    backend = backend.toLowerCase()
    if (backend === 'y') {
      rl.question('Do you need a Postgres or MongoDB database? (Y/N) ', (database) => {
        database = database.toLowerCase()
        if (database === 'y') {
          rl.question('Postgres or Mongo? (P/M) ', (answer) => {
            answer = answer.toLowerCase()
            if (answer === 'p') {
              // postgres database
              BE.backendOnly()
              addBookshelfToEnzo()
              rl.close();
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon pg knex body-parser helmet dotenv bookshelf')
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
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:string || use: create Bookshelf model + knex migration`, { padding: 1, borderColor: 'yellow' }))
              log('')
            } else {
              // express with mongodb
              BE.backendOnly()
              addMongooseToEnzo()
              rl.close();
              shell.cd(`${name}`)
              log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon mongo body-parser helmet dotenv mongoose')
              process.stdout.write('\033c')
              log('The project was created!')
              log(`cd into ${name} and run npm start`)
              log('')
              log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
              log('')
              log('Enzo Project Commands')
              log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource\n\nmodel || example: npm run model User email:String posts:Number || use: create Mongoose model`, { padding: 1, borderColor: 'yellow' }))
              log('')
            }
          })
        } else {
          // backend without db
          BE.backendOnly()
          rl.close();
          shell.cd(`${name}`)
          log('Downloading dependencies and setting up the project, this may take a moment')
          install('express nodemon body-parser helmet dotenv')
          process.stdout.write('\033c')
          log('The project was created!')
          log(`cd into ${name} and run npm start`)
          log('')
          log(boxen(`served at localhost:3000`, { padding: 1, borderColor: 'yellow' }))
          log('')
          log('Enzo Project Commands')
          log(boxen(`api || example: npm run api <name> || use: quickly create api/v1 get/post/put/delete endpoints for a resource`, { padding: 1, borderColor: 'yellow' }))
          log('')
        }
      })
    } else {
      // check to see if frontend is false, if it is....
    }
  })
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
    })
  }
}

module.exports = createProject