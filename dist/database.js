"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var store = require('../new/store');
var blixInternal_1 = require("./blixInternal");
var utils_1 = require("./utils");
var process_1 = require("./process");
var fs_1 = require("./fs");
function modifyKnex() {
    var name;
    var connectionName;
    if (store.name) {
        connectionName = store.name;
        name = './' + store.name + '/';
    }
    else {
        name = './';
        connectionName = utils_1.getCWDName();
    }
    try {
        var newKnex = "module.exports = {\n\n\tdevelopment: {\n\t\tclient: 'pg',\n\t\tconnection: 'postgres://localhost/" + connectionName + "',\n\t\tmigrations: {\n\t\t\tdirectory: './db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t},\n\n\tproduction: {\n\t\tclient: 'pg',\n\t\tconnection: process.env.DATABASE_URL + '?ssl=true',\n\t\tmigrations: {\n\t\t\tdirectory: 'db/migrations'\n\t\t},\n\t\tseeds: {\n\t\t\tdirectory: 'db/seeds/dev'\n\t\t},\n\t\tuseNullAsDefault: true\n\t}\n\n};";
        if (fs.existsSync(name + "knexfile.js")) {
            fs.truncateSync(name + "knexfile.js", 0);
            fs_1.appendFile(name + "knexfile.js", newKnex);
        }
        else {
            fs_1.writeFile("knexfile.js", newKnex);
        }
        fs_1.mkdirSync("db");
        fs_1.mkdirSync("db/migrations");
    }
    catch (err) {
        blixInternal_1._logCaughtError('Error modifying Knex', err);
    }
}
exports.modifyKnex = modifyKnex;
;
function installKnexGlobal() {
    var name;
    if (store.name) {
        name = store.name;
        try {
            process.chdir("./" + name);
            if (store.useYarn) {
                process_1.execute("yarn add knex global");
            }
            else {
                process_1.execute("npm install -g knex");
            }
            process_1.execute("createdb " + name);
            process.chdir('../');
        }
        catch (err) {
            blixInternal_1._logCaughtError("Error creating db: make sure postgres is installed and running and try again by entering: createdb " + name, err);
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
            process_1.execute("createdb " + name);
        }
        catch (err) {
            blixInternal_1._logCaughtError("Error creating db: make sure postgres is installed and running and try again by entering: createdb " + name, err);
        }
    }
}
exports.installKnexGlobal = installKnexGlobal;
;
