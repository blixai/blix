let fs       = require('fs')
let execSync = require('child_process').execSync;
let inquirer = require('inquirer')
let prompt   = inquirer.prompt
let helpers  = require('../../helpers')

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

let addDatabase = () => {
  process.stdout.write('\033c')
  prompt([database]).then(answer => {
    let type = answer.db 
    if (type === 'p') {
      prompt([databaseName]).then(ans => {
        let name = ans.name
        helpers.install('knex pg')
        helpers.installKnexGlobal()
        helpers.modifyKnex(name)
        try {
          execSync(`createdb ${name};`, { stdio: 'ignore' });
        } catch (err) {
          if (err) process.exit()
        }
      })
    } else {
      helpers.install('mongo')
      // could see if dotenv is installed, maybe also ask to modify the enzo api file
      if (fs.existsSync('./.env')) {
        fs.appendFile('./.env', `MONGODB=''`, (err) => {
          if (err) throw err 
        }) 
      } else {
        fs.writeFileSync('./.env', `MONGODB=''`)
        fs.readFile('./package.json', (err, data) => {
          if (err) throw err 
          let json = JSON.parse(data)
          if ("dotenv" in json.dependencies) {
            console.log('it has dotenv!')
          } else {
            helpers.install('dotenv')
          }
        })
      }
    } 
  })
}


module.exports = addDatabase