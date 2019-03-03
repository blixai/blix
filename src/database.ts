const fs = require("fs");
const store = require('../new/store');
import { _logCaughtError } from '../.internal/blixInternal'
import { getCWDName } from './utils'
import { execute } from './process'
import { 
    writeFile,
    mkdirSync,
    appendFile
} from './fs'

export function modifyKnex() {
    let name
    let connectionName
    if (store.name) {
      connectionName = store.name
      name = './' + store.name + '/'
    } else {
      name = './'
      connectionName = getCWDName()
    }
    try {
      let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${connectionName}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
      if (fs.existsSync(`${name}knexfile.js`)) {
        fs.truncateSync(`${name}knexfile.js`, 0)
        appendFile(`${name}knexfile.js`, newKnex)
      } else {
        writeFile(`knexfile.js`, newKnex)
      }
      mkdirSync(`db`);
      mkdirSync(`db/migrations`);
    } catch (err) {
        _logCaughtError('Error modifying Knex', err)
    }
};

export function installKnexGlobal() {
    let name 
    if (store.name) {
      name = store.name
      try {
        process.chdir(`./${name}`)
        if (store.useYarn) {
          execute(`yarn add knex global`)
        } else {
          execute(`npm install -g knex`)
        }
        execute(`createdb ${name}`)
        process.chdir('../')
      } catch(err) {
          _logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err)
        process.chdir('../')
      }
    } else {
      name = getCWDName()
      try {
        if (fs.existsSync('./yarn.lock')) {
          execute('yarn add knex global')
        } else {
          execute('npm install -g knex')
        }
    
        execute(`createdb ${name}`)
      } catch (err) {
          _logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err)
      }
    }
};
