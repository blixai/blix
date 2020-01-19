"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const inquirer = require("inquirer");
const ora = require("ora");
const child_process_1 = require("child_process");
const fs_1 = require("./fs");
const logger_1 = require("./logger");
const process_1 = require("./process");
const store_1 = require("./store");
const utils_1 = require("./utils");
function canUseYarn() {
    if (fs.existsSync('yarn.lock')) {
        store_1.default.useYarn = true;
        return true;
    }
    else if (fs.existsSync('package-lock.json')) {
        store_1.default.useYarn = false;
        return false;
    }
    try {
        child_process_1.execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.canUseYarn = canUseYarn;
const yarnPrompt = {
    message: 'Do you want to use Yarn to install packages',
    name: 'yarn',
    type: 'confirm',
};
function yarn() {
    return __awaiter(this, void 0, void 0, function* () {
        if (canUseYarn() && store_1.default.useYarn === '') {
            const yarnAnswer = yield inquirer.prompt([yarnPrompt]);
            store_1.default.useYarn = yarnAnswer.yarn;
        }
    });
}
exports.yarn = yarn;
function checkScriptsFolderExist() {
    if (!fs.existsSync('./scripts')) {
        fs_1.mkdirSync('scripts');
        fs_1.mkdirSync('scripts/templates');
    }
    else if (!fs.existsSync('./scripts/templates')) {
        fs_1.mkdirSync('scripts/templates');
    }
}
exports.checkScriptsFolderExist = checkScriptsFolderExist;
function checkIfScriptIsTaken(scriptName) {
    try {
        const buffer = fs.readFileSync('./package.json');
        const packageJson = JSON.parse(buffer);
        return scriptName in packageJson.scripts;
    }
    catch (err) {
        utils_1._logCaughtError(`Error finding ${scriptName} in package.json`, err);
        return false;
    }
}
exports.checkIfScriptIsTaken = checkIfScriptIsTaken;
function installAllPackages() {
    return __awaiter(this, void 0, void 0, function* () {
        if (store_1.default.dependencies) {
            yield installDependencies(store_1.default.dependencies);
        }
        if (store_1.default.devDependencies) {
            yield installDependencies(store_1.default.devDependencies, 'dev');
        }
    });
}
exports.installAllPackages = installAllPackages;
function addScriptToPackageJSON(command, script) {
    let filePath = '';
    if (store_1.default.name) {
        filePath = `./${store_1.default.name}/package.json`;
    }
    else {
        filePath = './package.json';
    }
    try {
        const buffer = fs.readFileSync(filePath);
        const json = JSON.parse(buffer); // jslint-ignore
        json.scripts[command] = script;
        const newPackage = JSON.stringify(json, null, 2);
        fs.writeFileSync(filePath, newPackage);
        logger_1.logInsert(`${command} script into package.json`);
    }
    catch (err) {
        utils_1._logCaughtError(`Failed to add script ${command} to package.json`, err);
    }
}
exports.addScriptToPackageJSON = addScriptToPackageJSON;
function installDependencies(packages, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinnerText = type === 'dev'
            ? ' Downloading development dependencies'
            : ' Downloading dependencies';
        const spinner = ora(spinnerText).start();
        try {
            if (store_1.default.name) {
                process.chdir(`./${store_1.default.name}`);
            }
            if (store_1.default.useYarn) {
                const command = type === 'dev' ? `yarn add ${packages} --dev` : `yarn add ${packages}`;
                yield process_1.execute(command);
            }
            else {
                const command = type === 'dev'
                    ? `npm install --save-dev ${packages}`
                    : `npm install --save ${packages}`;
                yield process_1.execute(command);
            }
            if (store_1.default.name) {
                process.chdir('../');
            }
            spinner.succeed();
        }
        catch (err) {
            if (store_1.default.name) {
                process.chdir('../');
            }
            spinner.fail();
            utils_1._logCaughtError('Something went wrong while installing the packages', err);
        }
    });
}
exports.installDependencies = installDependencies;
/**
 *
 * @param {string} deps - string of space separated packages to install
 * @param type - string of any kind, usually 'dev' to indicate to add as a devDependency
 */
function addDependenciesToStore(deps, type) {
    if (type) {
        if (!store_1.default.devDependencies) {
            store_1.default.devDependencies = deps;
        }
        else {
            store_1.default.devDependencies += ' ' + deps;
        }
    }
    if (!type) {
        if (!store_1.default.dependencies) {
            store_1.default.dependencies = deps;
        }
        else {
            store_1.default.dependencies += ' ' + deps;
        }
    }
}
exports.addDependenciesToStore = addDependenciesToStore;
