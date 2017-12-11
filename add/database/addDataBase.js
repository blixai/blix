let fs = require('fs')
let shell = require('shelljs')
const execSync = require('child_process').execSync;
let inquirer = require('inquirer')
let prompt = inquirer.prompt

let database = {
  type: 'list',
  message: 'Postgres or MongoDB:',
  name: 'db',
  choices: [
    { name: 'Postgres', value: 'p' },
    { name: 'MongoDB', value: 'm'}
  ]
}

let databaseName = {
  type: 'input',
  message: 'What is the name of the database:',
  name: 'name'
}

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

let installKnexGlobal = () => {
  if (shouldUseYarn()) {
    shell.exec('yarn global add knex', {silent:true})
    shell.exec('knex init', {silent:true})
  } else {
    shell.exec('npm install -g knex', {silent:true})
    shell.exec('knex init', {silent:true})
  }
}

let addDatabase = () => {
  process.stdout.write('\033c')
  prompt([database]).then(answer => {
    let type = answer.db 
    if (type === 'p') {
      prompt([databaseName]).then(ans => {
        let name = ans.name
        install('knex pg')
        installKnexGlobal()
        let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${name}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: './db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`
        let modifyKnex = () => {
          if (fs.existsSync('./knexfile.js')) {
            fs.truncateSync('./knexfile.js', 0, function () { console.log('done') })
            fs.appendFile('./knexfile.js', newKnex, (err) => {
              if (err) throw err
            })
          }
        }
        modifyKnex()
        try {
          execSync(`createdb ${name};`, { stdio: 'ignore' });
        } catch (err) {
          if (err) throw err
        }
      })
    } else {
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
          let json = JSON.parse(data)
          if ("dotenv" in json.dependencies) {
            console.log('it has dotenv!')
          } else {
            install('dotenv')
          }
        })
      }
    } 
  })
}


module.exports = addDatabase