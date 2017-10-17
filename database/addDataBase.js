const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let fs = require('fs')
let shell = require('shelljs')
const execSync = require('child_process').execSync;


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

let installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex')
    shell.exec('knex init')
  } else {
    shell.exec('npm install -g knex')
    shell.exec('knex init')
  }
}

let addDatabase = () => {
  process.stdout.write('\033c')
  rl.question('Postgres or MongoDB (P/M)? ', (answer) => {
    let type = answer.toLowerCase()
    if (type === 'p') {
      rl.question('What is the name of the database? ', (answer) => {
        let name = answer
        rl.close()
        install('knex pg')
        installKnexGlobal()
        let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: './db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`
        let modifyKnex = () => {
          if (fs.existsSync('./knexfile.js')) {
            fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
            fs.appendFile('./knexfile.js', newKnex, (err) => {
              if (err) throw err
              shell.exec('knex migrate:make initial')
            })
          }
        }
        modifyKnex()
        try {
          execSync(`createdb ${name};`, { stdio: 'ignore' });
        } catch (err) {
          if (err) throw err
          // need some variable to indicate this failed and the user needs to make a new database
        }

      })
    } else if (type === 'm') {
      rl.close()
      install('mongo')
      // could see if dotenv is installed, maybe also ask to modify the enzo api file
      if (fs.existsSync('./.env')) {
        fs.appendFile('./.env', `MONGODB_URI=''`, (err) => {
          if (err) throw err 
        }) 
      } else {
        fs.writeFileSync('./.env', `MONGODB_URI=''`)
        fs.readFile('./package.json', (err, data) => {
          if (err) throw err 
          let json = JSON.stringify(data)
          if (json.dependencies.dotenv != undefined) {
            console.log('it has dotenv!')
          } else {
            install('dotenv')
          }
        })
      }
    } else {
      console.log(`Looks like you didn't enter P or M. Please try again. `)
    }
  })
}


module.exports = addDatabase