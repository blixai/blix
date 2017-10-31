const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const execSync = require('child_process').execSync;


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
              shell.cd(`${name}`)
              install('express nodemon pg knex body-parser compression helmet react react-dom dotenv bookshelf')
              installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              installKnexGlobal()
              modifyKnex()
              try {
                execSync(`createdb ${name}`, { stdio: 'ignore' });
              } catch (e) {
                // need some variable to indicate this failed and the user needs to make a new database
              }
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm run build then run npm start`)
            } else {
              spaBuild.writeFilesWithSPAReact()
              rl.close();
              fs.writeFileSync(`./${name}/.env`)
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon compression helmet mongo dotenv body-parser react react-dom dotenv mongoose')
              installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm run build then run npm start`)
            }
          })
        } else {
          rl.close();
          spaBuild.writeFilesWithSPAReact()
          shell.cd(`${name}`)
          console.log('Downloading dependencies and setting up the project, this may take a moment')
          install('express nodemon compression helmet body-parser react react-dom dotenv')
          installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
          process.stdout.write('\033c')
          console.log('The project was created!')
          console.log(`cd into ${name} and run npm run build then run npm start`)
        }
      })
    } else {
      spaBuild.reactSPAWithoutBackend()
      console.log('Installing dependencies and running setup, this may take a moment')
      rl.close()
      shell.cd(`${name}`)
      install('react react-dom')
      installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
      process.stdout.write('\033c')
      console.log('The project was created!')
      console.log(`cd into ${name} and run npm start, then refresh the page after a second`)
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
              rl.close();
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
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
              console.log('The project was created!')
              console.log(`cd into ${name}`)
              console.log("\x1b[35m", `First start webpack: npm run build`)
              console.log("\x1b[34m", `To start server: npm start`)
            } else {
              // build a react/redux with mongo backend
              rl.close();
              reactRedux.ReactReduxWithBackend()
              shell.cd(`${name}`)
              process.stdout.write('\033c')
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('redux react-router-dom react-redux express nodemon dotenv compression helmet mongo dotenv body-parser react react-dom mongoose')
              installDevDependencies(' webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name}`)
              console.log("\x1b[35m", `First start webpack: npm run build`)
              console.log("\x1b[34m", `To start server: npm start`)
            }
          })
        } else {
          // build a react/redux without a db
          rl.close();
          reactRedux.ReactReduxWithBackend()
          shell.cd(`${name}`)
          process.stdout.write('\033c')
          console.log('Downloading dependencies and setting up the project, this may take a moment')
          install('redux react-router-dom react-redux express nodemon dotenv body-parser compression helmet react react-dom')
          installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
          process.stdout.write('\033c')
          console.log('The project was created!')
          console.log(`cd into ${name}`)
          console.log("\x1b[35m", `First start webpack: npm run build`)
          console.log("\x1b[34m", `To start server: npm start`)
        }
      })
    } else {
      // create react redux without a backend
      //  This part could probably use webpack-dev-server similar to create-react-app
      rl.close();
      reactRedux.reactReduxWithoutBackend()
      shell.cd(`${name}`)
      process.stdout.write('\033c')
      console.log('Downloading dependencies and setting up the project, this may take a moment')
      install('redux react-router-dom react-redux react react-dom')
      installDevDependencies('webpack babel-loader css-loader babel-core babel-preset-env babel-preset-react style-loader webpack-merge uglifyjs-webpack-plugin')
      process.stdout.write('\033c')
      console.log('The project was created!')
      console.log(`cd into ${name}`)
      console.log("\x1b[35m", `First start webpack: npm run build`)
      console.log("\x1b[34m", `To open project: npm start`)
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
              rl.close();
              noReactApp.railsApp()
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon pg knex body-parser compression helmet dotenv bookshelf')
              installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser')
              installKnexGlobal()
              modifyKnex()
              try {
                execSync(`createdb ${name};`, { stdio: 'ignore' });
              } catch (e) {
                // need some variable to indicate this failed and the user needs to make a new database
              }
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm start`)
            } else {
              // create project with mongoDB
              rl.close();
              noReactApp.railsApp()
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon mongo body-parser compression helmet dotenv mongoose')
              installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser')
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm start`)
            }
          })
        } else {
          // create project without db
          rl.close();
          noReactApp.railsApp()
          process.stdout.write('\033c')
          shell.cd(`${name}`)
          console.log('Downloading dependencies and setting up the project, this may take a moment')
          install('express nodemon body-parser compression helmet dotenv')
          installDevDependencies('babel-core babel-preset-env babelify gulp gulp-uglify gulp-rename browserify gulp-htmlmin gulp-clean-css gulp-tap gulp-buffer del run-sequence envify bundle-collapser')
          process.stdout.write('\033c')
          console.log('The project was created!')
          console.log(`cd into ${name} and run npm start`)
        }
      })
    } else {
      // create project without react or backend
      // readme, gitignore, index.html, index.js, main.css
      noReactApp.createBasicApp()
      rl.close()
      console.log(`Project created! cd into ${name} and open index.html`)
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
              rl.close();
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon pg knex body-parser helmet dotenv bookshelf')
              addBookshelfToEnzo()
              installKnexGlobal()
              modifyKnex()
              try {
                execSync(`createdb ${name};`, { stdio: 'ignore' });
              } catch (e) {
                // need some variable to indicate this failed and the user needs to make a new database
              }

              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm start`)
            } else {
              // express with mongodb
              BE.backendOnly()
              rl.close();
              shell.cd(`${name}`)
              console.log('Downloading dependencies and setting up the project, this may take a moment')
              install('express nodemon mongo body-parser helmet dotenv mongoose')
              process.stdout.write('\033c')
              console.log('The project was created!')
              console.log(`cd into ${name} and run npm start`)
            }
          })
        } else {
          // backend without db
          BE.backendOnly()
          rl.close();
          shell.cd(`${name}`)
          console.log('Downloading dependencies and setting up the project, this may take a moment')
          install('express nodemon body-parser helmet dotenv')
          process.stdout.write('\033c')
          console.log('The project was created!')
          console.log(`cd into ${name} and run npm start`)
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
  let enzoCreateBookshelfModel = fs.readFileSync(path.resolve(__dirname, './templates/enzoCreateBookshelfModel.js'),'utf8')
  let migrationTemplate = fs.readFileSync(path.resolve(__dirname, './templates/migrationTemplate.js'),'utf8')
  let enzoBookshelfModel = fs.readFileSync(path.resolve(__dirname, './templates/enzoBookshelfModel.js'),'utf8')
  fs.writeFile('./enzo/enzoCreateBookshelfModel.js', enzoCreateBookshelfModel, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/migrationTemplate.js', migrationTemplate, (err) => {
    if (err) console.error(err)
  })
  fs.writeFile('./enzo/templates/enzoBookshelfModel.js', enzoBookshelfModel, (err) => {
    if (err) console.error(err)
  })
  addScript('model', 'node enzo/enzoCreateBookshelfModel')
  // need to add script for this to package.json
}



let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`

let modifyKnex = () => {
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      shell.exec('knex migrate:make initial')
    })
  }
}

module.exports = createProject