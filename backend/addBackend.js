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

let BE = require('./create')
let name = process.argv[3]

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

let addScript = (command, script) => {
  let buffer = fs.readFileSync('package.json')
  let json = JSON.parse(buffer)
  json.scripts[command] = script
  let newPackage = JSON.stringify(json, null, 2)
  fs.writeFileSync('package.json', newPackage)
}


// also need to ask if they'll be serving html
// also need if they want an html server see if they already have a source directory for pages
let addBackend = () => {
  if (name) {
    process.stdout.write('\033c')
    rl.question('Do you need a Postgres or MongoDB database? (Y/N) ', (database) => {
      database = database.toLowerCase()
      if (database === 'y') {
        rl.question('Postgres or Mongo? (P/M) ', (answer) => {
          answer = answer.toLowerCase()
          if (answer === 'p') {
            // postgres database
            BE.backendOnly()
            rl.close();
            console.log('Downloading dependencies and creating files, this may take a moment')
            install('express nodemon pg knex body-parser helmet bookshelf')
            installKnexGlobal()
            modifyKnex()
            try {
              execSync(`createdb ${name};`, { stdio: 'ignore' });
            } catch (e) {
              // need some variable to indicate this failed and the user needs to make a new database
            }
            addScript('server', 'nodemon server/server.js')
            addScript('api', 'node enzo/api.js')
            process.stdout.write('\033c')
            console.log('The backend was created!')
            console.log(`to start server enter npm run server`)
          } else {
            // express with mongodb
            BE.backendOnly()
            rl.close();
            console.log('Downloading dependencies and creating files, this may take a moment')
            install('express nodemon mongo body-parser helmet')
            addScript('server', 'nodemon server/server.js')
            addScript('api', 'node enzo/api.js')
            process.stdout.write('\033c')
            console.log('The backend was created!')
            console.log(`to start server enter npm run server`)
          }
        })
      } else {
        // backend without db
        BE.backendOnly()
        rl.close();
        console.log('Downloading dependencies and creating files, this may take a moment')
        install('express nodemon body-parser helmet')
        addScript('server', 'nodemon server/server.js')
        addScript('api', 'node enzo/api.js')
        process.stdout.write('\033c')
        console.log('The backend was created!')
        console.log(`to start server enter npm run server`)
      }
    })
  } else {
    process.exit()
  }
}

// need a condition if the name is not given
let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`

let modifyKnex = () => {
  if (fs.existsSync('./knexfile.js')) {
    fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
    fs.appendFile('./knexfile.js', newKnex, (err) => {
      if (err) throw err
      shell.exec('knex migrate:make initial')
    })
  }
}

module.exports = addBackend