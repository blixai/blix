"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs_2 = require("./fs");
const process_1 = require("./process");
const store_1 = require("./store");
const utils_1 = require("./utils");
function modifyKnex() {
    let name;
    let connectionName;
    if (store_1.default.name) {
        connectionName = store_1.default.name;
        name = './' + store_1.default.name + '/';
    }
    else {
        name = './';
        connectionName = utils_1.getCWDName();
    }
    try {
        const newKnex = `module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/${connectionName}',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};`;
        if (fs_1.existsSync(`${name}knexfile.js`)) {
            fs_1.truncateSync(`${name}knexfile.js`, 0);
            fs_2.appendFile(`${name}knexfile.js`, newKnex);
        }
        else {
            fs_2.writeFile(`knexfile.js`, newKnex);
        }
        fs_2.mkdirSync(`db`);
        fs_2.mkdirSync(`db/migrations`);
    }
    catch (err) {
        utils_1._logCaughtError('Error modifying Knex', err);
    }
}
exports.modifyKnex = modifyKnex;
function installKnexGlobal() {
    let name;
    if (store_1.default.name) {
        name = store_1.default.name;
        try {
            process.chdir(`./${name}`);
            if (store_1.default.useYarn) {
                process_1.execute(`yarn add knex global`);
            }
            else {
                process_1.execute(`npm install -g knex`);
            }
            process_1.execute(`createdb ${name}`);
            process.chdir('../');
        }
        catch (err) {
            utils_1._logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err);
            process.chdir('../');
        }
    }
    else {
        name = utils_1.getCWDName();
        try {
            if (fs_1.existsSync('./yarn.lock')) {
                process_1.execute('yarn add knex global');
            }
            else {
                process_1.execute('npm install -g knex');
            }
            process_1.execute(`createdb ${name}`);
        }
        catch (err) {
            utils_1._logCaughtError(`Error creating db: make sure postgres is installed and running and try again by entering: createdb ${name}`, err);
        }
    }
}
exports.installKnexGlobal = installKnexGlobal;
