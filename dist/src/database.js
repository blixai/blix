"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const store = require('./store');
const blixInternal_1 = require("../.internal/blixInternal");
const utils_1 = require("./utils");
const process_1 = require("./process");
const fs_1 = require("./fs");
function modifyKnex() {
    let name;
    let connectionName;
    if (store.name) {
        connectionName = store.name;
        name = './' + store.name + '/';
    }
    else {
        name = './';
        connectionName = utils_1.getCWDName();
    }
    try {
        let newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${connectionName}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
        if (fs.existsSync(`${name}knexfile.js`)) {
            fs.truncateSync(`${name}knexfile.js`, 0);
            fs_1.appendFile(`${name}knexfile.js`, newKnex);
        }
        else {
            fs_1.writeFile(`knexfile.js`, newKnex);
        }
        fs_1.mkdirSync(`db`);
        fs_1.mkdirSync(`db/migrations`);
    }
    catch (err) {
        blixInternal_1._logCaughtError('Error modifying Knex', err);
    }
}
exports.modifyKnex = modifyKnex;
;
function installKnexGlobal() {
    let name;
    if (store.name) {
        name = store.name;
        try {
            process.chdir(`./${name}`);
            if (store.useYarn) {
                process_1.execute(`yarn add knex global`);
            }
            else {
                process_1.execute(`npm install -g knex`);
            }
            process_1.execute(`createdb ${name}`);
            process.chdir('../');
        }
        catch (err) {
            blixInternal_1._logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err);
            process.chdir('../');
        }
    }
    else {
        name = utils_1.getCWDName();
        try {
            if (fs.existsSync('./yarn.lock')) {
                process_1.execute('yarn add knex global');
            }
            else {
                process_1.execute('npm install -g knex');
            }
            process_1.execute(`createdb ${name}`);
        }
        catch (err) {
            blixInternal_1._logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err);
        }
    }
}
exports.installKnexGlobal = installKnexGlobal;
;
